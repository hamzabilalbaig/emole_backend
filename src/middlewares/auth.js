const crypto = require("crypto");
const { sequelizeServer } = require("../config/sequelize.config");
const jwt = require("jsonwebtoken");
// Must be 256 bits (32 characters)

exports.isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req?.cookies;

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
