const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('readyproduct', {
    productid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    menuitemtypeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'menuitemtype',
        key: 'menuitemtypeid'
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    reorderlevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'readyproduct',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16530_pk__readypro__b40cc6edd4c33b1b",
        unique: true,
        fields: [
          { name: "productid" },
        ]
      },
    ]
  });
};
