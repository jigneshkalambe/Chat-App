const express = require("express");
const router = express();
const multerRoute = require("./MulterRoute");
const checkRoute = require("./Connect");
const accRoute = require("./AccountsRoute");

router.use("/check", checkRoute);
router.use("/profile", multerRoute);
router.use("/account", accRoute);

module.exports = router;
