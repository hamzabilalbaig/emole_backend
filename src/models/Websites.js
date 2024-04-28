const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Websites', {
    WebsiteID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    URL: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "URL"
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Websites',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "WebsiteID" },
        ]
      },
      {
        name: "URL",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "URL" },
        ]
      },
    ]
  });
};
