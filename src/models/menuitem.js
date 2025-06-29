const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('menuitem', {
    menuitemid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    categoryid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'menucategory',
        key: 'categoryid'
      }
    }
  }, {
    sequelize,
    tableName: 'menuitem',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16451_ix_menuitem_categoryid",
        fields: [
          { name: "categoryid" },
        ]
      },
      {
        name: "idx_16451_pk__menuitem__8943f702945802c5",
        unique: true,
        fields: [
          { name: "menuitemid" },
        ]
      },
    ]
  });
};
