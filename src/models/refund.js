const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('refund', {
    refundid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    orderid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'order',
        key: 'orderid'
      }
    },
    refunddatetime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    refundamount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    refundstatus: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    additionalinfo: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'refund',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16544_pk__refund__725ab9007d1daae8",
        unique: true,
        fields: [
          { name: "refundid" },
        ]
      },
    ]
  });
};
