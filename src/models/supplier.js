const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('supplier', {
    supplierid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    suppliername: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    contactperson: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'supplier',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16572_pk__supplier__4be666b4e365000f",
        unique: true,
        fields: [
          { name: "supplierid" },
        ]
      },
    ]
  });
};
