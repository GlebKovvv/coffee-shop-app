const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('paymentmethod', {
    paymentmethodid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    paymentname: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'paymentmethod',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16508_pk__paymentm__dc31c1f39c08274f",
        unique: true,
        fields: [
          { name: "paymentmethodid" },
        ]
      },
    ]
  });
};
