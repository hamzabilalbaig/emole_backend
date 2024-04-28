const { sequelizeServer } = require("../config/sequelize.config");
const { Op } = require("sequelize");

async function getWebsites() {
  try {
    const websites = await sequelizeServer.models.websites.findAll();
    return websites;
  } catch (error) {
    throw error;
  }
}

async function getWebsiteByUserId(id) {
  try {
    const websites = await sequelizeServer.models.Websites.findAll({
      include: [
        {
          model: sequelizeServer?.models?.Pages,
          as: "Pages",
          include: [
            {
              model: sequelizeServer?.models?.Products,
              as: "Products",
              include: [
                {
                  model: sequelizeServer?.models?.User_Products,
                  as: "User_Products",
                  where: {
                    UserID: id,
                  },
                },
                {
                  model: sequelizeServer?.models?.Segment_Products,
                  as: "Segment_Products",

                  include: [
                    {
                      model: sequelizeServer?.models?.Segments,
                      as: "Group",
                    },
                  ],
                },
                {
                  model: sequelizeServer?.models?.alerts,
                  as: "alerts",
                },
              ],
            },
          ],
        },
      ],
    });

    const websiteWithCounts = websites.map((website) => {
      const alerts = website.Pages[0]?.Products[0]?.alerts || [];
      const segments = website.Pages[0]?.Products[0]?.User_Segments || [];
      const products = website.Pages[0]?.Products || [];
      const totalProducts = products.length;
      const trueStockProducts = products.filter(
        (product) => product.StockStatus === true
      ).length;
      const falseStockProducts = products.filter(
        (product) => product.StockStatus === false
      ).length;

      return {
        WebsiteID: website?.WebsiteID,
        Name: website?.Name,
        URL: website?.URL,
        Description: website?.Description,
        totalProducts: totalProducts,
        inStockProducts: trueStockProducts,
        outOfStockProducts: falseStockProducts,
        products: products, // Include associated products
        alerts: alerts, // Include associated alerts
        segments: segments, // Include associated segments
      };
    });

    return websiteWithCounts;
  } catch (error) {
    throw error;
  }
}

async function getProductByWebsiteId(id, UserID) {
  try {
    const website = await sequelizeServer.models.Websites.findOne({
      where: { WebsiteID: id },
      include: [
        {
          model: sequelizeServer?.models?.Pages,
          as: "Pages",
          include: [
            {
              model: sequelizeServer?.models?.Products,
              as: "Products",
              include: [
                {
                  model: sequelizeServer?.models?.User_Products,
                  as: "User_Products",
                  where: {
                    UserID: UserID,
                  },
                },
              ],
            },
          ],
        },
      ],
    });

    const inStockProducts = website.Pages[0]?.Products || [];

    const result = website.map((websitee) => ({
      website: websitee,
      inStockProducts: websitee.products,
    }));

    return result;
  } catch (error) {
    throw error;
  }
}

async function getProductsCountByWebsiteId(id, UserID) {
  try {
    const website = await sequelizeServer.models.Websites.findOne({
      where: { WebsiteID: id },
      include: [
        {
          model: sequelizeServer?.models?.Pages,
          as: "Pages",
          include: [
            {
              model: sequelizeServer?.models?.Products,
              as: "Products",
              include: [
                {
                  model: sequelizeServer?.models?.User_Products,
                  as: "User_Products",
                  where: {
                    UserID: UserID,
                  },
                },
              ],
            },
          ],
        },
      ],
    });

    const products = website.Pages[0]?.Products || [];
    const totalProducts = products.length;
    const trueStockProducts = products.filter(
      (product) => product.StockStatus === true
    ).length;
    const falseStockProducts = products.filter(
      (product) => product.StockStatus === false
    ).length;

    return {
      totalProducts: totalProducts,
      inStockProducts: trueStockProducts,
      outOfStockProducts: falseStockProducts,
    };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getWebsites,
  getWebsiteByUserId,

  getProductByWebsiteId,
  getProductsCountByWebsiteId,
};
