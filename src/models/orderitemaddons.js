// src/models/orderitemaddons.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('orderitemaddons', {
    orderitemid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: { model: 'orderitem', key: 'orderitemid' }
    },
    extraid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: { model: 'extras', key: 'extraid' }
    }
  }, {
    sequelize,
    tableName: 'orderitemaddons',
    schema: 'public',
    timestamps: false
  });
};
