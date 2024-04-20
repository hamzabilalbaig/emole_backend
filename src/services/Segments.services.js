const { sequelizeServer } = require("../config/sequelize.config");
const { Op } = require("sequelize");

async function createSegment(UserID, segment) {
  try {
    let result = segment;
    if (result?.GroupID) {
      result = await sequelizeServer?.models?.Segments.findOne({
        where: {
          GroupID: result?.GroupID,
        },
      });
    } else {
      result = await sequelizeServer.models.Segments.create({
        UserID: UserID,
        GroupName: segment?.GroupName,
        Description: segment?.Description,
      });
    }

    if (segment?.products && segment.products.length > 0) {
      const productIds = segment.products.map((data) => data.productID);
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
            { model: sequelizeServer?.models?.Products, as: "Product" },
          ],
        },
      ],
    });

    return segments.map((segment) => ({
      segment: segment,
      products: segment.products,
    }));
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
