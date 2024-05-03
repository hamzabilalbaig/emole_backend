var DataTypes = require("sequelize").DataTypes;
var _Billing = require("./Billing");
var _Pages = require("./Pages");
var _Plans = require("./Plans");
var _Products = require("./Products");
var _Segment_Products = require("./Segment_Products");
var _Segments = require("./Segments");
var _User_Products = require("./User_Products");
var _Users = require("./Users");
var _Websites = require("./Websites");
var _alerts = require("./alerts");
var _product_history = require("./product_history");

function initModels(sequelize) {
  var Billing = _Billing(sequelize, DataTypes);
  var Pages = _Pages(sequelize, DataTypes);
  var Plans = _Plans(sequelize, DataTypes);
  var Products = _Products(sequelize, DataTypes);
  var Segment_Products = _Segment_Products(sequelize, DataTypes);
  var Segments = _Segments(sequelize, DataTypes);
  var User_Products = _User_Products(sequelize, DataTypes);
  var Users = _Users(sequelize, DataTypes);
  var Websites = _Websites(sequelize, DataTypes);
  var alerts = _alerts(sequelize, DataTypes);
  var product_history = _product_history(sequelize, DataTypes);

  Products.belongsTo(Pages, { as: "Page", foreignKey: "PageID"});
  Pages.hasMany(Products, { as: "Products", foreignKey: "PageID"});
  Billing.belongsTo(Plans, { as: "Plan", foreignKey: "PlanID"});
  Plans.hasMany(Billing, { as: "Billings", foreignKey: "PlanID"});
  Users.belongsTo(Plans, { as: "userplan_Plan", foreignKey: "userplan"});
  Plans.hasMany(Users, { as: "Users", foreignKey: "userplan"});
  Segment_Products.belongsTo(Products, { as: "Product", foreignKey: "ProductID"});
  Products.hasMany(Segment_Products, { as: "Segment_Products", foreignKey: "ProductID"});
  User_Products.belongsTo(Products, { as: "Product", foreignKey: "ProductID"});
  Products.hasMany(User_Products, { as: "User_Products", foreignKey: "ProductID"});
  alerts.belongsTo(Products, { as: "product", foreignKey: "product_id"});
  Products.hasMany(alerts, { as: "alerts", foreignKey: "product_id"});
  product_history.belongsTo(Products, { as: "product", foreignKey: "product_id"});
  Products.hasMany(product_history, { as: "product_histories", foreignKey: "product_id"});
  Segment_Products.belongsTo(Segments, { as: "Group", foreignKey: "GroupID"});
  Segments.hasMany(Segment_Products, { as: "Segment_Products", foreignKey: "GroupID"});
  Billing.belongsTo(Users, { as: "User", foreignKey: "UserID"});
  Users.hasMany(Billing, { as: "Billings", foreignKey: "UserID"});
  Segments.belongsTo(Users, { as: "User", foreignKey: "UserID"});
  Users.hasMany(Segments, { as: "Segments", foreignKey: "UserID"});
  User_Products.belongsTo(Users, { as: "User", foreignKey: "UserID"});
  Users.hasMany(User_Products, { as: "User_Products", foreignKey: "UserID"});
  Pages.belongsTo(Websites, { as: "Website", foreignKey: "WebsiteID"});
  Websites.hasMany(Pages, { as: "Pages", foreignKey: "WebsiteID"});

  return {
    Billing,
    Pages,
    Plans,
    Products,
    Segment_Products,
    Segments,
    User_Products,
    Users,
    Websites,
    alerts,
    product_history,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
