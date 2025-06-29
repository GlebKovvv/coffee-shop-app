const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('client', {
    clientid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    phone: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'client',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16391_pk__client__e67e1a04f226a219",
        unique: true,
        fields: [
          { name: "clientid" },
        ]
      },
      {
        name: "idx_16391_uq__client__5c7e359eb659f841",
        unique: true,
        fields: [
          { name: "phone" },
        ]
      },
    ]
  });
};
