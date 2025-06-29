// модель staff обновлена под актуальную схему таблицы
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('staff', {
    staffid: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    positionid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    phone:  DataTypes.TEXT,
    email:  DataTypes.TEXT,

    /* ─── добавленные колонки ─── */
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    login: {
      type: DataTypes.TEXT,
      unique: true
    },
    role: DataTypes.TEXT            // 'admin', 'cashier', …
  }, {
    tableName: 'staff',
    timestamps: false
  });
};
