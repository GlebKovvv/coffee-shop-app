const { unit } = require('../models');

/* GET /api/units — список единиц измерения */
exports.list = async (_req, res) => {
  const list = await unit.findAll({ order: [['unitid', 'ASC']] });
  res.json(list);
};
