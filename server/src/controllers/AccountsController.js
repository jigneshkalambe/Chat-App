const Accounts = require("../model/CreateAccountModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SubscriptionModel = require("../model/SubscriptionModel");

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
        });
        await User.save();
        res.status(201).json({ message: "Account created successfully", data: User });
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

        res.status(200).json({ message: "You have successfully logged in", currentUser });
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

module.exports = { CreateAccount, AccountList, LoginAccount, UpdateAccount, FindAccount, removeNewUserList, userAccountMsg };
