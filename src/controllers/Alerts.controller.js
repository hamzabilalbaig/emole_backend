const {
  getAlertByUserID,
  deleteAlert,
  readAlert,
  getAlertAndSetRead,
} = require("../services/Alerts.services");

async function GetAlertByUserID(req, res) {
  try {
    const alert = await getAlertByUserID(
      req.user.UserID,
      req.body.page,
      req.body.pageSize,
      req?.body?.filters
    );
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

async function ReadAlert(req, res) {
  try {
    const alert = await readAlert(req.body.ids, req.body.read);
    res.status(200).json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function GetAlertAndSetRead(req, res) {
  try {
    const alert = await getAlertAndSetRead(req.body.id);
    res.status(200).json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  GetAlertByUserID,
  DeleteAlert,
  ReadAlert,
  GetAlertAndSetRead,
};
