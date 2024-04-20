const express = require("express");

const {
  addSegment,

  GetSegmentsByUserId,
  GetProductsBySegmentId,
  DeleteSegment,
} = require("../controllers/Segments.controller");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router?.post("/addSegment", isAuthenticated, addSegment);
router?.post(
  "/getProductsBySegmentId",
  isAuthenticated,
  GetProductsBySegmentId
);
router?.get("/getSegmentsByUserId", isAuthenticated, GetSegmentsByUserId);
router?.post("/deleteSegment", isAuthenticated, DeleteSegment);

module.exports = router;
