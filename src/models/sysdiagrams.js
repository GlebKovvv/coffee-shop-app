const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sysdiagrams', {
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    principal_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    diagram_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    definition: {
      type: DataTypes.BLOB,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'sysdiagrams',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16579_pk__sysdiagr__c2b05b61d99a8e15",
        unique: true,
        fields: [
          { name: "diagram_id" },
        ]
      },
      {
        name: "idx_16579_uk_principal_name",
        unique: true,
        fields: [
          { name: "principal_id" },
          { name: "name" },
        ]
      },
    ]
  });
};
