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

app.use(express.json());
app.use("/v1", router);
app.use("/uploads", express.static(path.join(__dirname, "./Images")));

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is Running on ${process.env.PORT}`);
});

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
    },
});

// const usersInRooms = [];
const usersInRooms = {};

io.on("connection", (socket) => {
    console.log("Client Connected", socket.id);

    // socket.on("join_room", (room) => {
    //     if (room) {
    //         socket.join(room); // Join the specific room based on the user's room (phone number)
    //         usersInRooms[socket.id] = room; // Track which socket is in which room
    //         console.log(`User ${socket.id} joined room: ${room}`);
    //     } else {
    //         console.log(`Room is undefined or empty for socket ${socket.id}`);
    //     }
    // });

    // socket.on("send_msg", (data) => {
    //     const { room, messages, Author, time } = data;
    //     console.log(`Message from ${data.Author}: ${data.messages} to room ${data.room}`);
    //     socket.to(room).emit("receive_msg", {
    //         messages,
    //         Author,
    //         time,
    //     });
    // });

    // socket.on("send_msg", (data) => {
    //     const { room, messages, Author, time } = data;

    //     // Ensure the message is sent to the correct room
    //     if (room && usersInRooms[socket.id] === room) {
    //         console.log(`Message from ${Author} to room ${room}: ${messages}`);
    //         socket.to(room).emit("receive_msg", {
    //             messages,
    //             Author,
    //             time,
    //         });
    //     } else {
    //         console.log(`Message was sent to a different room or socket ${socket.id} is not in room ${room}`);
    //     }
    // });

    socket.on("register", (userId) => {
        usersInRooms[userId] = socket.id;
        console.log(`User registered: ${userId} -> ${socket.id}`);
        io.emit("onlineUsers", Object.keys(usersInRooms));
    });

    socket.on("privateMessage", ({ toUserId, message, senderId, time }) => {
        const recipientSocketId = usersInRooms[toUserId];
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("privateMessage", { toUserId, message, senderId, time });
        } else {
            console.log(`User ${toUserId} not connected`);
            socket.emit("userNotAvailable", { message: "User is offline", senderId });
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

// app.listen(process.env.PORT, () => {
//     console.log(`Server is Running on ${process.env.PORT}`);
// });
