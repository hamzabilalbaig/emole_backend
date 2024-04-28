const {
  getWebsiteByUserId,
  getWebsites,
  getProductByWebsiteId,
  getProductsCountByWebsiteId,
  editWebsiteName,
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

async function GetProductByWebsiteId(req, res, next) {
  try {
    const { id } = req.body;
    const products = await getProductByWebsiteId(id, req?.user?.UserID);
    res.status(200).json({
      success: true,
      products: products,
      message: "products fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
      message: "Unexpected error while getting the websites by user id" + error,
    });
  }
}

async function GetProductsCountByWebsiteId(req, res, next) {
  try {
    const { id } = req.body;
    const products = await getProductsCountByWebsiteId(id, req?.user?.UserID);
    res.status(200).json({
      success: true,
      products: products,
      message: "products fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
      message: "Unexpected error while getting the websites by user id" + error,
    });
  }
}

async function EditWebsiteName(req, res, next) {
  try {
    const { id, name } = req.body;
    const website = await editWebsiteName(id, name);
    res.status(200).json({
      success: true,
      website: website,
      message: "website name edited successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
      message: "Unexpected error while editing the website name" + error,
    });
  }
}

module.exports = {
  GetWebsitesByUserId,
  GetAllWebsites,
  GetProductByWebsiteId,
  GetProductsCountByWebsiteId,
  EditWebsiteName,
};
