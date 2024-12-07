const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Accounts",
        required: true,
    },
    planType: {
        type: String,
        enum: ["Basic", "Standard", "Premium"],
        required: true,
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
        required: true,
    },
    messageLimit: {
        type: Number,
        default: null,
    },
    messagesSent: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);
