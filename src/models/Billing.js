const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Billing', {
    BillingID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'UserID'
      }
    },
    PlanID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Plans',
        key: 'idPlans'
      }
    },
    Duration: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Billing',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "BillingID" },
        ]
      },
      {
        name: "UserId_idx",
        using: "BTREE",
        fields: [
          { name: "UserID" },
        ]
      },
      {
        name: "plan_idx",
        using: "BTREE",
        fields: [
          { name: "PlanID" },
        ]
      },
    ]
  });
};
