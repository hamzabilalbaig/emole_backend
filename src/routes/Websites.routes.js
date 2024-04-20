const express = require("express");
const {
  GetAllWebsites,
  GetWebsitesByUserId,
} = require("../controllers/Websites.controller");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.get("/getAllWebsites", GetAllWebsites);
router.get("/getWebsitesByUserId", isAuthenticated, GetWebsitesByUserId);

module.exports = router;
