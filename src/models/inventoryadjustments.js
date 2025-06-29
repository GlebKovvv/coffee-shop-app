const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('inventoryadjustments', {
    adjustmentid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    adjustmentdate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    ingredientid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'ingredient',
        key: 'ingredientid'
      }
    },
    productid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'readyproduct',
        key: 'productid'
      }
    },
    adjustmentamount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    staffid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'staff',
        key: 'staffid'
      }
    }
  }, {
    sequelize,
    tableName: 'inventoryadjustments',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16435_pk__inventor__e60db89343ad3f51",
        unique: true,
        fields: [
          { name: "adjustmentid" },
        ]
      },
    ]
  });
};
