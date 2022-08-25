const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
require("dotenv").config();
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

let users = [];

io.on("connection", (socket) => {
    socket.emit("me", socket.id);

    socket.on("setSocketId", (data) => {
        users.push(data);
        console.log(users);
        socket.emit("getAllUsers", users);
        socket.broadcast.emit("updateAllUsers", users);
    });

    socket.on("callUser", (data) => {
        console.log("Calling to other.....");
        console.log("Client Id", data.userToCall);
        io.to(data.userToCall).emit("callUser", {
            signal: data.signalData,
            from: data.from,
            name: data.name,
        });
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded");
    });

    socket.on("typing", (room, reciever, name) => {
        socket.in(room).emit("typing", reciever, name);
    });
    socket.on("stop typing", (room, reciever, name) => {
        socket.in(room).emit("stop typing", reciever, name);
    });

    socket.on("new_users", (username) => {
        users[username] = socket.id;
    });
    //telling everyone that someone is connected
    io.emit("all_users", users);

    //room
    socket.on("joinroom", (room) => {
        socket.join(room);
    });

    //for msg
    socket.on("newmsg", ({ newmsg, room }) => {
        io.in(room).emit("getnewmsg", newmsg);
    });

    //notification
    socket.on("notification", (sender, reciever, newmsg, room) => {
        io.emit("setnotification", sender, reciever, newmsg, room);
    });

    socket.on("seen", (seen, room) => {
        io.in(room).emit("setseen", seen);
    });

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    });
    socket.on("endCall", ({ id }) => {
        io.to(id).emit("endCall");
    });
});

const PORT = process.env.SERVER_PORT || 5000;

app.get("/", (req, res) => {
    res.send("Server is running successfully!");
});

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
