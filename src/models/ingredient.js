const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ingredient', {
    ingredientid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    unitid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'unit',
        key: 'unitid'
      }
    },
    quantity: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    },
    reorderlevel: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'ingredient',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16426_pk__ingredie__beaeb27a849adcc7",
        unique: true,
        fields: [
          { name: "ingredientid" },
        ]
      },
    ]
  });
};
