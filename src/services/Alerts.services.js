const { sequelizeServer } = require("../config/sequelize.config");

async function getAlertByUserID(UserID) {
  try {
    const alerts = await sequelizeServer?.models?.alerts?.findAll({
      include: [
        {
          model: sequelizeServer?.models?.Products,
          as: "product",
          attributes: [],
          include: [
            {
              model: sequelizeServer?.models?.User_Products,
              as: "User_Products",
              where: {
                UserID: UserID,
              },
              attributes: [],
            },
          ],
        },
      ],
    });

    return alerts;
  } catch (error) {
    return error;
  }
}

async function deleteAlert(id) {
  try {
    const alert = await sequelizeServer?.models?.alerts?.destroy({
      where: {
        id: id,
      },
    });

    return alert;
  } catch (error) {
    return error;
  }
}

module.exports = {
  getAlertByUserID,
  deleteAlert,
};
