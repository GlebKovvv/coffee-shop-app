const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('menuitemtype', {
    menuitemtypeid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    typename: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'menuitemtype',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16469_pk__menuitem__c1851df09bbc7512",
        unique: true,
        fields: [
          { name: "menuitemtypeid" },
        ]
      },
    ]
  });
};
