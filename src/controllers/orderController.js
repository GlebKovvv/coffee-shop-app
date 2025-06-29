/* ─────────────────────────────────────────────────────────────
   orderController.js
   ───────────────────────────────────────────────────────────── */
const {
  order, orderitem, orderitemaddons,
  menuitem, extra, staff, customer,    // ★ добавили customer для баллов
  sequelize
} = require('../models');
const { Op } = require('sequelize');

const STATUS_NEW       = 1;
const STATUS_COMPLETED = 2;

/* ── суточный номер ─────────────────────────────────────── */
async function nextDailyNumber(t){
  const d=new Date();d.setHours(0,0,0,0);
  return await order.count({
    where:{orderdatetime:{[Op.gte]:d}},transaction:t
  }) + 1;
}

/* ── staffId: либо передан, либо первый из таблицы ──────── */
async function resolveStaffId(t,id){
  if(id) return id;
  const s = await staff.findOne({ attributes:['staffid'], transaction:t });
  if(!s) throw new Error('no-staff');
  return s.staffid;
}

/* ── GET /api/orders/active ─────────────────────────────── */
exports.getActive = async (_req,res)=>{
  try{
    const sql=`
      SELECT o.orderid,
             COALESCE(o.ordernumber,o.orderid) AS ordernumber,
             o.orderdatetime,
             o.totalamount,
             o.orderstatusid,
             STRING_AGG(m.name||' ×'||oi.quantity, ', ') AS items
      FROM "order" o
      JOIN orderitem oi ON oi.orderid=o.orderid
      JOIN menuitem  m ON m.menuitemid=oi.menuitemid
      WHERE o.orderstatusid <> :done
      GROUP BY o.orderid
      ORDER BY o.orderdatetime`;
    const list=await sequelize.query(sql,{
      replacements:{done:STATUS_COMPLETED},
      type:sequelize.QueryTypes.SELECT
    });
    res.json(list);
  }catch(e){console.error(e);res.status(500).json({error:'db error'});}
};

/* ── POST /api/orders ───────────────────────────────────── */
exports.create = async (req,res)=>{

  /* ★ clientid теперь деструктурируем из body */
  const {items,payType,staffId,clientid=null,discount=0}=req.body;

  if(!Array.isArray(items)||!items.length)
    return res.status(400).json({error:'items required'});

  try{
    const result = await sequelize.transaction(async t=>{
      const sid   = await resolveStaffId(t,staffId);
      const num   = await nextDailyNumber(t);
      const total = items.reduce((s,p)=>s+p.price*(p.qty||1),0)-discount;

      /* создаём заказ */
      const o = await order.create({
        orderdatetime : new Date(),
        totalamount   : total,
        ordernumber   : num,
        orderstatusid : STATUS_NEW,
        paymentmethodid: payType==='card'?2:1,
        staffid       : sid,
        clientid      : clientid            // ★ сохраняем клиента, если есть
      },{transaction:t});

      /* ★ начисляем баллы клиенту, если указан */
      if (clientid) {
        const pts = Math.floor(total / 50);          // 1 балл за каждые 50 ₽
        await customer.increment(
          { loyaltypoints: pts },
          { where:{ clientid }, transaction:t }
        );
      }

      /* позиции заказа */
      for(const p of items){
        const oi=await orderitem.create({
          orderid:o.orderid,
          menuitemid:p.menuitemid,
          quantity:p.qty||1,
          price:p.price
        },{transaction:t});

        /* добавки к позиции */
        for(const ex of p.extras||[])
          await orderitemaddons.create(
            {orderitemid:oi.orderitemid,extraid:ex},
            {transaction:t});
      }
      return { orderid:o.orderid, number:num };
    });
    res.status(201).json(result);

  }catch(e){
    console.error(e);
    if(e.message==='no-staff')
      return res.status(400).json({error:'таблица staff пуста'});
    res.status(500).json({error:'db error'});
  }
};

/* ── PUT /api/orders/:id/complete ───────────────────────── */
exports.complete = async (req,res)=>{
  const o = await order.findByPk(req.params.id);
  if(!o) return res.status(404).json({error:'not found'});
  o.orderstatusid=STATUS_COMPLETED; await o.save();
  res.json({success:true});
};

/* ── GET /api/orders ─ полный список (опц. фильтр по статусу) ─── */
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
            { model: orderitemaddons, include: [ extra ] },
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
