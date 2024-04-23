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

async function getWebsiteById(id) {
  try {
    const website = await sequelizeServer.models.websites.findOne({
      where: { websiteId: id },
    });
    return website;
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

async function createWebsite(website) {
  try {
    // const websiteDb = await sequelizeServer.models.websites.findOne({
    //     where: { website_name: website.website_name },
    // });
    // if (websiteDb != null) {
    //     throw "website";
    // }

    var result = await sequelizeServer.models.websites.create(website);

    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function updateWebsite(website) {
  try {
    const websiteDb = await sequelizeServer.models.websites.findOne({
      where: { websiteId: website.websiteId },
    });
    if (websiteDb == null) {
      throw "no website found";
    }

    var result = await sequelizeServer.models.websites.update(website, {
      where: { websiteId: website.websiteId },
    });

    return result;
  } catch (error) {
    if (error == "no website found") {
      throw "no website found";
    }
    return error;
  }
}

async function deleteWebsite(id) {
  try {
    const websiteDb = await sequelizeServer.models.websites.findOne({
      where: { websiteId: id },
    });
    if (websiteDb == null) {
      throw "no website found";
    }

    var result = await sequelizeServer.models.websites.destroy({
      where: { websiteId: id },
    });

    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getWebsites,
  getWebsiteById,
  getWebsiteByUserId,
  createWebsite,
  updateWebsite,
  deleteWebsite,
};
