const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Products', {
    ProductID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    LastPrice: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    Category: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    StockStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    OutOfStockCount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    product_url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Images: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Tags: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    PageID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Pages',
        key: 'PageID'
      }
    }
  }, {
    sequelize,
    tableName: 'Products',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ProductID" },
        ]
      },
      {
        name: "PageID",
        using: "BTREE",
        fields: [
          { name: "PageID" },
        ]
      },
    ]
  });
};
