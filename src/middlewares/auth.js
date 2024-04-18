const crypto = require("crypto");
const { sequelizeServer } = require("../config/sequelize.config");
const jwt = require("jsonwebtoken");
// Must be 256 bits (32 characters)

exports.isAuthenticated = async (req, res, next) => {
  try {
    let token = "";
    // const { token } = req?.header.authorization;

    const authorizationHeader = req.header("Authorization");

    // Check if the Authorization header exists and starts with 'Bearer '
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      // Remove 'Bearer ' prefix and get the token
      token = authorizationHeader.slice(7);
      // Now you have the token value
      console.log(token);
    } else {
      // Handle the case where the Authorization header is missing or does not start with 'Bearer '
      console.error(
        "Authorization header is missing or does not contain a Bearer token"
      );
    }

    if (!token) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    req.user = await sequelizeServer.models.Users.findOne({
      where: {
        UserID: decoded.UserID,
      },
    });

    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
