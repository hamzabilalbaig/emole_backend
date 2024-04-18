const express = require("express");
const {
  loginUser,
  addUser,
  updateUser,
  deleteUser,
  resetPassword,
  getUserById,
} = require("../controllers/Users.controller");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

router.post("/loginUser", loginUser);
router.post("/addUser", addUser);
router.put("/updateUser", updateUser);
router.delete("/deleteUser", deleteUser);
router?.post("/resetPassword", isAuthenticated, resetPassword);
router?.get("/getUserById", isAuthenticated, getUserById);

module.exports = router;
