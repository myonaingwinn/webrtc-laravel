const express = require("express");
const http = require("http");
const app = express();
const { nanoid } = require("nanoid");
const server = http.createServer(app);

require("dotenv").config();
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let users = [];
let rooms = [];

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.emit("me", socket.id);
  users.push(socket.id);

  socket.broadcast.emit("updateUsers", users);

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected.`);
    users = users.filter((user) => user !== socket.id);
    console.log(users);
    socket.broadcast.emit("updateUsers", users);
    socket.disconnect();
  });

  socket.emit("getAllUsers", users);
  console.log(users);

  // Rooms
  socket.on("create_room", () => {
    const room = {
      id: nanoid(7),
      capacity: 10,
      usersJoined: [socket.id],
      chat: [],
    };
    socket.join(room);
    socket.emit("get_room", room);
    console.log("Room created: " + room.id);
    rooms.push(room);

    socket.broadcast.emit("updateRooms", rooms);
  });

  socket.on("join_room", (room) => {
    socket.join(room.id);
    console.log(`user ${socket.id} joined room: ${room.id}`);
  });
  socket.emit("getAllRooms", rooms);

  socket.broadcast.emit("updateRooms", rooms);

  socket.on("message", (payload) => {
    console.log(`Message from ${socket.id} : ${payload.message} : ${payload.file}` );
    rooms.map((room) => {
      if (room.id === payload.room) {
        singleChat = { message: payload.message, writer: payload.socketId, file: payload.file };
        room.chat.push(singleChat);
        payload.chat = room.chat;
      }
    });

    io.to(payload.room).emit("chat", payload);
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
