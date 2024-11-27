const mongoose = require("mongoose");

const CreateAccountSchema = new mongoose.Schema(
    {
        photoName: {
            type: String,
            required: true,
            trim: true,
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        gender: {
            type: String,
            required: true,
            trim: true,
        },
        age: {
            type: String,
            required: true,
            trim: true,
        },
        number: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            required: false,
            trim: true,
            default: "",
        },
        subtitle: {
            type: String,
            required: false,
            trim: true,
            default: "",
        },
        bio: {
            type: String,
            required: false,
            trim: true,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const Accounts = mongoose.model("Account", CreateAccountSchema);

module.exports = Accounts;
