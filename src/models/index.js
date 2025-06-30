// src/models/index.js
'use strict';

const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const basename = path.basename(__filename);
const db       = {};

/* ---------- импорт всех фабрик-моделей ---------- */
fs.readdirSync(__dirname)
  .filter(f =>
      f.indexOf('.') !== 0 &&
      f !== basename   &&
      f.endsWith('.js') &&
      !f.startsWith('_') &&
      !f.includes('init-models') &&
      f !== 'Category.js'
  )
  .forEach(f => {
    const factory = require(path.join(__dirname, f));
    if (typeof factory === 'function') {
      const model = factory(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    }
  });

/* ---------- ручные ассоциации ---------- */

// menuitem ↔ menucategory
if (db.menuitem && db.menucategory) {
  db.menucategory.hasMany(db.menuitem,  { foreignKey: 'categoryid' });
  db.menuitem.belongsTo(db.menucategory,{ foreignKey: 'categoryid', as:'category' });
}

// order ↔ orderitem
if (db.order && db.orderitem) {
  db.order.hasMany(db.orderitem,   { foreignKey: 'orderid' });
  db.orderitem.belongsTo(db.order, { foreignKey: 'orderid' });
}

// orderitem ↔ extras (junction orderitemaddons)
// ⚠️  НЕ добавляем hasMany, чтобы alias `orderitemaddons` не дублировался
if (db.orderitem && db.orderitemaddons && db.extras) {
  db.orderitem.belongsToMany(db.extras, {
    through:    db.orderitemaddons,
    foreignKey: 'orderitemid',
    otherKey:   'extraid'
  });
  db.extras.belongsToMany(db.orderitem, {
    through:    db.orderitemaddons,
    foreignKey: 'extraid',
    otherKey:   'orderitemid'
  });

  // связь «мост» → позиция (нужна для ON DELETE CASCADE)
  db.orderitemaddons.belongsTo(db.orderitem, { foreignKey: 'orderitemid' });
}

// supplier ↔ inventoryitem
if (db.supplier && db.inventoryitem) {
  db.supplier.hasMany(db.inventoryitem, { foreignKey: 'supplierid' });
  db.inventoryitem.belongsTo(db.supplier,{ foreignKey: 'supplierid' });
}

// unit ↔ ingredient
if (db.unit && db.ingredient) {
  db.unit.hasMany(db.ingredient,   { foreignKey: 'unitid' });
  db.ingredient.belongsTo(db.unit, { foreignKey: 'unitid', as:'unit' });
}

// staff ↔ position
if (db.staff && db.position) {
  db.position.hasMany(db.staff,    { foreignKey: 'positionid', as:'staffs' });
  db.staff.belongsTo(db.position,  { foreignKey: 'positionid', as:'position' });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
