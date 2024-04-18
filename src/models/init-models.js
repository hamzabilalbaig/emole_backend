var DataTypes = require("sequelize").DataTypes;
var _Pages = require("./Pages");
var _Products = require("./Products");
var _Segment_Products = require("./Segment_Products");
var _Segments = require("./Segments");
var _User_Products = require("./User_Products");
var _Users = require("./Users");
var _Websites = require("./Websites");

function initModels(sequelize) {
  var Pages = _Pages(sequelize, DataTypes);
  var Products = _Products(sequelize, DataTypes);
  var Segment_Products = _Segment_Products(sequelize, DataTypes);
  var Segments = _Segments(sequelize, DataTypes);
  var User_Products = _User_Products(sequelize, DataTypes);
  var Users = _Users(sequelize, DataTypes);
  var Websites = _Websites(sequelize, DataTypes);

  Products.belongsTo(Pages, { as: "Page", foreignKey: "PageID"});
  Pages.hasMany(Products, { as: "Products", foreignKey: "PageID"});
  Segment_Products.belongsTo(Products, { as: "Product", foreignKey: "ProductID"});
  Products.hasMany(Segment_Products, { as: "Segment_Products", foreignKey: "ProductID"});
  User_Products.belongsTo(Products, { as: "Product", foreignKey: "ProductID"});
  Products.hasMany(User_Products, { as: "User_Products", foreignKey: "ProductID"});
  Segment_Products.belongsTo(Segments, { as: "Group", foreignKey: "GroupID"});
  Segments.hasMany(Segment_Products, { as: "Segment_Products", foreignKey: "GroupID"});
  Segments.belongsTo(Users, { as: "User", foreignKey: "UserID"});
  Users.hasMany(Segments, { as: "Segments", foreignKey: "UserID"});
  User_Products.belongsTo(Users, { as: "User", foreignKey: "UserID"});
  Users.hasMany(User_Products, { as: "User_Products", foreignKey: "UserID"});
  Pages.belongsTo(Websites, { as: "Website", foreignKey: "WebsiteID"});
  Websites.hasMany(Pages, { as: "Pages", foreignKey: "WebsiteID"});

  return {
    Pages,
    Products,
    Segment_Products,
    Segments,
    User_Products,
    Users,
    Websites,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
