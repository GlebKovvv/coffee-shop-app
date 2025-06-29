/* src/controllers/extraController.js */
const { extras, sequelize } = require('../models');

/* ── ищем модель связи «order-item-addon» с любым именем ─────────── */
const AddonLink = Object.values(sequelize.models)
  .find(m => /(order[_]?item[_]?addons?)/i.test(m.tableName));

if (!AddonLink) {
  console.warn('⚠️  Таблица "orderitemaddons" не описана. ' +
               'Удаляем добавки без проверки использования.');
}

/* ── GET /api/extras ─────────────────────────────────────────────── */
exports.getAll = async (_req, res) => {
  const list = await extras.findAll({ order: [['extraid', 'ASC']] });
  res.json(list);
};

/* ── POST /api/extras ────────────────────────────────────────────── */
exports.create = async (req, res) => {
  try {
    const e = await extras.create({
      extraname:  req.body.extraname,
      extraprice: req.body.extraprice
    });
    res.status(201).json(e);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
};

/* ── PUT /api/extras/:id ─────────────────────────────────────────── */
exports.update = async (req, res) => {
  try {
    const e = await extras.findByPk(req.params.id);
    if (!e) return res.status(404).json({ error: 'not found' });

    e.extraname  = req.body.extraname;
    e.extraprice = req.body.extraprice;
    await e.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
};

/* ── DELETE /api/extras/:id ──────────────────────────────────────── */
exports.remove = async (req, res) => {
  try {
    const e = await extras.findByPk(req.params.id);
    if (!e) return res.status(404).json({ error: 'not found' });

    if (AddonLink) {
      const used = await AddonLink.count({ where: { extraid: e.extraid } });
      if (used)
        return res.status(409).json({ error: 'extra used in orders' });
    }

    await e.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
};
