const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('orderqueue', {
    queueid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    orderid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'order',
        key: 'orderid'
      }
    },
    queuestatus: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    estimatedtime: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'orderqueue',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16493_pk__orderque__8324e715bbccc4b6",
        unique: true,
        fields: [
          { name: "queueid" },
        ]
      },
    ]
  });
};
