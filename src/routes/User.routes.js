const express = require("express");
const {
  loginUser,
  addUser,
  updateUser,
  deleteUser,
  resetPassword,
  getUserById,
  ForgetPassword,
  subscreibeToPlan,
  GetUserBillingInfo,
  CheckUserSubs,
} = require("../controllers/Users.controller");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

router.post("/loginUser", loginUser);
router.post("/addUser", addUser);
router.post("/updateUser", isAuthenticated, updateUser);
router.delete("/deleteUser", deleteUser);
router?.post("/resetPassword", isAuthenticated, resetPassword);
router?.get("/getUserById", isAuthenticated, getUserById);
router?.post("/forgetPassword", ForgetPassword);
router?.post("/subscribeToPlan", isAuthenticated, subscreibeToPlan);
router?.get("/getUserBillingInfo", isAuthenticated, GetUserBillingInfo);
router?.get("/checkUserSubs", isAuthenticated, CheckUserSubs);

module.exports = router;
