const {
  createSegment,
  getSegmentsByUserId,
  getProductsBySegmentId,
  deleteSegment,
} = require("../services/Segments.services");

async function addSegment(req, res, next) {
  try {
    const segment = await createSegment(req.user.UserID, req?.body?.segment);
    res.status(200).json({
      success: true,
      segment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error" + error,
    });
  }
}

async function GetSegmentsByUserId(req, res) {
  try {
    const segments = await getSegmentsByUserId(req?.user?.UserID);
    res.status(200).json({
      success: true,
      segments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error" + error,
    });
  }
}

async function GetProductsBySegmentId(req, res) {
  try {
    const Products = await getProductsBySegmentId(req?.body?.GroupID);
    res.status(200).json({
      success: true,
      Products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error" + error,
    });
  }
}

async function DeleteSegment(req, res) {
  try {
    const del = await deleteSegment(req?.body?.GroupID);
    res.status(200).json({
      success: true,
      del,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error" + error,
    });
  }
}
module.exports = {
  addSegment,
  GetSegmentsByUserId,
  GetProductsBySegmentId,
  DeleteSegment,
};
