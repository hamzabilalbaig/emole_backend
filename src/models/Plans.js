const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Plans', {
    idPlans: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    PlanName: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    PlanPrice: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    PlanDuration: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    NumberOfProducts: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Plans',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idPlans" },
        ]
      },
    ]
  });
};
