const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
require("dotenv").config();
const io = socket(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "https://webrtc-test-17-aug.netlify.app",
        ],
        methods: ["GET", "POST"],
    },
});

const PORT = process.env.PORT || 5000;

const users = {};
let rooms = {};
const maxParticipantsAllowed = 10;
const socketToRoom = {};

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.emit("me", socket.id);

    socket.on("create_room", (room) => {
        console.log("room :", room);
        if (rooms[room.id]) {
            console.log("room exit", rooms[room.id]);
        } else {
            rooms[room.id] = room;
        }
        socket.broadcast.emit("rooms", rooms);
        console.log("all rooms : ", rooms);
    });

    socket.emit("rooms", rooms);
    socket.broadcast.emit("rooms", rooms);

    socket.on("delete_room", (room) => {
        console.log("org rooms: ", rooms);
        delete rooms[room];
        console.log("remain rooms: ", rooms);
        socket.emit("rooms", rooms);
    });

    socket.on("join room", (roomID) => {
        console.log(
            "🚀 ~ file: server.js ~ line 79 ~ socket.on ~ roomID",
            roomID
        );
        if (rooms[roomID]) {
            const length = rooms[roomID].usersInRoom.length;
            console.log(
                "🚀 ~ file: server.js ~ line 82 ~ socket.on ~ length",
                length
            );
            if (length === maxParticipantsAllowed) {
                socket.emit("room full");
                return;
            }
            rooms[roomID].usersInRoom.push(socket.id);
            console.log("user count :", rooms[roomID].usersInRoom.length);
            console.log(
                "🚀 ~ file: server.js ~ line 81 ~ socket.on ~ rooms[roomID]",
                rooms[roomID].usersInRoom
            );
        } else {
            // rooms[roomID].usersInRoom = [socket.id];
            console.log("🚀 ~ this room doesn't exist.");
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = rooms[roomID]
            ? rooms[roomID].usersInRoom.filter((id) => id !== socket.id)
            : [];
        socket.emit("all users", usersInThisRoom);
        console.log("When join room : ", rooms[roomID]);
    });

    socket.emit("rooms", users);

    socket.on("sending signal", (payload) => {
        io.to(payload.userToSignal).emit("user joined", {
            signal: payload.signal,
            callerID: payload.callerID,
        });
    });

    socket.on("returning signal", (payload) => {
        io.to(payload.callerID).emit("receiving returned signal", {
            signal: payload.signal,
            id: socket.id,
        });
    });

    socket.on("disconnect", () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter((id) => id !== socket.id);
            users[roomID] = room;
        }
        socket.broadcast.emit("user left", socket.id);
    });

    socket.on("change", (payload) => {
        socket.broadcast.emit("change", payload);
    });

    socket.on("message", (payload) => {
        socket.join(payload.room);
        console.log(`Message from ${socket.id} : ${payload.message}`);

        const room = rooms[payload.room];
        if (room !== undefined) {
            if (room.id === payload.room) {
                singleChat = {
                    message: payload.message,
                    writer: payload.userId,
                };
                room.chat.push(singleChat);
                payload.chat = room.chat;
            }

            console.log(
                "🚀 ~ file: server.js ~ line 75 ~ socket.on ~ room",
                room,
                payload.room
            );
        } else {
            console.log("🚀 ~ file: server.js ~ line 82 ~ socket.on ~ else");
        }

        io.to(payload.room).emit("chat", payload);

        // io.to(room.id).emit("chat", payload);
        // io.emit("chat", payload);
        // socket.broadcast.emit("chat", payload);
    });
});

app.get("/", (req, res) => {
    res.send("Server is running successfully!");
});

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
