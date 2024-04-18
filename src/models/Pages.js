const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Pages', {
    PageID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    URL: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    WebsiteID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Websites',
        key: 'WebsiteID'
      }
    }
  }, {
    sequelize,
    tableName: 'Pages',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "PageID" },
        ]
      },
      {
        name: "WebsiteID",
        using: "BTREE",
        fields: [
          { name: "WebsiteID" },
        ]
      },
    ]
  });
};
