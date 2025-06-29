const { menucategory, menuitem } = require('../models');

/* ── GET /api/categories ─────────────────────────────────── */
exports.getAll = async (_req, res) =>
  res.json(await menucategory.findAll({ order: [['categoryid', 'ASC']] }));

/* ── POST /api/categories ────────────────────────────────── */
exports.create = async (req, res) => {
  if (!req.body.name) return res.status(400).json({ error: 'name required' });
  const cat = await menucategory.create({ name: req.body.name });
  res.status(201).json(cat);
};

/* ── PUT /api/categories/:id ─────────────────────────────── */
exports.update = async (req, res) => {
  const cat = await menucategory.findByPk(req.params.id);
  if (!cat) return res.status(404).json({ error: 'not found' });

  if (!req.body.name) return res.status(400).json({ error: 'name required' });
  cat.name = req.body.name;
  await cat.save();
  res.json(cat);
};

/* ── DELETE /api/categories/:id ──────────────────────────── */
exports.remove = async (req, res) => {
  const cat = await menucategory.findByPk(req.params.id);
  if (!cat) return res.status(404).json({ error: 'not found' });

  /* проверяем, есть ли товары в этой категории */
  const items = await menuitem.count({ where: { categoryid: cat.categoryid } });
  if (items) return res.status(409).json({ error: 'category has items' });

  await cat.destroy();
  res.json({ success: true });
};
