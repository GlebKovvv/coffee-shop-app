const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('menuitemextras', {
    menuitemid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'menuitem',
        key: 'menuitemid'
      }
    },
    extraid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'extras',
        key: 'extraid'
      }
    },
    isdefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'menuitemextras',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16457_pk_menuitemextras",
        unique: true,
        fields: [
          { name: "menuitemid" },
          { name: "extraid" },
        ]
      },
    ]
  });
};
