// ──────────────────────────── src/models/order.js ────────────────────────────
'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('order', {
    /* PK */
    orderid: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },

    /* дата-время оформления (по умолчанию now()) */
    orderdatetime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },

    /* итоговая сумма заказа */
    totalamount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    },

    /* кассир / сотрудник, оформивший заказ */
    staffid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'staff', key: 'staffid' }
    },

    /* статус (“новый”, “готов”, “выдан”) */
    orderstatusid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'orderstatus', key: 'orderstatusid' }
    },

    /* способ оплаты (1 — наличка, 2 — карта) */
    paymentmethodid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'paymentmethod', key: 'paymentmethodid' }
    },

    paymentstatus:  DataTypes.TEXT,   // оплачен / возврат
    clientid:       DataTypes.INTEGER,
    discountid:     DataTypes.INTEGER
  }, {
    tableName : 'order',
    schema    : 'public',
    timestamps: false
  });
};
