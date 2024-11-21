const express = require("express");
const { AccountController } = require("../../controllers");
const router = express.Router();

router.get("/accountList", AccountController.AccountList);
router.post("/createAccount", AccountController.CreateAccount);
router.post("/loginAccount", AccountController.LoginAccount);

module.exports = router;
