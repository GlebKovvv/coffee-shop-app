const db = require('../models');

/* ищем модель: position / positions / employee_position */
let Position = db.position || db.positions;
if (!Position) Position = Object.values(db).find(
  m => m && m.tableName && ['position','positions','employee_position']
       .includes(m.tableName.toLowerCase())
);
if (!Position) throw new Error('Модель должностей не найдена');

exports.list = async (_req, res) => {
  const list = await Position.findAll({ order: [['positionid','ASC']] });
  res.json(list);
};
