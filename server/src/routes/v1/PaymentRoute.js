const express = require("express");
const { PaymentController } = require("../../controllers");
const router = express.Router();

router.post("/payment", PaymentController.Payment);
router.post("/verify", PaymentController.paymentVerify);
router.post("/isPayment", PaymentController.isPaymentSuccessful);

module.exports = router;
