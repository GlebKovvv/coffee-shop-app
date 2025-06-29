const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('position', {
    positionid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    positionname: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'position',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16515_pk__position__60bb9a59a60fd5eb",
        unique: true,
        fields: [
          { name: "positionid" },
        ]
      },
    ]
  });
};
