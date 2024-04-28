const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const {
  GetAlertByUserID,
  DeleteAlert,
  ReadAlert,
  GetAlertAndSetRead,
  GetLatestAlerts,
  GetLatestPriceAlerts,
  GetLatestStockAlerts,
} = require("../controllers/Alerts.controller");
const router = express.Router();

router.post("/getAlertByUserID", isAuthenticated, GetAlertByUserID);
router.post("/deleteAlert", isAuthenticated, DeleteAlert);
router.post("/readAlert", isAuthenticated, ReadAlert);
router.post("/getAlertAndSetRead", isAuthenticated, GetAlertAndSetRead);
router.get("/getLatestAlerts", isAuthenticated, GetLatestAlerts);
router.get("/getLatestPriceAlerts", isAuthenticated, GetLatestPriceAlerts);
router.get("/getLatestStockAlerts", isAuthenticated, GetLatestStockAlerts);

module.exports = router;
