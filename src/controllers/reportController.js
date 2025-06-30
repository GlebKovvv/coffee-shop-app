// src/controllers/reportController.js
const db = require('../models');
const { Op, literal } = require('sequelize');

/* утилита диапазона дат YYYY-MM-DD */
const rng = (f, t) => ({
  [Op.between]: [
    new Date((f || t) + ' 00:00'),
    new Date((t || f) + ' 23:59')
  ]
});

/* ─────────────────── 1. Продажи по дням ─────────────────── */
exports.sales = async (req, res) => {
  try {
    const { from, to } = req.query;

    const rows = await db.order.findAll({
      attributes: [
        [db.sequelize.fn('date', db.sequelize.col('orderdatetime')), 'day'],
        [db.sequelize.fn('count', '*'), 'orders'],
        [db.sequelize.fn('sum', db.sequelize.col('totalamount')), 'revenue']
      ],
      where: { orderdatetime: rng(from, to) },
      group: [literal('day')],
      order: [literal('day')]
    });

    const tot = rows.reduce(
      (a, r) => ({
        orders: a.orders + +r.get('orders'),
        revenue: a.revenue + +r.get('revenue')
      }),
      { orders: 0, revenue: 0 }
    );

    res.json({
      rows: rows.map(r => r.dataValues),
      totals: tot,
      avgCheck: tot.orders ? (tot.revenue / tot.orders).toFixed(2) : 0
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

/* ─────────────────── 2. Топ-товары ───────────────────────── */
exports.topProducts = async (req, res) => {
  try {
    const { from, to, limit = 5 } = req.query;

    const sql = `
      SELECT  m.name               AS name,
              COUNT(*)             AS qty
      FROM    orderitem oi
      JOIN    "order"   o USING(orderid)
      JOIN    menuitem  m USING(menuitemid)
      WHERE   o.orderdatetime BETWEEN :from AND :to
      GROUP BY m.name
      ORDER BY qty DESC
      LIMIT   :limit`;

    const rows = await db.sequelize.query(sql, {
      replacements: {
        from: from + ' 00:00',
        to:   to   + ' 23:59',
        limit: +limit
      },
      type: db.sequelize.QueryTypes.SELECT
    });

    res.json(rows);      // [{ name:'Капучино', qty:12 }, …]
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

/* ─────────────────── 3. Низкие остатки ───────────────────── */
exports.lowStock = async (_req, res) => {
  try {
    /* колонка минимального остатка: reorderlevel (либо min_quantity) */
    const colMin = db.ingredient.rawAttributes.reorderlevel
      ? 'reorderlevel'
      : 'min_quantity';

    const rows = await db.ingredient.findAll({
      where: db.sequelize.where(
        db.sequelize.col('quantity'),
        Op.lt,
        db.sequelize.col(colMin)
      ),
      include: [
        {
          model: db.unit,
          as: 'unit',                 // ← ключевая правка
          attributes: ['unitname']
        }
      ],
      order: ['name']
    });

    res.json(
      rows.map(r => ({
        name: r.name,
        quantity: r.quantity,
        min: r[colMin],
        unit: r.unit.unitname
      }))
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

/* ─────────────────── 4. Эффективность сотрудников ───────── */
exports.byStaff = async (req, res) => {
  try {
    const { from, to } = req.query;

    const sql = `
      SELECT  s.name                AS staff,
              COUNT(o.*)            AS orders,
              SUM(o.totalamount)    AS revenue
      FROM    "order" o
      JOIN    staff     s ON s.staffid = o.staffid
      WHERE   o.orderdatetime BETWEEN :from AND :to
      GROUP BY s.name
      ORDER BY revenue DESC`;

    const rows = await db.sequelize.query(sql, {
      replacements: { from: from + ' 00:00', to: to + ' 23:59' },
      type: db.sequelize.QueryTypes.SELECT
    });

    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};
