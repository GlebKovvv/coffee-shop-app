const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('unit', {
    unitid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    unitname: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'unit',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16586_pk__unit__44f5ec95501c60db",
        unique: true,
        fields: [
          { name: "unitid" },
        ]
      },
    ]
  });
};
