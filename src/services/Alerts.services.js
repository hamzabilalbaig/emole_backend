const { sequelizeServer } = require("../config/sequelize.config");
const { Op } = require("sequelize");

async function getAlertByUserID(UserID, page, pageSize, filters) {
  try {
    const offset = (page - 1) * pageSize;

    const filterOptions = {
      where: {},
    };

    const filterOptionsWebsite = {
      where: {},
    };

    if (filters?.createdAt) {
      const { startDate, endDate } = filters.createdAt;
      if (startDate && endDate) {
        filterOptions.where.createdAt = {
          [Op.between]: [startDate, endDate],
        };
      } else {
        filterOptions.where.createdAt = {
          [Op.between]: [
            "1900-04-17T23:51:45.000Z",
            "2100-04-17T23:51:45.000Z",
          ],
        };
      }
    }

    if (filters?.priority) {
      filterOptions.where.priority = filters.priority;
    }

    if (filters?.alert_type) {
      filterOptions.where.alert_type = filters.alert_type;
    }

    if (filters?.website) {
      const URL = filters.website;
      filterOptionsWebsite.where.URL = URL;
    }

    const alertsCount = await sequelizeServer.models.alerts.count({
      where: { ...filterOptions.where },

      include: [
        {
          model: sequelizeServer.models.Products,
          as: "product",
          required: true,
          include: [
            {
              model: sequelizeServer.models.Pages,
              as: "Page",
              required: true,
              include: [
                {
                  model: sequelizeServer.models.Websites,
                  as: "Website",
                  required: true,
                  where: { ...filterOptionsWebsite.where },
                },
              ],
            },
            {
              model: sequelizeServer.models.User_Products,
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

    const totalFilteredPages = Math.ceil(alertsCount / pageSize);

    const alerts = await sequelizeServer.models.alerts.findAll({
      where: { ...filterOptions.where },
      include: [
        {
          model: sequelizeServer.models.Products,
          as: "product",
          include: [
            {
              model: sequelizeServer.models.Pages,
              as: "Page",
              include: [
                {
                  model: sequelizeServer.models.Websites,
                  as: "Website",
                  where: { ...filterOptionsWebsite.where },
                },
              ],
            },
            {
              model: sequelizeServer.models.User_Products,
              as: "User_Products",
              where: {
                UserID: UserID,
              },
              attributes: [],
            },
          ],
        },
      ],
      limit: pageSize,
      offset: offset,
    });

    return {
      alerts: alerts,
      totalCount: alertsCount,
      totalPages: totalFilteredPages,
    };
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

async function readAlert(id) {
  try {
    const alert = await sequelizeServer?.models?.alerts?.update(
      {
        read: true,
      },
      {
        where: {
          id: id,
        },
      }
    );

    return alert;
  } catch (error) {
    return error;
  }
}

async function getAlertAndSetRead(id) {
  try {
    await sequelizeServer?.models?.alerts?.update(
      {
        read: true,
      },
      {
        where: {
          id: id,
        },
      }
    );
    const alert = await sequelizeServer?.models?.alerts?.findOne({
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
  readAlert,
  getAlertAndSetRead,
};
