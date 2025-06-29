const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('orderstatus', {
    orderstatusid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    statusname: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'orderstatus',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16501_pk__ordersta__bc674f41cceeca70",
        unique: true,
        fields: [
          { name: "orderstatusid" },
        ]
      },
    ]
  });
};
