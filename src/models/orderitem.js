// src/models/orderitem.js
'use strict';
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('orderitem', {
    orderitemid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    orderid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'order', key: 'orderid' }
    },
    menuitemid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'menuitem', key: 'menuitemid' }
    },
    // -- поле productid удалено, т.к. таблицы readyproduct нет --
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'orderitem',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16485_pk__orderite__57ed06a13a13c554",
        unique: true,
        fields: [{ name: "orderitemid" }]
      }
    ]
  });
};
