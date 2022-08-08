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

app.get("/", (req, res) => {
  res.send("Server is running successfully!");
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.emit("your id", socket.id);
  socket.on("send message", (body) => {
    io.emit("message", body);
    console.log("sgsfg", body);
  });

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
  socket.on("create_room", name => {
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
    socket.broadcast.emit("updateUsers", connectedUsers);
  });

  socket.emit("getAllRooms", rooms);
  socket.broadcast.emit("updateRooms", rooms);

  socket.on("delete_room", (room) => {
    console.log('delete room id is', room.id);
    rooms.splice(room.id, 1);
    socket.broadcast.emit("updateRooms", rooms);
    console.log("remain rooms are ", rooms);
  })

  socket.on("leave_room", (room) => {
    console.log("user ", socket.id, " leave from room ", room);
    users.splice(socket.id, 1);
    socket.broadcast.emit("updateUsers", users);
    socket.disconnect();
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
