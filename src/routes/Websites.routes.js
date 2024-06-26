const express = require("express");
const {
  GetAllWebsites,
  GetWebsitesByUserId,
  GetProductsCountByWebsiteId,
  GetProductByWebsiteId,
  EditWebsiteName,
} = require("../controllers/Websites.controller");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.get("/getAllWebsites", GetAllWebsites);
router.get("/getWebsitesByUserId", isAuthenticated, GetWebsitesByUserId);
router.post(
  "/getProductsCountByWebsiteId",
  isAuthenticated,
  GetProductsCountByWebsiteId
);
router.post("/getProductByWebsiteId", isAuthenticated, GetProductByWebsiteId);
router.post("/editWebsiteName", isAuthenticated, EditWebsiteName);

module.exports = router;
