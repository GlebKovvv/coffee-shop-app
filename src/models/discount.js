const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('discount', {
    discountid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    discountname: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    discounttype: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    discountvalue: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    startdate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    enddate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    conditions: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'discount',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16405_pk__discount__e43f6df6896a4160",
        unique: true,
        fields: [
          { name: "discountid" },
        ]
      },
    ]
  });
};
