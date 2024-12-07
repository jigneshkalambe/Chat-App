const Subscription = require("../model/SubscriptionModel");

const enforceSubscriptionLimits = async (req, res, next) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const subscription = await Subscription.findOne({ userId });

        if (!subscription) {
            return res.status(403).json({ message: "No active subscription" });
        }

        const now = new Date();
        if (now > new Date(subscription.endDate)) {
            return res.status(403).json({ message: "Subscription has expired" });
        }

        if (subscription.messageLimit !== null && subscription.messagesSent >= subscription.messageLimit) {
            return res.status(403).json({ message: "Message limit exceeded" });
        }

        req.subscription = subscription;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = enforceSubscriptionLimits;
