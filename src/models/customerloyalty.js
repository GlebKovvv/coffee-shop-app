const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customerloyalty', {
    customerloyaltyid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    clientid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'client',
        key: 'clientid'
      }
    },
    loyaltycardnumber: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pointsbalance: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'customerloyalty',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16398_pk_customerloyalty_temp",
        unique: true,
        fields: [
          { name: "customerloyaltyid" },
        ]
      },
    ]
  });
};
