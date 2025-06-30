// File: src/models/index.js
'use strict';

const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const basename  = path.basename(__filename);
const db        = {};

// 1) Импорт всех *.js-моделей, кроме index.js
fs.readdirSync(__dirname)
  .filter(file =>
    file !== basename && file.endsWith('.js')
  )
  .forEach(file => {
    const factory = require(path.join(__dirname, file));
    if (typeof factory === 'function') {
      const model = factory(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    }
  });

// 2) Авто-ассоциации из моделей
Object.values(db).forEach(model => {
  if (model.associate) model.associate(db);
});

// 3) Ручные связи
if (db.order && db.orderitem) {
  db.order.hasMany(db.orderitem,   { foreignKey: 'orderid' });
  db.orderitem.belongsTo(db.order, { foreignKey: 'orderid' });
}
if (db.order && db.orderqueue) {
  db.order.hasOne(db.orderqueue,   { foreignKey: 'orderid' });
  db.orderqueue.belongsTo(db.order,{ foreignKey: 'orderid' });
}
// при m:n extras ↔ orderitem через orderitemaddons
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

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
