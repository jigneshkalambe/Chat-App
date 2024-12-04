const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    Author: {
        type: String,
        required: true,
        trim: true,
    },
    messages: {
        type: String,
        required: false,
        trim: true,
    },
    time: {
        type: String,
        required: true,
        trim: true,
    },
    Image: {
        type: String,
        required: false,
        // trim: true,
    },
    audio: {
        type: String,
        required: false,
        // trim: true,
    },
    video: {
        type: String,
        required: false,
        // trim: true,
    },
});

const newUserListsSchema = new mongoose.Schema({
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
});

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
        newUserLists: [newUserListsSchema],
        messages: {
            type: Map,
            of: [messageSchema],
        },
    },
    {
        timestamps: true,
    }
);

const Accounts = mongoose.model("Account", CreateAccountSchema);

module.exports = Accounts;
