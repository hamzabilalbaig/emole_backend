var DataTypes = require("sequelize").DataTypes;
var _Users = require("./Users");
var _products = require("./products");
var _websites = require("./websites");

function initModels(sequelize) {
  var Users = _Users(sequelize, DataTypes);
  var products = _products(sequelize, DataTypes);
  var websites = _websites(sequelize, DataTypes);

  websites.belongsTo(Users, { as: "id_User", foreignKey: "id"});
  Users.hasMany(websites, { as: "websites", foreignKey: "id"});
  products.belongsTo(websites, { as: "website", foreignKey: "websiteId"});
  websites.hasMany(products, { as: "products", foreignKey: "websiteId"});

  return {
    Users,
    products,
    websites,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
