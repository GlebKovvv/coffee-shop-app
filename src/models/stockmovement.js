const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stockmovement', {
    movementid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    movementdate: {
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
    changeamount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    staffid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'staff',
        key: 'staffid'
      }
    }
  }, {
    sequelize,
    tableName: 'stockmovement',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16564_pk__stockmov__d18224667d59807b",
        unique: true,
        fields: [
          { name: "movementid" },
        ]
      },
    ]
  });
};
