const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product_history', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Products',
        key: 'ProductID'
      }
    },
    Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    OldPrice: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    NewPrice: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    StockStatus: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Category: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    TotalAlerts: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LastAlert: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'product_history',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID" },
        ]
      },
      {
        name: "product_id",
        using: "BTREE",
        fields: [
          { name: "product_id" },
        ]
      },
    ]
  });
};
