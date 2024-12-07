const express = require("express");
const Accounts = require("../../model/CreateAccountModel");
const SubscriptionModel = require("../../model/SubscriptionModel");
const router = express.Router();

router.get("/subscription/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const user = await Accounts.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const subscription = await SubscriptionModel.findOne({ userId: user._id });
        if (!subscription) {
            return res.status(404).json({ message: "No active subscription" });
        }

        const now = new Date();
        const isExpired = now > new Date(subscription.endDate);

        res.status(200).json({ isExpired, subscription });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
