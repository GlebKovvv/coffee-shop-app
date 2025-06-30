/* ───────────────────────────────────────────────────────────────
   src/controllers/orderController.js
   Полный контроллер заказов для POS + Queue
   ───────────────────────────────────────────────────────────── */
'use strict';

const {
  order, orderitem, orderitemaddons,
  menuitem,   extra,
  staff,      client,                // «client» = таблица гостей/клиентов
  sequelize
} = require('../models');
const { Op } = require('sequelize');

/* постоянные ID статусов (orderstatus) */
const STATUS_NEW       = 1;
const STATUS_COMPLETED = 2;

/* ───────────────────── вспомогательные ────────────────────── */

/** Следующий суточный номер заказа (сбрасывается в 00:00) */
async function nextDailyNumber(t) {
  const d = new Date(); d.setHours(0, 0, 0, 0);
  const cnt = await order.count({
    where: { orderdatetime: { [Op.gte]: d } },
    transaction: t
  });
  return cnt + 1;
}

/** staffId: берём из body либо выбираем первого сотрудника */
async function resolveStaffId(t, id) {
  if (id) return id;
  const s = await staff.findOne({
    attributes: ['staffid'],
    transaction: t
  });
  if (!s) throw new Error('no-staff');
  return s.staffid;
}

/* ───────────────────── маршруты ───────────────────────────── */

/** GET /api/orders/active  ― очередь (не выполненные) */
exports.getActive = async (_req, res) => {
  try {
    const sql = `
      SELECT o.orderid,
             COALESCE(o.ordernumber, o.orderid) AS ordernumber,
             to_char(o.orderdatetime, 'HH24:MI') AS time,
             o.totalamount,
             STRING_AGG(m.name || ' ×' || oi.quantity, ', ') AS items
      FROM   "order" o
      JOIN   orderitem oi ON oi.orderid = o.orderid
      JOIN   menuitem  m  ON m.menuitemid = oi.menuitemid
      WHERE  o.orderstatusid <> :done
      GROUP  BY o.orderid
      ORDER  BY o.orderdatetime`;
    const list = await sequelize.query(sql, {
      replacements: { done: STATUS_COMPLETED },
      type: sequelize.QueryTypes.SELECT
    });
    res.json(list);
  } catch (e) {
    console.error('getActive error:', e);
    res.status(500).json({ error: 'db error' });
  }
};

/** POST /api/orders  ― создание заказа из POS */
exports.create = async (req, res) => {
  const { items, payType = 'cash', staffId, clientid = null, discount = 0 } = req.body;

  if (!Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: 'items required' });
  }

  try {
    const result = await sequelize.transaction(async t => {
      const sid = await resolveStaffId(t, staffId);           // кассир
      const num = await nextDailyNumber(t);                   // суточный №
      const total = items.reduce((s, p) => s + p.price * (p.qty || 1), 0) - discount;

      /* —–– заказ */
      const ord = await order.create({
        orderdatetime  : new Date(),
        totalamount    : total,
        ordernumber    : num,
        orderstatusid  : STATUS_NEW,
        paymentmethodid: payType === 'card' ? 2 : 1,
        staffid        : sid,
        clientid
      }, { transaction: t });

      /* —–– позиции + добавки */
      for (const p of items) {
        const oi = await orderitem.create({
          orderid   : ord.orderid,
          menuitemid: p.menuitemid,
          quantity  : p.qty || 1,
          price     : p.price
        }, { transaction: t });

        for (const exId of p.extras || []) {
          await orderitemaddons.create(
            { orderitemid: oi.orderitemid, extraid: exId },
            { transaction: t }
          );
        }
      }

      /* —–– начисляем клиенту баллы (1 балл / 50 ₽) */
      if (clientid) {
        const pts = Math.floor(total / 50);
        await client.increment(
          { loyaltypoints: pts },
          { where: { clientid }, transaction: t }
        );
      }

      return { orderid: ord.orderid, number: num };
    });

    res.status(201).json(result);
  } catch (e) {
    console.error('create error:', e);
    if (e.message === 'no-staff')
      return res.status(400).json({ error: 'таблица staff пуста' });
    res.status(500).json({ error: 'db error' });
  }
};

/** PUT /api/orders/:id/complete  ― отметка «готово/выдан» */
exports.complete = async (req, res) => {
  try {
    const o = await order.findByPk(req.params.id);
    if (!o) return res.status(404).json({ error: 'not found' });
    o.orderstatusid = STATUS_COMPLETED;
    await o.save();
    res.json({ success: true });
  } catch (e) {
    console.error('complete error:', e);
    res.status(500).json({ error: 'db error' });
  }
};

/** GET /api/orders  ― полный список (опц. ?status=) */
exports.getAll = async (req, res) => {
  const where = req.query.status
    ? { orderstatusid: req.query.status }
    : undefined;
  try {
    const list = await order.findAll({
      where,
      include: [
        {
          model: orderitem,
          include: [
            { model: orderitemaddons, include: [extra] },
            { model: menuitem }
          ]
        }
      ],
      order: [['orderdatetime', 'DESC']]
    });
    res.json(list);
  } catch (err) {
    console.error('getAll error:', err);
    res.status(500).json({ error: 'db error' });
  }
};
