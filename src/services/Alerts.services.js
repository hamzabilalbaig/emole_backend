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

async function deleteAlert(ids) {
  try {
    const results = await Promise.all(
      ids.map(async (id) => {
        const alert = await sequelizeServer?.models?.alerts?.destroy({
          where: {
            id: id,
          },
        });
        return alert;
      })
    );

    return results;
  } catch (error) {
    return error;
  }
}

async function readAlert(ids, read) {
  try {
    const results = await Promise.all(
      ids.map(async (id) => {
        const alert = await sequelizeServer?.models?.alerts?.update(
          {
            read: read,
          },
          {
            where: {
              id: id,
            },
          }
        );
        return alert;
      })
    );

    return results;
  } catch (error) {
    return error;
  }
}

async function getAlertAndSetRead(id) {
  try {
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

async function getLatestAlerts(UserID) {
  try {
    const alerts = await sequelizeServer.models.alerts.findAll({
      order: [["createdAt", "DESC"]],
      where: {
        read: false,
      },
      include: [
        {
          model: sequelizeServer.models.Products,
          as: "product",
          include: [
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
    return alerts;
  } catch (error) {
    return error;
  }
}

async function getLatestPriceAlerts(UserID) {
  try {
    const alerts = await sequelizeServer.models.alerts.findAll({
      order: [["createdAt", "DESC"]],
      where: {
        read: false,
        alert_type: "Price Change",
      },
      include: [
        {
          model: sequelizeServer.models.Products,
          as: "product",
          include: [
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
    return alerts;
  } catch (error) {
    return error;
  }
}

async function getLatestStockAlerts(UserID) {
  try {
    const alerts = await sequelizeServer.models.alerts.findAll({
      order: [["createdAt", "DESC"]],
      where: {
        read: false,
        alert_type: "Stock Status Change",
      },
      include: [
        {
          model: sequelizeServer.models.Products,
          as: "product",
          include: [
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
    return alerts;
  } catch (error) {
    return error;
  }
}

async function getMostAlertedProducts(UserID) {
  try {
    const mostAlertedProducts = await sequelizeServer.models.Products.findAll({
      attributes: [
        "CreatedAt",
        "Name",
        "Description",
        "Price",
        "currency",
        "LastPrice",
        "Category",
        "StockStatus",
        "OutOfStockCount",
        "UpdatedAt",
        "product_url",
        "Tags",
        "Images",
        "ProductID",
        [
          sequelizeServer.literal(
            "(SELECT COUNT(*) FROM alerts WHERE alerts.product_id = Products.ProductID AND alerts.read = false)"
          ),
          "alertCount",
        ],
      ],

      having: sequelizeServer.literal("alertCount > 0"), // Filter out products with 0 alerts
      order: [[sequelizeServer.literal("alertCount"), "DESC"]],
    });

    return mostAlertedProducts;
  } catch (error) {
    throw error;
  }
}

async function getMostAlertedSegments(UserID) {
  try {
    const mostAlertedSegments =
      await sequelizeServer.models.Segment_Products.findAll({
        include: [
          {
            model: sequelizeServer.models.Segments,
            as: "Group",
            where: {
              UserID: UserID,
            },
          },
          {
            model: sequelizeServer.models.Products,
            as: "Product",
            include: [
              {
                model: sequelizeServer.models.User_Products,
                as: "User_Products",
              },
            ],
          },
        ],
        attributes: [
          "GroupID",
          [
            sequelizeServer.literal(
              "(SELECT COUNT(*) FROM alerts WHERE alerts.product_id = Segment_Products.ProductID AND alerts.read = false)"
            ),
            "alertCount",
          ],
        ],
        group: ["GroupID"],
        having: sequelizeServer.literal("alertCount > 0"),
        order: [[sequelizeServer.literal("alertCount"), "DESC"]],
      });

    return mostAlertedSegments;
  } catch (error) {
    throw error;
  }
}

async function getMostAlertedWebsites(UserID) {
  try {
    // const mostAlertedProducts = await sequelizeServer.models.Products.findAll({
    //   attributes: [
    //     "CreatedAt",
    //     "ProductID",
    //     [
    //       sequelizeServer.literal(
    //         "(SELECT COUNT(*) FROM alerts WHERE alerts.product_id = Products.ProductID AND alerts.read = false)"
    //       ),
    //       "alertCount",
    //     ],
    //   ],
    //   include: [
    //     {
    //       model: sequelizeServer.models.User_Products,
    //       as: "User_Products",
    //       where: {
    //         UserID: UserID,
    //       },

    //       include: [
    //         {
    //           model: sequelizeServer.models.Products,
    //           as: "Product",
    //         },
    //       ],
    //     },
    //   ],
    //   having: sequelizeServer.literal("alertCount > 0"), // Filter out products with 0 alerts
    //   order: [[sequelizeServer.literal("alertCount"), "DESC"]],
    // });
    const mostAlertedWebsites = await sequelizeServer.models.Websites.findAll({
      include: [
        {
          model: sequelizeServer.models.Pages,
          as: "Pages",
          include: [
            {
              model: sequelizeServer.models.Products,
              as: "Products",

              include: [
                {
                  model: sequelizeServer.models.User_Products,
                  as: "User_Products",
                  where: {
                    UserID: UserID,
                  },
                },
                {
                  model: sequelizeServer.models.alerts,
                  as: "alerts",
                  where: {
                    read: false,
                  },
                },
              ],
            },
          ],
        },
      ],
      attributes: [
        "WebsiteID",
        "Name",
        "URL",
        "Description",

        [
          sequelizeServer.literal(
            "(SELECT COUNT(*) FROM alerts WHERE alerts.product_id IN (SELECT ProductID FROM Products WHERE Products.PageID IN (SELECT PageID FROM Pages WHERE Pages.WebsiteID = Websites.WebsiteID)) AND alerts.read = false)"
          ),
          "alertCount",
        ],
      ],
      group: ["WebsiteID"], // Group by WebsiteID to get the count of alerts for each website
      order: [[sequelizeServer.literal("alertCount"), "DESC"]],
    });

    return mostAlertedWebsites;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAlertByUserID,
  deleteAlert,
  readAlert,
  getAlertAndSetRead,
  getLatestAlerts,
  getLatestPriceAlerts,
  getLatestStockAlerts,
  getMostAlertedProducts,
  getMostAlertedSegments,
  getMostAlertedWebsites,
};
