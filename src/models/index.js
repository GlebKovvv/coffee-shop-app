// src/models/index.js
'use strict';

const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const db = {};
const DataTypes = Sequelize.DataTypes;

// 1) Динамически загружаем все файлы-модели
fs
  .readdirSync(__dirname)
  .filter(file =>
    file !== path.basename(__filename) && file.slice(-3) === '.js'
  )
  .forEach(file => {
    const filePath = path.join(__dirname, file);
    const imported = require(filePath);
    let model;

    if (typeof imported === 'function') {
      // экспорт(factory): module.exports = (sequelize, DataTypes) => Model
      model = imported(sequelize, DataTypes);
    } else if (imported.default && typeof imported.default === 'function') {
      // экспорт через ES6 default
      model = imported.default(sequelize, DataTypes);
    } else {
      // сразу возвращён класс модели
      model = imported;
    }

    db[model.name] = model;
  });

// 2) Авто-ассоциации из модели (если в модели есть метод associate)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// 3) Ручные ассоциации для связи таблиц

// menuitem ↔ menucategory
if (db.menuitem && db.menucategory) {
  db.menuitem.belongsTo(db.menucategory, {
    foreignKey: 'categoryid',
    targetKey: 'categoryid',
  });
  db.menucategory.hasMany(db.menuitem, {
    foreignKey: 'categoryid',
    sourceKey: 'categoryid',
  });
}

// order ↔ orderitem
if (db.order && db.orderitem) {
  db.orderitem.belongsTo(db.order, { foreignKey: 'orderid' });
  db.order.hasMany(db.orderitem, { foreignKey: 'orderid' });
}

// orderitem ↔ orderitemaddons
if (db.orderitem && db.orderitemaddons) {
  db.orderitemaddons.belongsTo(db.orderitem, { foreignKey: 'orderitemid' });
  db.orderitem.hasMany(db.orderitemaddons, { foreignKey: 'orderitemid' });
}

if (db.inventoryitem && (db.supplier || db.suppliers)) {
  const Sup = db.supplier || db.suppliers;
  db.inventoryitem.belongsTo(Sup, { foreignKey: 'supplierid' });
  Sup.hasMany(db.inventoryitem,   { foreignKey: 'supplierid' });
}

if(db.ingredient && db.unit){
  db.ingredient.belongsTo(db.unit ,     {foreignKey:'unitid'});
  db.unit.hasMany       (db.ingredient,{foreignKey:'unitid'});
}

if (db.staff && db.position){
  db.staff.belongsTo(db.position, { foreignKey:'positionid' });
  db.position.hasMany(db.staff,   { foreignKey:'positionid' });
}



// 4) Экспорт sequelize-экземпляра и всех моделей
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
