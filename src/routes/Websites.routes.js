const express = require("express");
const { GetAllWebsites, GetWebsitesByUserId } = require("../controllers/Websites.controller");

const router = express.Router();

router.get("/getAllWebsites", GetAllWebsites)
router.post("/getWebsitesByUserId", GetWebsitesByUserId)

module.exports = router;
