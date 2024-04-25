const {
  getAlertByUserID,
  deleteAlert,
} = require("../services/Alerts.services");

async function GetAlertByUserID(req, res) {
  try {
    const alert = await getAlertByUserID(req.user.UserID);
    res.status(200).json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function DeleteAlert(req, res) {
  try {
    const alert = await deleteAlert(req.body.id);
    res.status(200).json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  GetAlertByUserID,
  DeleteAlert,
};
