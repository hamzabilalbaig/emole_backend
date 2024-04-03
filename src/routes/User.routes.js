const express = require("express");
const { loginUser, addUser, updateUser, deleteUser } = require("../controllers/Users.controller");
const router = express.Router();

router.post("/loginUser", loginUser);
router.post("/addUser", addUser);
router.put("/updateUser", updateUser);
router.delete("/deleteUser", deleteUser);



module.exports = router;
