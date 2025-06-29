module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('useraccount', {
    userid : { type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
    login  : { type: DataTypes.STRING,  unique:true, allowNull:false },
    role   : { type: DataTypes.ENUM('admin','cashier'), allowNull:false },
    active : { type: DataTypes.BOOLEAN, defaultValue:true }
  }, { timestamps:false });

  User.associate = models => {
    User.belongsTo(models.staff, { foreignKey:'staffid' });
  };
  return User;
};
