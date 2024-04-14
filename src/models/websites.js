const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('websites', {
    websiteId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    website_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    website_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    // created_at missing
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    // updatedAt: {
    //   type: DataTypes.DATE,
    //   allowNull: true,
    //   defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    // },
  }, {
    sequelize,
    tableName: 'websites',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "websiteId" },
        ]
      },
      {
        name: "id",
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
