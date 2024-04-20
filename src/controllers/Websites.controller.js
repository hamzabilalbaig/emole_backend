const {
  getWebsiteByUserId,
  getWebsites,
} = require("../services/Websites.services");

async function GetWebsitesByUserId(req, res, next) {
  try {
    const { id } = req.body;
    const websites = await getWebsiteByUserId(req?.user?.UserID);
    res.status(200).json({
      success: true,
      websites: websites,
      message: "websites fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
      message: "Unexpected error while getting the websites by user id" + error,
    });
  }
}

async function GetAllWebsites(req, res, next) {
  try {
    const websites = await getWebsites();
    res.status(200).json({
      success: true,
      websites: websites,
      message: "websites fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
      message: "Unexpected error while getting the websites " + error,
    });
  }
}

module.exports = {
  GetWebsitesByUserId,
  GetAllWebsites,
};
