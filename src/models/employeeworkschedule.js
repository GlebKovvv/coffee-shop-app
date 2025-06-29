const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('employeeworkschedule', {
    scheduleid: {
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
    workdate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    starttime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endtime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'employeeworkschedule',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16412_pk__employee__9c8a5b691f30263c",
        unique: true,
        fields: [
          { name: "scheduleid" },
        ]
      },
    ]
  });
};
