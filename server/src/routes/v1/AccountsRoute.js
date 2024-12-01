const express = require("express");
const { AccountController } = require("../../controllers");
const router = express.Router();

router.get("/accountList", AccountController.AccountList);
router.post("/createAccount", AccountController.CreateAccount);
router.post("/loginAccount", AccountController.LoginAccount);
router.post("/updateAccount", AccountController.UpdateAccount);
router.post("/findAccount", AccountController.FindAccount);
router.post("/newUserList", AccountController.removeNewUserList);
router.post("/msg", AccountController.userAccountMsg);

module.exports = router;
