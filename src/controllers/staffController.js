// src/controllers/staffController.js
const db = require('../models');

/* --- определяем реальные модели --- */
const Staff    = db.staff    || db.employee;
const Position = db.position || db.positions;

if (!Staff)    throw new Error('Модель staff не найдена');
if (!Position) throw new Error('Модель position не найдена');

/* ---------- GET /api/staff ---------- */
exports.list = async (_req, res) => {
  const list = await Staff.findAll({
    include: [{ model: Position, as: 'position', attributes: ['positionname'] }],
    order:   [[Staff.primaryKeyAttribute, 'ASC']]
  });
  res.json(list);
};

/* ---------- POST ---------- */
exports.create = async (req, res) => {
  const { name, positionid, phone, email } = req.body;
  if (!name || !positionid)
    return res.status(400).json({ error: 'name + positionid required' });

  const s = await Staff.create({ name, positionid, phone, email });
  res.status(201).json(s);
};

/* ---------- PUT ---------- */
exports.update = async (req, res) => {
  const s = await Staff.findByPk(req.params.id);
  if (!s) return res.status(404).json({ error: 'not found' });

  Object.assign(s, req.body);
  await s.save();
  res.json(s);
};

/* ---------- DELETE ---------- */
exports.remove = async (req, res) => {
  try {
    const affected = await Staff.destroy({
      where: { [Staff.primaryKeyAttribute]: req.params.id }
    });
    if (!affected) return res.status(404).json({ error: 'not found' });
    res.json({ success: true });
  } catch (e) {
    if (e.name === 'SequelizeForeignKeyConstraintError')
      return res.status(409).json({ error: 'has linked records' });
    console.error(e);
    res.status(500).json({ error: 'db error' });
  }
};
