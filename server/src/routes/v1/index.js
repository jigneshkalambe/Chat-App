const express = require("express");
const router = express();
const multerRoute = require("./MulterRoute");
const checkRoute = require("./Connect");
const accRoute = require("./AccountsRoute");
const paymentRoute = require("./PaymentRoute");
const planRoute = require("./SubscriptionRoute");

router.use("/check", checkRoute);
router.use("/profile", multerRoute);
router.use("/account", accRoute);
router.use("/chatService", paymentRoute);
router.use("/plan", planRoute);

module.exports = router;
