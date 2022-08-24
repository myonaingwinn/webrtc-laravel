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

let userList = [];

io.on("connection", (socket) => {
    socket.emit("me", socket.id);

    socket.on("setSocketId", (data) => {
        userList.push(data);
        console.log(userList);
        socket.emit("getAllUsers", userList);
        socket.broadcast.emit("updateAllUsers", userList);
    });
    socket.broadcast.emit("updateAllUsers", userList);
    socket.emit("getAllUsers", userList);
    socket.on("reject", (data) => {
        io.to(data.id).emit("reject", {
            name: data.name,
        });
    });

    socket.on("updateMyMedia", ({ type, currentMediaStatus }) => {
        console.log("updateMyMedia");
        socket.broadcast.emit("updateUserMedia", { type, currentMediaStatus });
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
    // socket.on("disconnect", () => {
    //     socket.broadcast.emit("callEnded");
    // });
    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    });
    //   socket.on("endCall", ({ id }) => {
    //       io.to(id).emit("endCall");
    //   });
});

const PORT = process.env.SERVER_PORT || 5000;

app.get("/", (req, res) => {
    res.send("Server is running successfully!");
});

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
