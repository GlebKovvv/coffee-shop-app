const db = require('../models');

/* ────────── ищем модель клиентов ────────── */
let Cust = db.customer || db.customers || db.client;
if (!Cust) {
  Cust = Object.values(db).find(
    m => m && m.tableName &&
      ['customer','customers','client','clients'].includes(m.tableName.toLowerCase())
  );
}
if (!Cust) throw new Error('Модель клиентов не найдена в db');

/* ────────── helper: нормализация телефона ────────── */
function norm(phone = '') {
  return phone.replace(/\D+/g, '');     // оставляем только цифры
}

/* ────────── CRUD ────────── */
exports.list = async (_req, res) =>
  res.json(await Cust.findAll({ order: [[Cust.primaryKeyAttribute,'ASC']] }));

exports.searchByPhone = async (req, res) => {
  const phone = norm(req.query.phone || '');
  if (!phone) return res.status(400).json({ error:'phone required' });

  const c = await Cust.findOne({ where:{ phone } });
  if (!c) return res.status(404).json({ error:'not found' });
  res.json(c);
};

exports.create = async (req, res) => {
  const phone = norm(req.body.phone || '');
  if (!phone) return res.status(400).json({ error:'phone required' });

  /* если такой телефон уже есть — 409 Conflict */
  const exists = await Cust.findOne({ where:{ phone } });
  if (exists) return res.status(409).json({ error:'phone exists', clientid: exists.clientid });

  const { name = '', email } = req.body;
  const c = await Cust.create({ name, phone, email, loyaltypoints: 0 });
  res.status(201).json(c);
};

exports.update = async (req, res) => {
  const c = await Cust.findByPk(req.params.id);
  if (!c) return res.status(404).json({ error:'not found' });

  if (req.body.phone) req.body.phone = norm(req.body.phone);
  Object.assign(c, req.body);
  await c.save();
  res.json(c);
};

exports.remove = async (req, res) => {
  const c = await Cust.findByPk(req.params.id);
  if (!c) return res.status(404).json({ error:'not found' });
  await c.destroy();
  res.json({ success:true });
};

/* ────────── начисление баллов (вызывается из orderController) ────────── */
exports.addPoints = async (clientid, delta, t = null) => {
  if (delta <= 0 || !clientid) return;
  await Cust.increment(
    { loyaltypoints: delta },
    { where:{ clientid }, transaction: t }
  );
};
