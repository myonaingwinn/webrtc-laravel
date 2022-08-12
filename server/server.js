const express = require("express");
const http = require("http");
const { nanoid } = require("nanoid");
const app = express();
const server = http.createServer(app);
require("dotenv").config();
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const PORT = process.env.SERVER_PORT || 5000;

let users = [];
let rooms = [];

io.on("connection", (socket) => {
    socket.emit("me", socket.id);

    socket.emit("your id", socket.id);
    socket.on("send message", (body) => {
        io.emit("message", body);
        console.log("sgsfg", body);
    });

    socket.on("setSocketId", (data) => {
        users.push(data);
        console.log(users);
        socket.emit("getAllUsers", users);
        socket.broadcast.emit("updateAllUsers", users);
    });

    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit("callUser", {
            signal: data.signalData,
            from: data.from,
            name: data.name,
        });
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded");
    });

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    });

    socket.on("endCall", () => {
        users = users.filter((user) => user !== socket.id);
        socket.disconnect();
        socket.broadcast.emit("updateAllUsers", users);
        console.log(users);
    });

    // Rooms
    socket.on("create_room", (name) => {
        const room = {
            id: nanoid(7),
            capacity: 10,
            usersJoined: [socket.id],
            users: users,
            maxParticipantsAllowed: 50,
            roomName: name,
        };

        socket.join(room);
        socket.emit("get_room", room);
        console.log("Room created: " + room.id);
        rooms.push(room);

        socket.broadcast.emit("updateRooms", rooms);
    });

    socket.on("join_room", (room) => {
        console.log(room.usersJoined);
        socket.join(room.id);
        let connectedUsers = io.sockets.adapter.rooms.get(room.id);
        console.log(connectedUsers);
        const numClients = connectedUsers.size;
        if (numClients > room.maxParticipantsAllowed) {
            socket.emit(`full`, room);
            console.log("room full...");
        }
        console.log("Number of clients in this room is ", numClients);
        socket.broadcast.emit("updateAllUsers", connectedUsers);
    });

    socket.emit("getAllRooms", rooms);
    socket.broadcast.emit("updateRooms", rooms);

    socket.on("delete_room", (room) => {
        console.log("delete room id is", room.id);
        rooms.splice(room.id, 1);
        console.log("remain rooms are ", rooms);
        // socket.broadcast.emit("updateRooms", rooms);
    });

    socket.on("leave_room", (room) => {
        console.log("user ", socket.id, " leave from room ", room);
        users.splice(socket.id, 1);
        socket.broadcast.emit("updateAllUsers", users);
        socket.disconnect();
    });

    socket.on("leaveChat", () => {
        users = users.filter((user) => user !== socket.id);
        socket.disconnect();
        socket.broadcast.emit("updateAllUsers", users);
        console.log(users);
    });
});

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
