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
              ],
            },
          ],
        },
      ],
    });

    const websiteWithCounts = websites.map((website) => {
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

    return website;
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
