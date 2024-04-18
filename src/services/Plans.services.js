const { sequelizeServer } = require("../config/sequelize.config");
const { Op } = require("sequelize");

async function getPlans() {
  try {
    const plans = await sequelizeServer.models.Plans.findAll();
    return plans;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getPlans,
};
