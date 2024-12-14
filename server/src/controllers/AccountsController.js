const Accounts = require("../model/CreateAccountModel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { OtpEmailTemplate, LoginOtpEmailTemplate } = require("../Template/EmailTemplates");
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
                    res.status(200).json({ message: "Account found", user });
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
                res.status(200).json({ message: "Account deleted successfully", currentAccount });
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
        const { currentAccEmail, messages } = req.body;
        const currentAccount = await Accounts.findOne({ email: currentAccEmail });
        if (currentAccount) {
            currentAccount.messages = messages;
            await currentAccount.save();
            const subscription = req.subscription;
            subscription.messagesSent += 1;
            await subscription.save();

            res.status(200).json({ message: "Messages updated successfully", currentAccount });
        } else {
            console.log("Current Account not found");
        }
    } catch (error) {
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
        console.log(req.body);
        if (!from) {
            console.log("Didnt received from");
        }

        if (!to) {
            console.log("Didnt received to");
        }

        const friend = await Accounts.findOne({ _id: from });
        const currentAccount = await Accounts.findOne({ _id: to });
        if (!friend) {
            return res.status(404).json({ message: "Friend not found" });
        }

        if (!currentAccount) {
            return res.status(404).json({ message: "Current Account not found" });
        }
        currentAccount.friendRequestList.push(friend);
        await currentAccount.save();
        res.status(200).json({ message: "Got new friend request" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const AddorRemoveFriendRequest = async (req, res) => {
    try {
        const { CurrentAccId, _id, text } = req.body;
        const CurrentAccount = await Accounts.findOne({ _id: CurrentAccId });
        const User = await Accounts.findOne({ _id });
        console.log(User);
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

module.exports = { CreateAccount, AccountList, LoginAccount, UpdateAccount, FindAccount, removeNewUserList, userAccountMsg, verifyOTP, friendRequestList, AddorRemoveFriendRequest };
