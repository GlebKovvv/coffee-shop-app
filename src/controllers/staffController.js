// src/controllers/staffController.js
const db = require('../models');

// 1) находим модель сотрудников (staff или employee)
let StaffModel = db.staff || db.employee;
if (!StaffModel) {
  StaffModel = Object.values(db).find(
    m => m && m.tableName && ['staff','employee','employees']
         .includes(m.tableName.toLowerCase())
  );
}
if (!StaffModel) {
  throw new Error('Модель сотрудников не найдена в db');
}

// 2) находим модель должностей
let PositionModel = db.position || db.positions;
if (!PositionModel) {
  PositionModel = Object.values(db).find(
    m => m && m.tableName && ['position','positions']
         .includes(m.tableName.toLowerCase())
  );
}

// GET /api/staff
exports.list = async (_req, res) => {
  const list = await StaffModel.findAll({
    include: PositionModel
      ? [{ model: PositionModel, attributes: ['positionname'] }]
      : [],
    order: [[StaffModel.primaryKeyAttribute, 'ASC']]
  });
  res.json(list);
};

// POST /api/staff
exports.create = async (req, res) => {
  const { name, positionid, phone, email } = req.body;
  if (!name || !positionid) {
    return res.status(400).json({ error: 'name + positionid required' });
  }
  const s = await StaffModel.create({ name, positionid, phone, email });
  res.status(201).json(s);
};

// PUT /api/staff/:id
exports.update = async (req, res) => {
  const s = await StaffModel.findByPk(req.params.id);
  if (!s) return res.status(404).json({ error: 'not found' });
  Object.assign(s, req.body);
  await s.save();
  res.json(s);
};

// DELETE /api/staff/:id  — «жёсткое» удаление с проверкой FK
exports.remove = async (req, res) => {
  try {
    const count = await StaffModel.destroy({
      where: { [StaffModel.primaryKeyAttribute]: req.params.id }
    });
    if (!count) {
      return res.status(404).json({ error: 'not found' });
    }
    res.json({ success: true });
  } catch (e) {
    if (e.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({ error: 'has linked records' });
    }
    console.error(e);
    res.status(500).json({ error: 'db error' });
  }
};
