const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('recipe', {
    menuitemid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'menuitem',
        key: 'menuitemid'
      }
    },
    ingredientid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'ingredient',
        key: 'ingredientid'
      }
    },
    ingredientquantity: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'recipe',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16538_pk_recipe",
        unique: true,
        fields: [
          { name: "menuitemid" },
          { name: "ingredientid" },
        ]
      },
    ]
  });
};
