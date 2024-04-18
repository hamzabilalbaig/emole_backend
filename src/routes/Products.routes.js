const express = require("express");
const {
  GetProductsByPage,
  GetProductsByUserId,
} = require("../controllers/Products.controller");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.post("/getProductsByPage", GetProductsByPage);
router.post("/getProductsByUserId", isAuthenticated, GetProductsByUserId);

module.exports = router;
