const express = require("express");
const {
  GetProductsByPage,
  GetProductsByUserId,
  GetCounts,
  GetSegmnetsByProductId,
  DeleteProducts,
  RecentlyUpdatedProducts,
  Getgroupsofproductbyproductid,
  GetProductsHistory,
} = require("../controllers/Products.controller");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.post("/getProductsByPage", GetProductsByPage);
router.post("/getProductsByUserId", isAuthenticated, GetProductsByUserId);
router.get("/getCount", isAuthenticated, GetCounts);
router.post("/getproductSegment", isAuthenticated, GetSegmnetsByProductId);
router.post("/deletProducts", isAuthenticated, DeleteProducts);
router.get(
  "/getRecentlyUpdatedProducts",
  isAuthenticated,
  RecentlyUpdatedProducts
);
router.post(
  "/getgroupsofproductbyproductid",
  isAuthenticated,
  Getgroupsofproductbyproductid
);

router.post("/getProductsHistory", isAuthenticated, GetProductsHistory);

module.exports = router;
