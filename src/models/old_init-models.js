var DataTypes = require("sequelize").DataTypes;
var _client = require("./client");
var _customerloyalty = require("./customerloyalty");
var _discount = require("./discount");
var _extras = require("./extras");
var _ingredient = require("./ingredient");
var _menucategory = require("./menucategory");
var _menuitem = require("./menuitem");
var _menuitemextras = require("./menuitemextras");
var _menuitemtype = require("./menuitemtype");
var _order = require("./order");
var _orderitem = require("./orderitem");
var _orderqueue = require("./orderqueue");
var _orderstatus = require("./orderstatus");
var _paymentmethod = require("./paymentmethod");
var _position = require("./position");
var _staff = require("./staff");
var _supplier = require("./supplier");
var _unit = require("./unit");

function initModels(sequelize) {
  var client = _client(sequelize, DataTypes);
  var customerloyalty = _customerloyalty(sequelize, DataTypes);
  var discount = _discount(sequelize, DataTypes);
  var extras = _extras(sequelize, DataTypes);
  var ingredient = _ingredient(sequelize, DataTypes);
  var menucategory = _menucategory(sequelize, DataTypes);
  var menuitem = _menuitem(sequelize, DataTypes);
  var menuitemextras = _menuitemextras(sequelize, DataTypes);
  var menuitemtype = _menuitemtype(sequelize, DataTypes);
  var order = _order(sequelize, DataTypes);
  var orderitem = _orderitem(sequelize, DataTypes);
  var orderqueue = _orderqueue(sequelize, DataTypes);
  var orderstatus = _orderstatus(sequelize, DataTypes);
  var paymentmethod = _paymentmethod(sequelize, DataTypes);
  var position = _position(sequelize, DataTypes);
  var staff = _staff(sequelize, DataTypes);
  var supplier = _supplier(sequelize, DataTypes);
  var unit = _unit(sequelize, DataTypes);

  // связи «добавки ↔ товары»
  extras.belongsToMany(menuitem, {
    as: 'menuitemid_menuitems',
    through: menuitemextras,
    foreignKey: "extraid",
    otherKey: "menuitemid"
  });
  menuitem.belongsToMany(extras, {
    as: 'extraid_extras',
    through: menuitemextras,
    foreignKey: "menuitemid",
    otherKey: "extraid"
  });

  // клиенты ↔ лояльность
  customerloyalty.belongsTo(client, { as: "client", foreignKey: "clientid" });
  client.hasMany(customerloyalty, { as: "customerloyalties", foreignKey: "clientid" });

  // заказы ↔ клиенты и скидки
  order.belongsTo(client, { as: "client", foreignKey: "clientid" });
  client.hasMany(order, { as: "orders", foreignKey: "clientid" });
  order.belongsTo(discount, { as: "discount", foreignKey: "discountid" });
  discount.hasMany(order, { as: "orders", foreignKey: "discountid" });

  // промежуточная таблица добавок
  menuitemextras.belongsTo(extras, { as: "extra", foreignKey: "extraid" });
  extras.hasMany(menuitemextras, { as: "menuitemextras", foreignKey: "extraid" });

  // товары ↔ категории
  menuitem.belongsTo(menucategory, { as: "category", foreignKey: "categoryid" });
  menucategory.hasMany(menuitem, { as: "menuitems", foreignKey: "categoryid" });

  // товары ↔ их добавки
  menuitemextras.belongsTo(menuitem, { as: "menuitem", foreignKey: "menuitemid" });
  menuitem.hasMany(menuitemextras, { as: "menuitemextras", foreignKey: "menuitemid" });

  // позиции заказа ↔ товары
  orderitem.belongsTo(menuitem, { as: "menuitem", foreignKey: "menuitemid" });
  menuitem.hasMany(orderitem, { as: "orderitems", foreignKey: "menuitemid" });

  // позиции заказа ↔ заказ
  orderitem.belongsTo(order, { as: "order", foreignKey: "orderid" });
  order.hasMany(orderitem, { as: "orderitems", foreignKey: "orderid" });

  // очередь ↔ заказ
  orderqueue.belongsTo(order, { as: "order", foreignKey: "orderid" });
  order.hasMany(orderqueue, { as: "orderqueues", foreignKey: "orderid" });

  // заказ ↔ статус и способ оплаты
  order.belongsTo(orderstatus, { as: "orderstatus", foreignKey: "orderstatusid" });
  orderstatus.hasMany(order, { as: "orders", foreignKey: "orderstatusid" });
  order.belongsTo(paymentmethod, { as: "paymentmethod", foreignKey: "paymentmethodid" });
  paymentmethod.hasMany(order, { as: "orders", foreignKey: "paymentmethodid" });

  // сотрудники ↔ должности
  staff.belongsTo(position, { as: "position", foreignKey: "positionid" });
  position.hasMany(staff, { as: "staffs", foreignKey: "positionid" });

  // ингредиенты ↔ единицы измерения
  ingredient.belongsTo(unit, { as: "unit", foreignKey: "unitid" });
  unit.hasMany(ingredient, { as: "ingredients", foreignKey: "unitid" });

  // категории ↔ типы меню
  menucategory.belongsTo(menuitemtype, { as: "menuitemtype", foreignKey: "menuitemtypeid" });
  menuitemtype.hasMany(menucategory, { as: "menucategories", foreignKey: "menuitemtypeid" });

  return {
    client,
    customerloyalty,
    discount,
    extras,
    ingredient,
    menucategory,
    menuitem,
    menuitemextras,
    menuitemtype,
    order,
    orderitem,
    orderqueue,
    orderstatus,
    paymentmethod,
    position,
    staff,
    supplier,
    unit,
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
