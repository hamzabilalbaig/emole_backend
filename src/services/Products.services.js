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
      if (minPrice !== null && maxPrice !== null) {
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

    if (filters?.category.length > 0) {
      filterOptions.where.Category = {
        [Op.in]: filters.category,
      };
    }

    if (filters?.StockStatus !== null) {
      filterOptions.where.StockStatus = filters.StockStatus;
    }

    // Add SegmentID filter if provided
    if (filters?.SegmentID !== null) {
      filterOptions.include = [
        {
          model: sequelizeServer.models.Segment_Products,
          as: "Segment_Products",
          where: {
            GroupID: filters?.SegmentID,
          },
          include: [
            {
              model: sequelizeServer.models.Segments,
              as: "Group",
            },
          ],
        },
      ];
    }

    // Calculate total product count after filters are applied
    const totalFilteredProducts =
      await sequelizeServer.models.User_Products.count({
        where: { UserID: userId },
        required: true,
        include: [
          {
            model: sequelizeServer.models.Products,
            as: "Product",
            where: { ...filterOptions.where },
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
                  },
                ],
              },
              ...(filterOptions.include || []), // Spread the include options
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
          where: { ...filterOptions.where },
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
            ...(filterOptions.include || []), // Spread the include options
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

async function deleteProduct(ids, userID) {
  try {
    const results = await Promise.all(
      ids.map(async (id) => {
        const alert = await sequelizeServer?.models?.User_Products?.destroy({
          where: {
            ProductID: id,
            UserID: userID,
          },
        });
        return alert;
      })
    );

    const results2 = await Promise.all(
      ids.map(async (id) => {
        const alert = await sequelizeServer?.models?.Segment_Products?.destroy({
          where: {
            ProductID: id,
          },
        });
        return alert;
      })
    );

    return results2;
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

async function getCounts(id) {
  try {
    const products = await sequelizeServer.models.User_Products.count({
      where: {
        UserID: id,
      },
    });

    const stock = await sequelizeServer.models.User_Products.count({
      where: {
        UserID: id,
      },
      include: [
        {
          model: sequelizeServer?.models?.Products,
          as: "Product",
          where: {
            StockStatus: 0,
          },
        },
      ],
    });

    const groups = await sequelizeServer?.models?.Segments?.count({
      where: {
        UserID: id,
      },
    });

    const websites = await sequelizeServer.models.Websites.count({
      distinct: true, // Count distinct websites
      include: [
        {
          model: sequelizeServer.models.Pages,
          as: "Pages",
          required: true,
          include: [
            {
              model: sequelizeServer.models.Products,
              as: "Products",
              required: true,
              include: [
                {
                  model: sequelizeServer.models.User_Products,
                  as: "User_Products",
                  required: true,
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

    return {
      products: products,
      stock: stock,
      group: groups,
      websites: websites,
    };
  } catch (error) {
    throw error;
  }
}

async function getSegmnetsByProductId(id, UserID) {
  try {
    const product = await sequelizeServer?.models?.Segment_Products?.findAll({
      where: {
        ProductID: id,
      },
      include: [
        {
          model: sequelizeServer?.models?.Segments,
          as: "Group",
          where: {
            UserID: UserID,
          },
        },
      ],
    });
    return product;
  } catch (error) {
    throw error;
  }
}

async function recentlyUpdatedProducts(userID) {
  try {
    const products = await sequelizeServer.models.User_Products.findAll({
      where: {
        UserID: userID,
      },
      include: [
        {
          model: sequelizeServer.models.Products,
          as: "Product",
          order: [["UpdatedAt", "DESC"]],
        },
      ],
      limit: 5,
    });
    return products;
  } catch (error) {
    throw error;
  }
}

async function getgroupsofproductbyproductid(id) {
  try {
    const product = await sequelizeServer.models.Segment_Products.findAll({
      where: {
        ProductID: id,
      },
      include: [
        {
          model: sequelizeServer.models.Segments,
          as: "Group",
        },
      ],
    });
    return product;
  } catch (error) {
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
  getCounts,
  getSegmnetsByProductId,
  recentlyUpdatedProducts,
  getgroupsofproductbyproductid,
};
