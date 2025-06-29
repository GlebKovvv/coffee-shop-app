const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('extras', {
    extraid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    extraname: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    extraprice: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'extras',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16419_pk__extras__d1f3a827d7d2d4df",
        unique: true,
        fields: [
          { name: "extraid" },
        ]
      },
    ]
  });
};
