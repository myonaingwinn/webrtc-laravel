const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
require("dotenv").config();
const io = socket(server, {
    cors: {
        // origin: [
        //     "http://localhost:3000",
        //     "https://webrtc-laravel.vercel.app",
        //     "https://webrtc-test-17-aug.netlify.app",
        //     "*",
        // ],
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const PORT = process.env.PORT || 5000;

const onlineUsers = {};
const rooms = {};
const maxParticipantsAllowed = 10;
const socketToRoom = {};

io.on("connection", (socket) => {
    socket.emit();
    socket.emit("me", socket.id);

    /*********************************************
     * Users
     ********************************************/
    socket.on("set online user", (user) => {
        if (user.uuid && user.socketId) {
            onlineUsers[user.uuid] = user;
        }
        socket.emit("online users", onlineUsers);
    });

    socket.on("get online users", () => {
        socket.emit("online users", onlineUsers);
    });

    socket.on("logout", (userId) => {
        delete onlineUsers[userId];
        socket.emit("online users", onlineUsers);
    });

    socket.on("endCall", (data) => {
        io.to(data.id).emit("endCall");
    });

    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit("callUser", {
            signal: data.signalData,
            from: data.from,
            name: data.name,
        });
    });

    socket.on("reject", (data) => {
        io.to(data.id).emit("reject");
    });

    socket.on("updateMyMedia", ({ type, currentMediaStatus }) => {
        socket.broadcast.emit("updateUserMedia", {
            type,
            currentMediaStatus,
        });
    });

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    });

    /*********************************************
     * Private Chat
     ********************************************/

    socket.on("typing", (room, reciever, name) => {
        socket.in(room).emit("typing", reciever, name);
    });

    socket.on("stop typing", (room, reciever, name) => {
        socket.in(room).emit("stop typing", reciever, name);
    });

    socket.on("typing", (room, reciever, name) => {
        socket.in(room).emit("typing", reciever, name);
    });

    socket.on("stop typing", (room, reciever, name) => {
        socket.in(room).emit("stop typing", reciever, name);
    });

    //room
    socket.on("joinroom", (room) => {
        socket.join(room);
    });

    //for msg
    socket.on("newmsg", ({ newmsg, room }) => {
        io.in(room).emit("getnewmsg", newmsg);
    });

    socket.on("send noti", (obj) => {
    });

    socket.on("seen", (seen, room) => {
        io.in(room).emit("setseen", seen);
    });

    /*********************************************
     * Rooms
     ********************************************/

    socket.on("create_room", (room) => {
        if (!rooms[room.id]) {
            rooms[room.id] = room;
        }
        socket.broadcast.emit("rooms", rooms);
    });

    socket.on("get all rooms", () => {
        socket.emit("rooms", rooms);
    });

    socket.on("delete_room", (room) => {
        delete rooms[room];
        socket.emit("rooms", rooms);
    });

    socket.on("join room", (roomID) => {
        if (rooms[roomID]) {
            const length = rooms[roomID].usersInRoom.length;
            rooms[roomID].usersInRoom.push(socket.id);
            if (rooms[roomID].usersInRoom.length >= maxParticipantsAllowed) {
                rooms[roomID].roomFull = true;
                socket.broadcast.emit("rooms", rooms);
            }
        } else {
            console.log("🚀 ~ this room doesn't exist.");
            return;
        }

        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = rooms[roomID]
            ? rooms[roomID].usersInRoom.filter((id) => id !== socket.id)
            : [];
        socket.emit("all users in a room", usersInThisRoom);
        socket.emit("room_name", rooms[roomID].name);
        socket.broadcast.emit("rooms", rooms);
    });

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
        let room = rooms[roomID];
        if (room) {
            usersInRoom = room.usersInRoom.filter((id) => id !== socket.id);
            rooms[roomID].usersInRoom = usersInRoom;
            rooms[roomID].roomFull = false;
        }
        socket.broadcast.emit("user left", socket.id);
        socket.broadcast.emit("rooms", rooms);
    });

    socket.on("change", (payload) => {
        socket.broadcast.emit("change", payload);
    });

    /*********************************************
     * Room Chat
     ********************************************/

    socket.on("message", (payload) => {
        socket.join(payload.room);

        const room = rooms[payload.room];
        if (room !== undefined) {
            if (room.id === payload.room) {
                singleChat = {
                    message: payload.message,
                    senderId: payload.userId,
                    senderName: payload.userName,
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
    });
});

app.get("/", (req, res) => {
    res.send("Server is running successfully!");
});

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
