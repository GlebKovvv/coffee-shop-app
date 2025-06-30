/* ──────────────────────────────────────────────────────────
   src/controllers/inventoryController.js
   ────────────────────────────────────────────────────────── */
'use strict';

const db = require('../models');
const Item = db.ingredient;      // модель ингредиента (склад)
const Unit = db.unit;            // модель единиц измерения

/* ---------- GET /api/inventory ---------- */
exports.list = async (_req, res) => {
  const list = await Item.findAll({
    include: [{
      model      : Unit,
      as         : 'unit',              // ← ОБЯЗАТЕЛЬНО — алиас из ассоциации
      attributes : ['unitname']
    }],
    order: [['ingredientid', 'ASC']]
  });
  res.json(list);
};

/* ---------- POST /api/inventory ---------- */
exports.create = async (req, res) => {
  try {
    const { name, quantity, unitid, reorderlevel } = req.body;
    if (!name || !unitid)
      return res.status(400).json({ error: 'name & unitid required' });

    const row = await Item.create({
      name,
      quantity     : +quantity     || 0,
      unitid,
      reorderlevel : +reorderlevel || 0
    });
    res.status(201).json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db error' });
  }
};

/* ---------- PATCH /api/inventory/:id ---------- */
exports.update = async (req, res) => {
  try {
    const row = await Item.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'not found' });

    Object.assign(row, {
      name         : req.body.name,
      quantity     : +req.body.quantity     || 0,
      unitid       : req.body.unitid,
      reorderlevel : +req.body.reorderlevel || 0
    });
    await row.save();
    res.json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db error' });
  }
};

/* ---------- change ±Δ ---------- */
async function change(req, res, sign) {
  try {
    const row = await Item.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'not found' });

    const delta = +req.body.delta;
    if (!delta || delta <= 0)
      return res.status(400).json({ error: 'delta > 0' });

    const qty = parseFloat(row.quantity) || 0;
    row.quantity = Math.max(0, qty + sign * delta);
    await row.save();
    res.json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db error' });
  }
}
exports.add    = (req, res) => change(req, res, +1);
exports.remove = (req, res) => change(req, res, -1);

/* ---------- DELETE /api/inventory/:id ---------- */
exports.delete = async (req, res) => {
  try {
    const row = await Item.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'not found' });
    await row.destroy();
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db error' });
  }
};
