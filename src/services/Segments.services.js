const { sequelizeServer } = require("../config/sequelize.config");
const { Op } = require("sequelize");

async function createSegment(UserID, segment) {
  try {
    let result = [];
    if (segment?.GroupID?.length > 0) {
      for (const GropID of segment?.GroupID) {
        let r = await sequelizeServer?.models?.Segments.findOne({
          where: {
            GroupID: GropID,
          },
        });

        result?.push(r);
      }
    } else {
      result = await sequelizeServer.models.Segments.create({
        UserID: UserID,
        GroupName: segment?.GroupName,
        Description: segment?.Description,
      });
    }

    if (result?.length > 0) {
      for (const res of result) {
        if (segment?.products && segment.products.length > 0) {
          const productIds = segment.products.map((data) => data.ProductID);
          for (const productId of productIds) {
            const existingEntry =
              await sequelizeServer.models.Segment_Products.findOne({
                where: {
                  GroupID: res?.GroupID,
                  ProductID: productId,
                },
              });
            if (!existingEntry) {
              await sequelizeServer?.models?.Segment_Products?.create({
                GroupID: res?.GroupID,
                ProductID: productId,
              });
            }
          }
        }
      }
    } else {
      if (segment?.products && segment.products.length > 0) {
        const productIds = segment.products.map((data) => data.ProductID);
        for (const productId of productIds) {
          const existingEntry =
            await sequelizeServer.models.Segment_Products.findOne({
              where: {
                GroupID: result?.GroupID,
                ProductID: productId,
              },
            });
          if (!existingEntry) {
            await sequelizeServer?.models?.Segment_Products?.create({
              GroupID: result?.GroupID,
              ProductID: productId,
            });
          }
        }
      }
    }

    return {
      message: "segment created",
      segment: result,
    };
  } catch (error) {
    return error;
  }
}

async function getSegmentsByUserId(UserID) {
  try {
    const segments = await sequelizeServer.models.Segments.findAll({
      where: {
        UserID: UserID,
      },
      include: [
        {
          model: sequelizeServer.models.Segment_Products,
          as: "Segment_Products",
          include: [
            {
              model: sequelizeServer?.models?.Products,
              as: "Product",
              include: [
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

    // const segments2 = await sequelizeServer.models.Segments.findAll({
    //   where: {
    //     UserID: UserID,
    //   },
    //   include: [
    //     {
    //       model: sequelizeServer.models.Segment_Products,
    //       as: "Segment_Products",
    //       include: [
    //         {
    //           model: sequelizeServer?.models?.Products,
    //           as: "Product",
    //           where: {
    //             StockStatus: false,
    //           },
    //         },
    //       ],
    //     },
    //   ],
    // });

    // const segments3 = await sequelizeServer.models.Segments.count({
    //   where: {
    //     UserID: UserID,
    //   },
    //   distinct: true,
    //   include: [
    //     {
    //       distinct: true,
    //       model: sequelizeServer.models.Segment_Products,
    //       as: "Segment_Products",
    //       include: [
    //         {
    //           distinct: true,
    //           model: sequelizeServer?.models?.Products,
    //           as: "Product",
    //           include: [
    //             {
    //               distinct: true,
    //               model: sequelizeServer?.models?.alerts,
    //               as: "alerts",
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    // });

    // const outOfStockProductsResult = segments2.map(
    //   (seg) => seg?.Segment_Products
    // );

    // const countofalerts = segments3;

    const result = segments.map((segment) => ({
      segment: segment,
      products: segment?.Segment_Products?.map((product) => product?.Product),
      outOfStockProducts: segment?.Segment_Products?.filter(
        (product) => product?.Product?.StockStatus !== false
      ).length,
      countOfTotalProductsAlerts: segment?.Segment_Products?.reduce(
        (acc, product) => acc + product?.Product?.alerts?.length,
        0
      ),
    }));

    return result;
  } catch (error) {
    throw error;
  }
}

async function getProductsBySegmentId(segId) {
  try {
    const products = await sequelizeServer.models.Products.findAll({
      include: [
        {
          model: sequelizeServer.models.Segment_Products,
          as: "Segment_Products",
          where: { GroupID: segId },
          required: true, // This ensures that only products associated with the segment are returned
          attributes: [], // Exclude attributes from the join table
        },
      ],
    });

    return products;
  } catch (error) {
    throw error;
  }
}

async function deleteSegment(segID) {
  try {
    const segprod = await sequelizeServer?.models?.Segment_Products?.destroy({
      where: {
        GroupID: segID,
      },
    });
    const segment = await sequelizeServer?.models?.Segments?.destroy({
      where: {
        GroupID: segID,
      },
    });

    return segment;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createSegment,
  getSegmentsByUserId,
  getProductsBySegmentId,
  deleteSegment,
};
