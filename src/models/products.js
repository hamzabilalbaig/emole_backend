const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('products', {
    productId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    productName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    productPrice: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    PreviousPrice: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    websiteId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'websites',
        key: 'websiteId'
      }
    },
    Category: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'products',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "productId" },
        ]
      },
      {
        name: "websiteId",
        using: "BTREE",
        fields: [
          { name: "websiteId" },
        ]
      },
    ]
  });
};
