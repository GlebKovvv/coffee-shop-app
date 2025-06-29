var DataTypes = require("sequelize").DataTypes;
var _client = require("./client");
var _customerloyalty = require("./customerloyalty");
var _discount = require("./discount");
var _employeeworkschedule = require("./employeeworkschedule");
var _extras = require("./extras");
var _ingredient = require("./ingredient");
var _inventoryadjustments = require("./inventoryadjustments");
var _menucategory = require("./menucategory");
var _menuitem = require("./menuitem");
var _menuitemextras = require("./menuitemextras");
var _menuitemphoto = require("./menuitemphoto");
var _menuitemtype = require("./menuitemtype");
var _order = require("./order");
var _orderitem = require("./orderitem");
var _orderqueue = require("./orderqueue");
var _orderstatus = require("./orderstatus");
var _paymentmethod = require("./paymentmethod");
var _position = require("./position");
var _purchaseorder = require("./purchaseorder");
var _readyproduct = require("./readyproduct");
var _recipe = require("./recipe");
var _refund = require("./refund");
var _shift = require("./shift");
var _staff = require("./staff");
var _stockmovement = require("./stockmovement");
var _supplier = require("./supplier");
var _sysdiagrams = require("./sysdiagrams");
var _unit = require("./unit");

function initModels(sequelize) {
  var client = _client(sequelize, DataTypes);
  var customerloyalty = _customerloyalty(sequelize, DataTypes);
  var discount = _discount(sequelize, DataTypes);
  var employeeworkschedule = _employeeworkschedule(sequelize, DataTypes);
  var extras = _extras(sequelize, DataTypes);
  var ingredient = _ingredient(sequelize, DataTypes);
  var inventoryadjustments = _inventoryadjustments(sequelize, DataTypes);
  var menucategory = _menucategory(sequelize, DataTypes);
  var menuitem = _menuitem(sequelize, DataTypes);
  var menuitemextras = _menuitemextras(sequelize, DataTypes);
  var menuitemphoto = _menuitemphoto(sequelize, DataTypes);
  var menuitemtype = _menuitemtype(sequelize, DataTypes);
  var order = _order(sequelize, DataTypes);
  var orderitem = _orderitem(sequelize, DataTypes);
  var orderqueue = _orderqueue(sequelize, DataTypes);
  var orderstatus = _orderstatus(sequelize, DataTypes);
  var paymentmethod = _paymentmethod(sequelize, DataTypes);
  var position = _position(sequelize, DataTypes);
  var purchaseorder = _purchaseorder(sequelize, DataTypes);
  var readyproduct = _readyproduct(sequelize, DataTypes);
  var recipe = _recipe(sequelize, DataTypes);
  var refund = _refund(sequelize, DataTypes);
  var shift = _shift(sequelize, DataTypes);
  var staff = _staff(sequelize, DataTypes);
  var stockmovement = _stockmovement(sequelize, DataTypes);
  var supplier = _supplier(sequelize, DataTypes);
  var sysdiagrams = _sysdiagrams(sequelize, DataTypes);
  var unit = _unit(sequelize, DataTypes);

  extras.belongsToMany(menuitem, { as: 'menuitemid_menuitems', through: menuitemextras, foreignKey: "extraid", otherKey: "menuitemid" });
  ingredient.belongsToMany(menuitem, { as: 'menuitemid_menuitem_recipes', through: recipe, foreignKey: "ingredientid", otherKey: "menuitemid" });
  menuitem.belongsToMany(extras, { as: 'extraid_extras', through: menuitemextras, foreignKey: "menuitemid", otherKey: "extraid" });
  menuitem.belongsToMany(ingredient, { as: 'ingredientid_ingredients', through: recipe, foreignKey: "menuitemid", otherKey: "ingredientid" });
  customerloyalty.belongsTo(client, { as: "client", foreignKey: "clientid"});
  client.hasMany(customerloyalty, { as: "customerloyalties", foreignKey: "clientid"});
  order.belongsTo(client, { as: "client", foreignKey: "clientid"});
  client.hasMany(order, { as: "orders", foreignKey: "clientid"});
  order.belongsTo(discount, { as: "discount", foreignKey: "discountid"});
  discount.hasMany(order, { as: "orders", foreignKey: "discountid"});
  menuitemextras.belongsTo(extras, { as: "extra", foreignKey: "extraid"});
  extras.hasMany(menuitemextras, { as: "menuitemextras", foreignKey: "extraid"});
  inventoryadjustments.belongsTo(ingredient, { as: "ingredient", foreignKey: "ingredientid"});
  ingredient.hasMany(inventoryadjustments, { as: "inventoryadjustments", foreignKey: "ingredientid"});
  purchaseorder.belongsTo(ingredient, { as: "ingredient", foreignKey: "ingredientid"});
  ingredient.hasMany(purchaseorder, { as: "purchaseorders", foreignKey: "ingredientid"});
  recipe.belongsTo(ingredient, { as: "ingredient", foreignKey: "ingredientid"});
  ingredient.hasMany(recipe, { as: "recipes", foreignKey: "ingredientid"});
  stockmovement.belongsTo(ingredient, { as: "ingredient", foreignKey: "ingredientid"});
  ingredient.hasMany(stockmovement, { as: "stockmovements", foreignKey: "ingredientid"});
  menuitem.belongsTo(menucategory, { as: "category", foreignKey: "categoryid"});
  menucategory.hasMany(menuitem, { as: "menuitems", foreignKey: "categoryid"});
  menuitemextras.belongsTo(menuitem, { as: "menuitem", foreignKey: "menuitemid"});
  menuitem.hasMany(menuitemextras, { as: "menuitemextras", foreignKey: "menuitemid"});
  menuitemphoto.belongsTo(menuitem, { as: "menuitem", foreignKey: "menuitemid"});
  menuitem.hasMany(menuitemphoto, { as: "menuitemphotos", foreignKey: "menuitemid"});
  orderitem.belongsTo(menuitem, { as: "menuitem", foreignKey: "menuitemid"});
  menuitem.hasMany(orderitem, { as: "orderitems", foreignKey: "menuitemid"});
  recipe.belongsTo(menuitem, { as: "menuitem", foreignKey: "menuitemid"});
  menuitem.hasMany(recipe, { as: "recipes", foreignKey: "menuitemid"});
  menucategory.belongsTo(menuitemtype, { as: "menuitemtype", foreignKey: "menuitemtypeid"});
  menuitemtype.hasMany(menucategory, { as: "menucategories", foreignKey: "menuitemtypeid"});
  readyproduct.belongsTo(menuitemtype, { as: "menuitemtype", foreignKey: "menuitemtypeid"});
  menuitemtype.hasMany(readyproduct, { as: "readyproducts", foreignKey: "menuitemtypeid"});
  orderitem.belongsTo(order, { as: "order", foreignKey: "orderid"});
  order.hasMany(orderitem, { as: "orderitems", foreignKey: "orderid"});
  orderqueue.belongsTo(order, { as: "order", foreignKey: "orderid"});
  order.hasMany(orderqueue, { as: "orderqueues", foreignKey: "orderid"});
  refund.belongsTo(order, { as: "order", foreignKey: "orderid"});
  order.hasMany(refund, { as: "refunds", foreignKey: "orderid"});
  order.belongsTo(orderstatus, { as: "orderstatus", foreignKey: "orderstatusid"});
  orderstatus.hasMany(order, { as: "orders", foreignKey: "orderstatusid"});
  order.belongsTo(paymentmethod, { as: "paymentmethod", foreignKey: "paymentmethodid"});
  paymentmethod.hasMany(order, { as: "orders", foreignKey: "paymentmethodid"});
  staff.belongsTo(position, { as: "position", foreignKey: "positionid"});
  position.hasMany(staff, { as: "staffs", foreignKey: "positionid"});
  inventoryadjustments.belongsTo(readyproduct, { as: "product", foreignKey: "productid"});
  readyproduct.hasMany(inventoryadjustments, { as: "inventoryadjustments", foreignKey: "productid"});
  orderitem.belongsTo(readyproduct, { as: "product", foreignKey: "productid"});
  readyproduct.hasMany(orderitem, { as: "orderitems", foreignKey: "productid"});
  purchaseorder.belongsTo(readyproduct, { as: "product", foreignKey: "productid"});
  readyproduct.hasMany(purchaseorder, { as: "purchaseorders", foreignKey: "productid"});
  stockmovement.belongsTo(readyproduct, { as: "product", foreignKey: "productid"});
  readyproduct.hasMany(stockmovement, { as: "stockmovements", foreignKey: "productid"});
  employeeworkschedule.belongsTo(staff, { as: "staff", foreignKey: "staffid"});
  staff.hasMany(employeeworkschedule, { as: "employeeworkschedules", foreignKey: "staffid"});
  inventoryadjustments.belongsTo(staff, { as: "staff", foreignKey: "staffid"});
  staff.hasMany(inventoryadjustments, { as: "inventoryadjustments", foreignKey: "staffid"});
  order.belongsTo(staff, { as: "staff", foreignKey: "staffid"});
  staff.hasMany(order, { as: "orders", foreignKey: "staffid"});
  shift.belongsTo(staff, { as: "staff", foreignKey: "staffid"});
  staff.hasMany(shift, { as: "shifts", foreignKey: "staffid"});
  stockmovement.belongsTo(staff, { as: "staff", foreignKey: "staffid"});
  staff.hasMany(stockmovement, { as: "stockmovements", foreignKey: "staffid"});
  purchaseorder.belongsTo(supplier, { as: "supplier", foreignKey: "supplierid"});
  supplier.hasMany(purchaseorder, { as: "purchaseorders", foreignKey: "supplierid"});
  ingredient.belongsTo(unit, { as: "unit", foreignKey: "unitid"});
  unit.hasMany(ingredient, { as: "ingredients", foreignKey: "unitid"});

  return {
    client,
    customerloyalty,
    discount,
    employeeworkschedule,
    extras,
    ingredient,
    inventoryadjustments,
    menucategory,
    menuitem,
    menuitemextras,
    menuitemphoto,
    menuitemtype,
    order,
    orderitem,
    orderqueue,
    orderstatus,
    paymentmethod,
    position,
    purchaseorder,
    readyproduct,
    recipe,
    refund,
    shift,
    staff,
    stockmovement,
    supplier,
    sysdiagrams,
    unit,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
