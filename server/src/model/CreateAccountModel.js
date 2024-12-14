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
    },
    audio: {
        type: String,
        required: false,
    },
    video: {
        type: String,
        required: false,
    },
    docpdf: {
        type: String,
        required: false,
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

const newFriendRequest = new mongoose.Schema({
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
    isFriend: {
        type: Boolean,
        required: false,
        default: false,
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
        paymentSuccessfully: {
            type: Boolean,
            default: false,
        },
        verified: {
            type: Boolean,
            required: false,
            default: false,
        },
        verificationCode: {
            type: Number,
            required: false,
        },
        friendRequestList: [newFriendRequest],
    },
    {
        timestamps: true,
    }
);

const Accounts = mongoose.model("Account", CreateAccountSchema);

module.exports = Accounts;
