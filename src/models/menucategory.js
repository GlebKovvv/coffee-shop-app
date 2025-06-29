const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('menucategory', {
    categoryid: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    menuitemtypeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: 'menuitemtype',
        key: 'menuitemtypeid'
      }
    }
  }, {
    sequelize,
    tableName: 'menucategory',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_16443_pk__menucate__19093a2b3179bd47",
        unique: true,
        fields: [
          { name: "categoryid" },
        ]
      },
    ]
  });
};
