const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('shift', {
    shiftid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    staffid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'staff',
        key: 'staffid'
      }
    },
    starttime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endtime: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'shift',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16552_ix_shift_staffid",
        fields: [
          { name: "staffid" },
        ]
      },
      {
        name: "idx_16552_pk__shift__c0a838e1129e6c2a",
        unique: true,
        fields: [
          { name: "shiftid" },
        ]
      },
    ]
  });
};
