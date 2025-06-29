/* ------------------------------------------------------------------
   Контроллер «Товары»  (menuitem  +  menucategory)
   ------------------------------------------------------------------ */
const db = require('../models');
const Item     = db.menuitem;       // товар для POS
const Category = db.menucategory;   // категория (горячие, холодные …)
const OrderItm = db.orderitem;      // для проверки «удалять нельзя»

/* --- объявляем связь, если она вдруг не описана в моделях -------- */
if (!Item.associations.menucategory) {
  Item.belongsTo(Category, { foreignKey: 'categoryid' });
}

/* ------------------- GET /api/items (?category=ID) ---------------- */
exports.list = async (req, res) => {
  const where = req.query.category ? { categoryid: req.query.category } : undefined;

  const rows = await Item.findAll({
    where,
    include : [{ model: Category, attributes: ['name'] }],
    order   : [['menuitemid', 'ASC']]
  });

  res.json(rows);
};

/* ------------------- POST /api/items ------------------------------ */
exports.create = async (req, res) => {
  const { name, categoryid, price, active = true } = req.body;
  if (!name || !categoryid || price == null) {
    return res.status(400).json({ error: 'name, categoryid, price required' });
  }

  const row = await Item.create({
    name,
    categoryid,
    price      : +price,
    active     : !!active
  });

  res.status(201).json(row);
};

/* ------------------- PUT /api/items/:id --------------------------- */
exports.update = async (req, res) => {
  const row = await Item.findByPk(req.params.id);
  if (!row) return res.status(404).json({ error: 'not found' });

  Object.assign(row, {
    name       : req.body.name,
    categoryid : req.body.categoryid,
    price      : +req.body.price,
    active     : req.body.active
  });
  await row.save();
  res.json(row);
};

/* ------------------- DELETE /api/items/:id ------------------------ */
exports.remove = async (req, res) => {
  const row = await Item.findByPk(req.params.id);
  if (!row) return res.status(404).json({ error: 'not found' });

  const used = await OrderItm.count({ where: { menuitemid: row.menuitemid } });
  if (used) return res.status(409).json({ error: 'item used in orders' });

  await row.destroy();
  res.json({ success: true });
};
