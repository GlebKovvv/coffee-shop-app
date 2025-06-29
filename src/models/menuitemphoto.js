const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('menuitemphoto', {
    photoid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    menuitemid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'menuitem',
        key: 'menuitemid'
      }
    },
    filepath: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    alttext: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'menuitemphoto',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16462_ix_menuitemphoto_menuitemid",
        fields: [
          { name: "menuitemid" },
        ]
      },
      {
        name: "idx_16462_pk__menuitem__21b7b582fcf7e36f",
        unique: true,
        fields: [
          { name: "photoid" },
        ]
      },
    ]
  });
};
