const { sequelizeServer } = require("../config/sequelize.config");
const { Op } = require("sequelize");

async function getProducts() {
  try {
    const products = await sequelizeServer.models.products.findAll();
    return products;
  } catch (error) {
    throw error;
  }
}

async function getProductById(id) {
  try {
    const product = await sequelizeServer.models.products.findOne({
      where: { id: id },
    });
    return product;
  } catch (error) {
    throw error;
  }
}

async function getProductsByUserID(userId, page, pageSize, filters) {
  try {
    // Validate page and pageSize inputs
    if (typeof page !== "number" || page <= 0) {
      throw new Error("Invalid page number");
    }
    if (typeof pageSize !== "number" || pageSize <= 0) {
      throw new Error("Invalid page size");
    }

    // Calculate offset for pagination
    const offset = (page - 1) * pageSize;

    // Fetch total count of products for the user

    const filterOptions = {
      where: {},
    };

    // Add price range filter
    if (filters?.productPrice) {
      const { minPrice, maxPrice } = filters.productPrice;
      if (typeof minPrice === "number" && typeof maxPrice === "number") {
        filterOptions.where.Price = {
          [Op.between]: [minPrice, maxPrice],
        };
      }
    }

    // Add created date range filter
    if (filters?.createdDate) {
      const { startDate, endDate } = filters.createdDate;
      if (startDate && endDate) {
        filterOptions.where.CreatedAt = {
          [Op.between]: [startDate, endDate],
        };
      }
    }

    // // Add website ID filter if provided
    // if (filters?.websites?.length > 0) {
    //   filterOptions.where.websiteId = {
    //     [Op.in]: filters.websites,
    //   };

    //   // Include related website data
    // }

    if (filters?.category.length > 0) {
      filterOptions.where.Category = {
        [Op.in]: filters.category,
      };
    }

    if (filters?.StockStatus !== null) {
      filterOptions.where.StockStatus = filters.StockStatus;
    }

    // Calculate total product count after filters are applied
    const totalFilteredProducts =
      await sequelizeServer.models.User_Products.count({
        where: { UserID: userId },
        include: [
          {
            model: sequelizeServer.models.Products,
            as: "Product",
            where: { ...filterOptions?.where },
            include: [
              {
                model: sequelizeServer.models.Pages,
                as: "Page",
                include: [
                  {
                    model: sequelizeServer.models.Websites,
                    as: "Website",
                  },
                ],
              },
            ],
          },
        ],
      });

    // Calculate the total number of pages based on the filtered data
    const totalFilteredPages = Math.ceil(totalFilteredProducts / pageSize);

    // Fetch user products with pagination
    const userProducts = await sequelizeServer.models.User_Products.findAll({
      where: { UserID: userId },
      include: [
        {
          model: sequelizeServer.models.Products,
          as: "Product",
          where: { ...filterOptions?.where },
          include: [
            {
              model: sequelizeServer.models.Pages,
              as: "Page",
              include: [
                {
                  model: sequelizeServer.models.Websites,
                  as: "Website",
                },
              ],
            },
          ],
        },
      ],
      limit: pageSize,
      offset: offset,
    });

    // Return user products, total count, and total pages
    return {
      products: userProducts,
      totalCount: totalFilteredProducts,
      totalPages: totalFilteredPages,
    };
  } catch (error) {
    throw error;
  }
}

async function createProduct(product) {
  try {
    const productDb = await sequelizeServer.models.products.findOne({
      where: { productName: product.productName },
    });
    if (productDb != null) {
      throw "product";
    }

    var result = await sequelizeServer.models.products.create(product);

    return result;
  } catch (error) {
    if (error == "product") {
      throw ". Product already exists. Please try a different product";
    }
    return error;
  }
}

async function updateProduct(product) {
  try {
    const productDb = await sequelizeServer.models.products.findOne({
      where: { id: product.id },
    });
    if (productDb == null) {
      throw "no product found";
    }

    var result = await sequelizeServer.models.products.update(product, {
      where: { id: product.id },
    });

    return result;
  } catch (error) {
    if (error == "no product found") {
      throw "no product found";
    }
    return error;
  }
}

async function deleteProduct(id) {
  try {
    const productDb = await sequelizeServer.models.products.findOne({
      where: { id: id },
    });
    if (productDb == null) {
      throw "no product found";
    }

    var result = await sequelizeServer.models.products.destroy({
      where: { id: id },
    });

    return result;
  } catch (error) {
    throw error;
  }
}

async function getProductsByCategory(category) {
  try {
    const products = await sequelizeServer.models.products.findAll({
      where: { Category: category },
    });
    return products;
  } catch (error) {
    throw error;
  }
}

async function getProductsByWebsite(websiteId) {
  try {
    const products = await sequelizeServer.models.products.findAll({
      where: { websiteId: websiteId },
    });
    return products;
  } catch (error) {
    throw error;
  }
}

async function getProductsByPage(page, pageSize, filters) {
  try {
    // Validate inputs
    if (typeof page !== "number" || page <= 0) {
      throw new Error("Invalid page number");
    }
    if (typeof pageSize !== "number" || pageSize <= 0) {
      throw new Error("Invalid page size");
    }

    // Calculate offset
    const offset = (page - 1) * pageSize;

    // Initialize filter options
    const filterOptions = {
      where: {},
    };

    // Add price range filter
    if (filters?.productPrice) {
      const { minPrice, maxPrice } = filters.productPrice;
      if (typeof minPrice === "number" && typeof maxPrice === "number") {
        filterOptions.where.Price = {
          [Op.between]: [minPrice, maxPrice],
        };
      }
    }

    // Add created date range filter
    if (filters?.createdDate) {
      const { startDate, endDate } = filters.createdDate;
      if (startDate && endDate) {
        filterOptions.where.CreatedAt = {
          [Op.between]: [startDate, endDate],
        };
      }
    }

    // // Add website ID filter if provided
    // if (filters?.websites?.length > 0) {
    //   filterOptions.where.websiteId = {
    //     [Op.in]: filters.websites,
    //   };

    //   // Include related website data
    // }

    if (filters?.category) {
      filterOptions.where.Category = {
        [Op.in]: filters.category,
      };
    }

    if (filters?.StockStatus) {
      filterOptions.where.StockStatus = {
        [Op.in]: filters.StockStatus,
      };
    }

    // filterOptions.include = [
    //   {
    //     model: sequelizeServer.models.websites,
    //     as: "website",
    //     attributes: ["website_name", "website_url"],
    //   },
    // ];

    console.log("Filter options:", filterOptions);

    // Combine filter options with pagination options
    const queryOptions = {
      ...filterOptions,
      limit: pageSize,
      offset: offset,
    };

    // Fetch products based on the query options
    const products = await sequelizeServer.models.products.findAll(
      queryOptions
    );

    return products;
  } catch (error) {
    console.error(
      `Error fetching products for page ${page} and page size ${pageSize}:`,
      error
    );
    throw error;
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsByWebsite,
  getProductsByPage,
  getProductsByUserID,
};
