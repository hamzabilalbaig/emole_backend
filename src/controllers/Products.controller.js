const {
  getProducts,
  getProductById,
  getProductsByPage,
  getProductsByUserID,
  getCounts,
  getSegmnetsByProductId,
  deleteProduct,
  recentlyUpdatedProducts,
} = require("../services/Products.services");

async function GetProducts(req, res, next) {
  try {
    const products = await getProducts();
    res.status(200).json({
      success: true,
      products: products,
      message: "Products fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unexpected error while fetching products" + error,
    });
  }
}

async function GetProductById(req, res, next) {
  try {
    const products = await getProductById(req.body.id);
    res.status(200).json({
      success: true,
      products: products,
      message: "Products fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unexpected error while fetching products" + error,
    });
  }
}

async function GetProductsByPage(req, res, next) {
  try {
    const products = await getProductsByPage(
      req.body.page,
      req.body.pageSize,
      req.body.filters
    );
    res.status(200).json({
      success: true,
      products: products,
      message: "Products fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unexpected error while fetching products" + error,
    });
  }
}

async function GetProductsByUserId(req, res, next) {
  try {
    const products = await getProductsByUserID(
      req.user.UserID,
      req.body.page,
      req.body.pageSize,
      req.body.filters
    );
    res.status(200).json({
      success: true,
      products: products,
      message: "Products fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unexpected error while fetching products" + error,
    });
  }
}

async function GetCounts(req, res) {
  try {
    const counts = await getCounts(req?.user?.UserID);
    res.status(200).json({
      success: true,
      counts: counts,
      message: "Products fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unexpected error while fetching products" + error,
    });
  }
}

async function GetSegmnetsByProductId(req, res) {
  try {
    const product = await getSegmnetsByProductId(
      req?.body?.ProductID,
      req?.user?.UserID
    );
    res.status(200).json({
      success: true,
      segments: product,
      message: "Product fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unexpected error while fetching products" + error,
    });
  }
}

async function DeleteProducts(req, res) {
  try {
    const product = await deleteProduct(req?.body?.ids, req?.user?.UserID);
    res.status(200).json({
      success: true,
      product: product,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unexpected error while deleting product" + error,
    });
  }
}

async function RecentlyUpdatedProducts(req, res) {
  try {
    const products = await recentlyUpdatedProducts(req?.user?.UserID);
    res.status(200).json({
      success: true,
      products: products,
      message: "Products fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unexpected error while fetching products" + error,
    });
  }
}

module.exports = {
  GetProducts,
  GetProductById,
  GetProductsByPage,
  GetProductsByUserId,
  GetCounts,
  GetSegmnetsByProductId,
  DeleteProducts,
  RecentlyUpdatedProducts,
};
