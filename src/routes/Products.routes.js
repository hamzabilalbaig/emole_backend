const express = require("express");
const {
  GetProductsByPage,
  GetProductsByUserId,
  GetCounts,
  GetSegmnetsByProductId,
} = require("../controllers/Products.controller");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.post("/getProductsByPage", GetProductsByPage);
router.post("/getProductsByUserId", isAuthenticated, GetProductsByUserId);
router.get("/getCount", isAuthenticated, GetCounts);
router.post("/getproductSegment", isAuthenticated, GetSegmnetsByProductId);

module.exports = router;
