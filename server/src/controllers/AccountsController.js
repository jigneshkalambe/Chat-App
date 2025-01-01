const Accounts = require("../model/CreateAccountModel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { OtpEmailTemplate, LoginOtpEmailTemplate } = require("../Template/EmailTemplates");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

const CreateAccount = async (req, res) => {
    try {
        const { photoName, firstName, lastName, email, password, gender, age, number } = req.body;

        if (firstName && lastName && email && password && gender && age && number && photoName === "") {
            return res.status(400).json({ message: "Please upload a profile picture" });
        }

        if (!photoName || !firstName || !lastName || !email || !password || !gender || !age || !number) {
            return res.status(400).json({ message: "Please fill out all the fields correctly." });
        }

        const exitsEmail = await Accounts.findOne({ email });
        if (exitsEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS,
            },
        });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const htmlTemplate = OtpEmailTemplate.replace("{otp}", otp).replace("{firstName}", firstName);
        const mail_sent = transport
            .sendMail({
                from: process.env.NODEMAILER_USER,
                to: email,
                subject: "Your One-Time Password (OTP)",
                html: htmlTemplate,
            })
            .then(() => {
                console.log("Email Sent Successfully!");
            })
            .catch((error) => {
                throw new Error("Failed to send email:", error);
            });

        const hashedPassword = await bcrypt.hash(password, 10);
        const User = new Accounts({
            photoName,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            gender,
            age,
            number,
            verificationCode: otp,
        });
        await User.save();

        res.status(201).json({ message: "Account created successfully. Please verify your email address using the OTP sent to your email.", data: User });
    } catch (errors) {
        return res.status(500).json({ errors: errors });
    }
};

const AccountList = async (req, res) => {
    try {
        const accounts = await Accounts.find();
        res.status(200).json({ accounts });
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
};

const LoginAccount = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === "" || password === "") {
            throw new Error("Please fill out all the fields correctly.");
        }

        const currentUser = await Accounts.findOne({ email });

        if (!currentUser) {
            throw new Error("We couldn't find an account with that email");
        }

        const isValidPassword = await bcrypt.compare(password, currentUser.password);
        if (!isValidPassword) {
            throw new Error("The email or password you entered is incorrect");
        }

        if (!currentUser.verified) {
            const transport = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                auth: {
                    user: process.env.NODEMAILER_USER,
                    pass: process.env.NODEMAILER_PASS,
                },
            });

            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            const htmlTemplate = LoginOtpEmailTemplate.replace("{otp}", otp).replace("{firstName}", currentUser.firstName);
            const mail_sent = transport
                .sendMail({
                    from: process.env.NODEMAILER_USER,
                    to: email,
                    subject: "Your One-Time Password (OTP)",
                    html: htmlTemplate,
                })
                .then(() => {
                    console.log("Email Sent Successfully!");
                })
                .catch((error) => {
                    console.log(error);
                    throw new Error("Failed to send email:", error);
                });

            currentUser.verificationCode = otp;
            await currentUser.save();
            res.status(400).json({
                message: "Your email is not verified. Please check your inbox for the OTP or contact support if you didn't receive it.",
                verified: false,
                currentUser,
            });
        } else {
            res.status(200).json({ message: "You have successfully logged in", currentUser });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const UpdateAccount = async (req, res) => {
    try {
        const { photoName, firstName, lastName, email, number, age, gender, location, bio, subtitle } = req.body;

        const currentUser = await Accounts.findOne({ email });

        if (!currentUser) {
            throw new Error("We couldn't find an account with that email");
        }

        if (photoName) currentUser.photoName = photoName;
        if (firstName) currentUser.firstName = firstName;
        if (lastName) currentUser.lastName = lastName;
        if (email) currentUser.email = email;
        if (number) currentUser.number = number;
        if (age) currentUser.age = age;
        if (gender) currentUser.gender = gender;
        if (location) currentUser.location = location;
        if (bio) currentUser.bio = bio;
        if (subtitle) currentUser.subtitle = subtitle;

        await currentUser.save();

        await Accounts.updateMany(
            { "newUserLists.email": email },
            {
                $set: {
                    "newUserLists.$.photoName": photoName,
                    "newUserLists.$.firstName": firstName,
                    "newUserLists.$.lastName": lastName,
                    "newUserLists.$.number": number,
                    "newUserLists.$.age": age,
                    "newUserLists.$.gender": gender,
                    "newUserLists.$.location": location,
                    "newUserLists.$.bio": bio,
                    "newUserLists.$.subtitle": subtitle,
                },
            }
        );

        const io = req.app.get("io");
        io.emit("userUpdated", currentUser);

        res.status(200).json({ message: "Your account has been updated successfully", data: currentUser });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const FindAccount = async (req, res) => {
    try {
        const { currentAccEmail, email, number } = req.body;
        const user = await Accounts.findOne({ email });
        if (user.email === email && user.number === number) {
            const currentAccount = await Accounts.findOne({ email: currentAccEmail });
            if (currentAccount) {
                const currentAccountNewUser = currentAccount.newUserLists.some((user) => {
                    return user.email === email && user.number === number;
                });
                if (currentAccountNewUser) {
                    res.status(404).json({ message: "User Already Exits" });
                    return;
                } else {
                    currentAccount.newUserLists.push(user);
                    await currentAccount.save();
                    res.status(200).json({ message: "User successfully added to your account.", user });
                }
            } else {
                console.log("Current account not found");
            }
        } else {
            res.status(404).json({ message: "Account not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const removeNewUserList = async (req, res) => {
    try {
        const { currentAccEmail, userData } = req.body;
        const currentAccount = await Accounts.findOne({ email: currentAccEmail });
        if (currentAccount) {
            const userList = currentAccount.newUserLists.find((user) => user.email === userData.email);
            if (userList) {
                currentAccount.newUserLists = currentAccount.newUserLists.filter((user) => user.email !== userData.email);
                currentAccount.friendRequestList = currentAccount.friendRequestList.filter((user) => user.email !== userData.email);
                await currentAccount.save();
                res.status(200).json({ message: "Account removed successfully", currentAccount });
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } else {
            res.status(404).json({ message: "Account not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const userAccountMsg = async (req, res) => {
    try {
        const { currentAccEmail, messages, onlineUsers, selectedUser } = req.body;
        if (!selectedUser || !selectedUser._id || !mongoose.isValidObjectId(selectedUser._id)) {
            return res.status(400).json({ message: "Invalid selected user ID" });
        }
        const currentAccount = await Accounts.findOne({ email: currentAccEmail });
        if (!currentAccount) {
            return res.status(404).json({ message: "Current account not found" });
        }

        const receiverUser = await Accounts.findOne({ _id: selectedUser._id });
        if (!receiverUser) {
            return res.status(404).json({ message: "Receiver account not found" });
        }

        const isUserOnline = onlineUsers.findIndex((id) => id === selectedUser._id);
        const senderId = currentAccount._id.toString();
        const receiverId = receiverUser._id.toString();

        const msgs = messages[receiverId];
        if (!msgs || msgs.length === 0) {
            return res.status(400).json({ message: "No messages to send" });
        }

        const formattedMsgs = msgs.map((msg) => ({
            ...msg,
            Author: msg.Author === "me" ? senderId : "me",
        }));

        if (isUserOnline === -1) {
            // console.log("receiverUser is offline, storing messages for later retrieval");
            currentAccount.messages = messages;
            await currentAccount.save();
            const subscription = req.subscription;
            subscription.messagesSent += 1;
            await subscription.save();
            const receiverMessages = receiverUser.messages.get(senderId) || [];
            receiverUser.messages.set(senderId, [...receiverMessages, ...formattedMsgs]);
            const newUserPending = receiverUser.newUserLists.find((user) => user.email === currentAccount.email);
            newUserPending.pendingMsgCount += 1;
            await receiverUser.save();
        } else {
            currentAccount.messages = messages;
            await currentAccount.save();
            const subscription = req.subscription;
            subscription.messagesSent += 1;
            await subscription.save();
            const newUserPending = receiverUser.newUserLists.find((user) => user.email === currentAccount.email);
            newUserPending.pendingMsgCount += 1;
            await receiverUser.save();
        }

        res.status(200).json({ message: "Messages processed successfully", currentAccount });
    } catch (error) {
        console.log("Error processing messages:", error);
        return res.status(500).json({ message: error.message });
    }
};

const receiverUserMsg = async (req, res) => {
    try {
        const { currentAccEmail, messages } = req.body;
        const currentAccount = await Accounts.findOne({ email: currentAccEmail });
        if (!currentAccount) {
            return res.status(404).json({ message: "Current account not found" });
        }
        currentAccount.messages = messages;
        await currentAccount.save();
        res.status(200).json({ message: "Messages processed successfully", currentAccount });
    } catch (error) {
        console.log("Error processing receiver user messages:", error);
        return res.status(500).json({ message: error.message });
    }
};

const emptyPendingMsgCount = async (req, res) => {
    try {
        const { currentAccEmail, newUserEmail } = req.body;
        if (!currentAccEmail) {
            console.log("Current account email is required");
        }

        if (!newUserEmail) {
            console.log("New user email is required");
        }

        const currentAccount = await Accounts.findOne({ email: currentAccEmail });
        if (!currentAccount) {
            console.log("Current account not found");
        }

        const selectedUser = currentAccount.newUserLists.find((user) => user.email === newUserEmail);
        if (!selectedUser) {
            console.log("User not found in current account's new user list");
        } else {
            selectedUser.pendingMsgCount = 0;
            await currentAccount.save();
        }
        res.status(200).json({ message: "Pending message count reset successfully" });
    } catch (error) {
        console.log("Error emptying pending message count:", error);
        return res.status(500).json({ message: error.message });
    }
};

const resetReceiverUserPendingMsg = async (req, res) => {
    try {
        const { currentAccEmail, newUserEmail } = req.body;
        const ReceiverUser = await Accounts.findOne({ email: newUserEmail });
        if (!ReceiverUser) {
            throw new Error("Receiver user not found");
        }
        // console.log("resetReceiverUserPendingMsg", ReceiverUser);
        const CurrentAccInReceiverUser = ReceiverUser.newUserLists.find((user) => user.email === currentAccEmail);
        if (!CurrentAccInReceiverUser) {
            throw new Error("Current account not found in receiver user's new user list");
        }
        // console.log("CurrentAccInReceiverUser", CurrentAccInReceiverUser);
        CurrentAccInReceiverUser.pendingMsgCount = 0;
        await ReceiverUser.save();
        res.status(200).json({ message: "Receiver user pending message count reset successfully", CurrentAccInReceiverUser });
    } catch (error) {
        console.log("Error resetting receiver user pending message:", error);
        return res.status(500).json({ message: error.message });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        const currentUser = await Accounts.findOne({ verificationCode: Number(otp) });
        if (!currentUser) {
            return res.status(404).json({ message: "OTP is invalid" });
        }
        if (currentUser.verificationCode !== Number(otp)) {
            throw new Error("OTP is invalid");
        } else {
            currentUser.verified = true;
            currentUser.verificationCode = undefined;
            await currentUser.save();
        }
        res.status(200).json({ message: "OTP verified successfully!", currentUser });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const friendRequestList = async (req, res) => {
    try {
        const { from, to } = req.body;
        // console.log(req.body);
        if (!from) {
            console.log("Didn't received from");
        }

        if (!to) {
            console.log("Didn't received to");
        }

        const friend = await Accounts.findOne({ _id: from });
        const currentAccount = await Accounts.findOne({ _id: to });
        if (!friend) {
            return res.status(404).json({ message: "Friend not found" });
        }

        if (!currentAccount) {
            return res.status(404).json({ message: "Current Account not found" });
        }

        const isFriend = currentAccount.friendRequestList.some((user) => {
            return user.email === friend.email;
        });

        if (isFriend) {
            return;
        } else {
            currentAccount.friendRequestList.push(friend);
            await currentAccount.save();
        }

        res.status(200).json({ message: "You have a new friend request." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const AddorRemoveFriendRequest = async (req, res) => {
    try {
        const { CurrentAccId, _id, text } = req.body;
        const CurrentAccount = await Accounts.findOne({ _id: CurrentAccId });
        const User = await Accounts.findOne({ _id });
        // console.log(User);
        if (text === "Accept") {
            CurrentAccount.newUserLists.push(User);
            const Friend = CurrentAccount.friendRequestList.find((user) => user.email === User.email);
            Friend.isFriend = true;
            await CurrentAccount.save();
            res.status(200).json({ message: "You have accepted request", CurrentAccount });
        } else if ("Reject") {
            const Friend = CurrentAccount.friendRequestList.find((user) => user.email === User.email);
            Friend.isFriend = false;
            CurrentAccount.friendRequestList = CurrentAccount.friendRequestList.filter((users) => users.email !== User.email);
            await CurrentAccount.save();
            res.status(400).json({ message: "You have rejected request", CurrentAccount });
        } else {
            console.log("Invalid Request");
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteMsgForMeHandler = async (req, res) => {
    try {
        const { currentAccEmail, selectedUserId, selectedMsg, deleteText } = req.body;

        if (!currentAccEmail) {
            throw new Error("Didn't receive currentEmail");
        }
        if (!selectedUserId) {
            throw new Error("Didn't receive selectedUserId");
        }
        if (!selectedMsg) {
            throw new Error("Didn't receive selectedMsg");
        }
        if (!deleteText) {
            throw new Error("Didn't receive deleteText");
        }

        const CurrentAccount = await Accounts.findOne({ email: currentAccEmail });
        if (!CurrentAccount) {
            throw new Error("Account not found");
        }

        const currentChat = CurrentAccount.messages.get(selectedUserId);
        if (!currentChat) {
            throw new Error("Chat not found");
        }

        const Msg = currentChat.find((chats) => chats.messages === selectedMsg.messages && chats.time === selectedMsg.time);
        if (!Msg) {
            throw new Error("Message not found");
        }

        if (deleteText === "for_me") {
            currentChat.splice(currentChat.indexOf(Msg), 1);
            await CurrentAccount.save();
            return res.status(200).json({ message: "Message deleted for you" });
        } else {
            const ReceiverAccount = await Accounts.findOne({ _id: selectedUserId });
            if (!ReceiverAccount) {
                throw new Error("Receiver Account not found");
            }

            const receiverChat = ReceiverAccount.messages.get(CurrentAccount._id);

            if (receiverChat) {
                const ReceiverMsg = receiverChat.find((chats) => chats.messages === selectedMsg.messages && chats.time === selectedMsg.time);
                if (ReceiverMsg) {
                    receiverChat.splice(receiverChat.indexOf(ReceiverMsg), 1);
                    await ReceiverAccount.save();
                } else {
                    console.log("ReceiverMsg not found or already deleted");
                }
            }

            currentChat.splice(currentChat.indexOf(Msg), 1);
            await CurrentAccount.save();

            return res.status(200).json({ message: "Message deleted for both" });
        }
    } catch (error) {
        console.log("deleteMsgForMeHandler", error);
        return res.status(500).json({ message: error.message });
    }
};

const EditMsgHandler = async (req, res) => {
    try {
        const { currentAccEmail, selectedUserId, selectedMsg, editMsg } = req.body;
        if ((!currentAccEmail, !selectedMsg, !selectedUserId, !editMsg)) {
            return res.status(400).json({ message: "Missing Important Properties" });
        }
        const CurrentAccount = await Accounts.findOne({ email: currentAccEmail });
        const ReceiverAccount = await Accounts.findOne({ _id: selectedUserId });

        if (!CurrentAccount) {
            throw new Error("Account not found");
        }

        if (!ReceiverAccount) {
            throw new Error("Receiver Account not found");
        }

        const currentChat = CurrentAccount.messages.get(selectedUserId);
        if (!currentChat) {
            throw new Error("Chat not found");
        }

        const Msg = currentChat.find((chats) => chats.messages === selectedMsg.messages && chats.time === selectedMsg.time);
        if (!Msg) {
            throw new Error("Message not found");
        }

        const receiverChat = ReceiverAccount.messages.get(CurrentAccount._id);
        if (!receiverChat) {
            throw new Error("Receiver Chat not found");
        }

        const ReceiverMsg = receiverChat.find((chats) => chats.messages === selectedMsg.messages && chats.time === selectedMsg.time);
        if (!ReceiverMsg) {
            throw new Error("Receiver Message not found", ReceiverMsg);
        }

        Msg.messages = editMsg;
        ReceiverMsg.messages = editMsg;

        await CurrentAccount.save();
        await ReceiverAccount.save();

        return res.status(200).json({ message: "Message Edited Successfully" });
    } catch (error) {
        console.log("EditMsgHandler", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    CreateAccount,
    AccountList,
    LoginAccount,
    UpdateAccount,
    FindAccount,
    removeNewUserList,
    userAccountMsg,
    verifyOTP,
    friendRequestList,
    AddorRemoveFriendRequest,
    emptyPendingMsgCount,
    receiverUserMsg,
    resetReceiverUserPendingMsg,
    deleteMsgForMeHandler,
    EditMsgHandler,
};
