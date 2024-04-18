const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Products_Websites', {
    idProducts_Websites: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ProductId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Products',
        key: 'ProductID'
      }
    },
    WebsiteId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Websites',
        key: 'WebsiteID'
      }
    }
  }, {
    sequelize,
    tableName: 'Products_Websites',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idProducts_Websites" },
        ]
      },
      {
        name: "ProductId_idx",
        using: "BTREE",
        fields: [
          { name: "ProductId" },
        ]
      },
      {
        name: "WebsiteId_idx",
        using: "BTREE",
        fields: [
          { name: "WebsiteId" },
        ]
      },
    ]
  });
};
