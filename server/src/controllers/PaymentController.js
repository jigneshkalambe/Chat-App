const crypto = require("crypto");
const { Cashfree } = require("cashfree-pg");
const Accounts = require("../model/CreateAccountModel");
const SubscriptionModel = require("../model/SubscriptionModel");
require("dotenv").config();

Cashfree.XClientId = process.env.CLIENT_ID;
Cashfree.XClientSecret = process.env.CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

function generateOrderId() {
    const uniqueId = crypto.randomBytes(16).toString("hex");
    const hash = crypto.createHash("sha256");
    hash.update(uniqueId);

    const orderId = hash.digest("hex");
    return orderId.substr(0, 12);
}

const Payment = async (req, res) => {
    try {
        const amount = req.body.amount;
        let request = {
            order_amount: amount,
            order_currency: "INR",
            order_id: await generateOrderId(),
            customer_details: {
                customer_id: "node_sdk_test",
                customer_name: "",
                customer_email: "example@gmail.com",
                customer_phone: "9999999999",
            },
        };

        Cashfree.PGCreateOrder("2023-08-01", request)
            .then((response) => {
                // console.log(response);
                res.json(response.data);
            })
            .catch((err) => {
                console.log(err.response.data.message);
            });
    } catch (error) {
        console.error(error);
    }
};

const paymentVerify = async (req, res) => {
    try {
        const { orderId } = req.body;
        Cashfree.PGOrderFetchPayments("2023-08-01", orderId).then((response) => {
            res.json(response.data);
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

const isPaymentSuccessful = async (req, res) => {
    try {
        const { paymentSuccessfully, currentAccEmail, amount } = req.body;
        // console.log("req.body", req.body);
        if (!paymentSuccessfully) {
            throw new Error("Payment is unsuccessful");
        }

        const currentUser = await Accounts.findOne({ email: currentAccEmail });

        if (currentUser) {
            currentUser.paymentSuccessfully = paymentSuccessfully;
            await currentUser.save();
        } else {
            console.log("Current user not found");
            throw new Error("Current user not found");
        }

        let planType, duration, messageLimit;
        if (amount === "50") {
            planType = "Basic";
            duration = 30;
            messageLimit = 5000;
        } else if (amount === "100") {
            planType = "Standard";
            duration = 60;
            messageLimit = 10000;
        } else if (amount === "150") {
            planType = "Premium";
            duration = 90;
            messageLimit = null;
        } else {
            throw new Error("Invalid payment amount");
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + duration);

        const existingSubscription = await SubscriptionModel.findOne({ userId: currentUser._id });
        if (existingSubscription) {
            existingSubscription.planType = planType;
            existingSubscription.startDate = startDate;
            existingSubscription.endDate = endDate;
            existingSubscription.messageLimit = messageLimit;
            existingSubscription.messagesSent = 0;
            await existingSubscription.save();
        } else {
            await SubscriptionModel.create({
                userId: currentUser._id,
                planType,
                startDate,
                endDate,
                messageLimit,
            });
        }

        res.status(200).json({ message: "Payment is successful", currentUser, subscription: existingSubscription });
    } catch (error) {
        res.status(500).json({ messages: error.message });
    }
};

module.exports = { Payment, paymentVerify, isPaymentSuccessful };
