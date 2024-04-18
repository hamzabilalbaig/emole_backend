var DataTypes = require("sequelize").DataTypes;
var _Pages = require("./Pages");
var _Products = require("./Products");
var _Products_Websites = require("./Products_Websites");
var _Segment_Products = require("./Segment_Products");
var _Segments = require("./Segments");
var _User_Products = require("./User_Products");
var _Users = require("./Users");
var _Websites = require("./Websites");

function initModels(sequelize) {
  var Pages = _Pages(sequelize, DataTypes);
  var Products = _Products(sequelize, DataTypes);
  var Products_Websites = _Products_Websites(sequelize, DataTypes);
  var Segment_Products = _Segment_Products(sequelize, DataTypes);
  var Segments = _Segments(sequelize, DataTypes);
  var User_Products = _User_Products(sequelize, DataTypes);
  var Users = _Users(sequelize, DataTypes);
  var Websites = _Websites(sequelize, DataTypes);

  Products.belongsTo(Pages, { as: "Page", foreignKey: "PageID" });
  Pages.hasMany(Products, { as: "Products", foreignKey: "PageID" });
  // Products_Websites.belongsTo(Products, {
  //   as: "Product",
  //   foreignKey: "ProductId",
  // });
  // Products.hasMany(Products_Websites, {
  //   as: "Products_Websites",
  //   foreignKey: "ProductId",
  // });
  Segment_Products.belongsTo(Products, {
    as: "Product",
    foreignKey: "ProductID",
  });
  Products.hasMany(Segment_Products, {
    as: "Segment_Products",
    foreignKey: "ProductID",
  });
  User_Products.belongsTo(Products, { as: "Product", foreignKey: "ProductID" });
  Products.hasMany(User_Products, {
    as: "User_Products",
    foreignKey: "ProductID",
  });
  Segment_Products.belongsTo(Segments, { as: "Group", foreignKey: "GroupID" });
  Segments.hasMany(Segment_Products, {
    as: "Segment_Products",
    foreignKey: "GroupID",
  });
  Segments.belongsTo(Users, { as: "User", foreignKey: "UserID" });
  Users.hasMany(Segments, { as: "Segments", foreignKey: "UserID" });
  User_Products.belongsTo(Users, { as: "User", foreignKey: "UserID" });
  Users.hasMany(User_Products, { as: "User_Products", foreignKey: "UserID" });
  Pages.belongsTo(Websites, { as: "Website", foreignKey: "WebsiteID" });
  Websites.hasMany(Pages, { as: "Pages", foreignKey: "WebsiteID" });
  // Products_Websites.belongsTo(Websites, {
  //   as: "Website",
  //   foreignKey: "WebsiteId",
  // });
  // Websites.hasMany(Products_Websites, {
  //   as: "Products_Website",
  //   foreignKey: "WebsiteId",
  // });

  //addition

  Websites.belongsToMany(Products, {
    through: "Products_Websites",
    as: "Products",
    foreignKey: "WebsiteID",
  });

  Products.belongsToMany(Websites, {
    through: "Products_Websites",
    as: "Websites",
    foreignKey: "ProductID",
  });

  return {
    Pages,
    Products,
    Products_Websites,
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
