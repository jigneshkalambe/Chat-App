const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./routes/v1");
const path = require("path");
const app = express();
const { Server } = require("socket.io");
require("dotenv").config();

app.use(cors());

mongoose
    .connect(process.env.MONGOURL)
    .then((res) => {
        console.log("Mongo Db is Connected");
    })
    .catch((err) => console.log(err));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/v1", router);
app.use("/uploads", express.static(path.join(__dirname, "./Images")));

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is Running on ${process.env.PORT}`);
});

const io = new Server(server, {
    cors: {
        // origin: "http://localhost:3000",
        origin: "https://chatly-psi.vercel.app",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
    },
});

app.set("io", io);

const usersInRooms = {};

io.on("connection", (socket) => {
    console.log("Client Connected", socket.id);

    socket.on("typing", ({ senderId, recipientId }) => {
        const recipientSocketId = usersInRooms[recipientId];
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("userTyping", { senderId });
        }
    });

    socket.on("stopTyping", ({ senderId, recipientId }) => {
        const recipientSocketId = usersInRooms[recipientId];
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("userStoppedTyping", { senderId });
        }
    });

    socket.on("register", (userId) => {
        usersInRooms[userId] = socket.id;
        console.log(`User registered: ${userId} -> ${socket.id}`);
        io.emit("onlineUsers", Object.keys(usersInRooms));
    });

    socket.on("privateMessage", ({ toUserId, message, senderId, time, Image, audio, video, docpdf }) => {
        const recipientSocketId = usersInRooms[toUserId];
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("privateMessage", { toUserId, message, senderId, time, Image, audio, video, docpdf });
        } else {
            console.log(`User ${toUserId} not connected`);
            socket.emit("userNotAvailable", { message: "User is offline", senderId });
        }
    });

    socket.on("friend_request", async ({ data }) => {
        console.log(data.to);
        const recipientId = usersInRooms[data.to];
        console.log(recipientId);
        if (recipientId) {
            io.to(recipientId).emit("friend_request", { from: data.from, to: data.to });
        } else {
            console.log(`friend_request Didn't received ${data}`);
            socket.emit("did not able to send request");
        }
    });

    socket.on("editOrDelete", async ({ toUserId }) => {
        console.log(toUserId);
        const recipientId = usersInRooms[toUserId];
        console.log(recipientId);
        if (recipientId) {
            io.to(recipientId).emit("editOrDelete", { toUserId });
        } else {
            console.log(`editOrDelete Didn't received ${toUserId}`);
            socket.emit("did not able to send request");
        }
    });

    socket.on("disconnect", () => {
        for (const [userId, id] of Object.entries(usersInRooms)) {
            if (id === socket.id) {
                delete usersInRooms[userId];
                console.log(`User disconnected: ${userId}`);
                break;
            }
        }
        io.emit("onlineUsers", Object.keys(usersInRooms));
    });
});

module.exports = app;

// app.listen(process.env.PORT, () => {
//     console.log(`Server is Running on ${process.env.PORT}`);
// });
