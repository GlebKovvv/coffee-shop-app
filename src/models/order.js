const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order', {
    orderid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    orderdatetime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    totalamount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    },
    staffid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'staff',
        key: 'staffid'
      }
    },
    orderstatusid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orderstatus',
        key: 'orderstatusid'
      }
    },
    paymentmethodid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'paymentmethod',
        key: 'paymentmethodid'
      }
    },
    paymentstatus: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    clientid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'client',
        key: 'clientid'
      }
    },
    discountid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'discount',
        key: 'discountid'
      }
    }
  }, {
    sequelize,
    tableName: 'order',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16476_pk__order__c3905bafe410f856",
        unique: true,
        fields: [
          { name: "orderid" },
        ]
      },
    ]
  });
};
