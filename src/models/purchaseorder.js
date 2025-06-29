const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('purchaseorder', {
    purchaseorderid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    orderdate: {
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
    requiredquantity: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    supplierid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'supplier',
        key: 'supplierid'
      }
    }
  }, {
    sequelize,
    tableName: 'purchaseorder',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16522_pk__purchase__036bac445fd79207",
        unique: true,
        fields: [
          { name: "purchaseorderid" },
        ]
      },
    ]
  });
};
