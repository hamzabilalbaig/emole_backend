const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const {
  GetAlertByUserID,
  DeleteAlert,
  ReadAlert,
  GetAlertAndSetRead,
} = require("../controllers/Alerts.controller");
const router = express.Router();

router.post("/getAlertByUserID", isAuthenticated, GetAlertByUserID);
router.post("/deleteAlert", isAuthenticated, DeleteAlert);
router.post("/readAlert", isAuthenticated, ReadAlert);
router.post("/getAlertAndSetRead", isAuthenticated, GetAlertAndSetRead);

module.exports = router;
