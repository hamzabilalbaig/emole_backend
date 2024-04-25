const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const {
  GetAlertByUserID,
  DeleteAlert,
} = require("../controllers/Alerts.controller");
const router = express.Router();

router.get("/getAlertByUserID", isAuthenticated, GetAlertByUserID);
router.post("/deleteAlert", isAuthenticated, DeleteAlert);

module.exports = router;
