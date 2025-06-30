// src/models/index.js
'use strict';

const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/db');   // готовое соединение
const basename  = path.basename(__filename);
const db        = {};

// ---------- автоматический импорт Sequelize-моделей ----------
fs.readdirSync(__dirname)
  .filter(file =>
    file.indexOf('.') !== 0 &&                 // не скрытые
    file !== basename &&                       // не index.js
    !['Category.js', 'init-models.js'].includes(file) &&  // пропуск DAO/генератора
    file.endsWith('.js')
  )
  .forEach(file => {
    const factory = require(path.join(__dirname, file));
    if (typeof factory === 'function') {
      const model = factory(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    }
  });

// ---------- встроенные associate() ----------
Object.values(db).forEach(m => m.associate && m.associate(db));

/* ---------- ручные ассоциации ---------- */

// menuitem ↔ menucategory
if (db.menuitem && db.menucategory) {
  db.menuitem.belongsTo(db.menucategory, { foreignKey: 'categoryid' });
  db.menucategory.hasMany(db.menuitem,   { foreignKey: 'categoryid' });
}

// order ↔ orderitem
if (db.order && db.orderitem) {
  db.order.hasMany(db.orderitem,    { foreignKey: 'orderid' });
  db.orderitem.belongsTo(db.order,  { foreignKey: 'orderid' });
}

// orderitem ↔ extras  (many-to-many через orderitemaddons)
if (db.orderitem && db.extras && db.orderitemaddons) {
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
}

// inventoryitem ↔ supplier
if (db.inventoryitem && db.supplier) {
  db.supplier.hasMany(db.inventoryitem, { foreignKey: 'supplierid' });
  db.inventoryitem.belongsTo(db.supplier,{ foreignKey: 'supplierid' });
}

// ingredient ↔ unit
if (db.ingredient && db.unit) {
  db.unit.hasMany(db.ingredient,  { foreignKey: 'unitid' });
  db.ingredient.belongsTo(db.unit,{ foreignKey: 'unitid' });
}

// staff ↔ position
if (db.staff && db.position) {
  db.position.hasMany(db.staff,  { foreignKey: 'positionid' });
  db.staff.belongsTo(db.position,{ foreignKey: 'positionid' });
}

// ---------- экспорт ----------
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
