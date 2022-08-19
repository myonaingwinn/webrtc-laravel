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

const PORT = process.env.SERVER_PORT || 5000;

const users = {};
io.on("connection", (socket) => {
    socket.on("disconnect", () => {
        for (let user in users) {
            if (users[user] === socket.id) delete users[user];

            io.emit("all_users", users);
        }
    });

    socket.on("typing",(room,reciever,name)=>{
    socket.in(room).emit("typing",reciever,name)
})
socket.on("stop typing",(room,reciever,name)=>{socket.in(room).emit("stop typing",reciever,name)})


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
});

app.get("/", (req, res) => {
    res.send("Suvro444444 running");
});

server.listen(PORT, () => {
    console.log(`Listening at ${PORT}`);
});
