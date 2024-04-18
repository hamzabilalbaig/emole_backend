const express = require("express");
const { GetPlans } = require("../controllers/Plans.controller");

const router = express.Router();

router?.get("/getPlans", GetPlans);

module.exports = router;
