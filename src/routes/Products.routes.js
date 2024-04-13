const express = require("express");
const { GetProductsByPage } = require("../controllers/Products.controller");

const router = express.Router();

router.post("/getProductsByPage", GetProductsByPage)



module.exports = router;