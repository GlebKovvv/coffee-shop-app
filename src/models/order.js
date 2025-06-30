// src/models/order.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('order', {
    orderid: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    orderdatetime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    ordernumber: {                     // ← новый столбец
      type: DataTypes.INTEGER,
      allowNull: true
    },
    totalamount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    },
    staffid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'staff', key: 'staffid' }
    },
    orderstatusid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'orderstatus', key: 'orderstatusid' }
    },
    paymentmethodid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'paymentmethod', key: 'paymentmethodid' }
    },
    paymentstatus: { type: DataTypes.TEXT },
    clientid: {
      type: DataTypes.INTEGER,
      references: { model: 'client', key: 'clientid' }
    },
    discountid: {
      type: DataTypes.INTEGER,
      references: { model: 'discount', key: 'discountid' }
    }
  }, {
    sequelize,
    tableName: 'order',
    schema: 'public',
    timestamps: false
  });
};
