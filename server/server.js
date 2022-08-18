const express = require("express");
const http = require("http");
const { nanoid } = require("nanoid");
const app = express();
const server = http.createServer(app);
require("dotenv").config();
// const socketio = require("socket.io");
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
  // Rooms
  socket.on("create_room", name => {
    const room = {
      id: nanoid(7),
      capacity: 10,
      usersJoined: [socket.id],
      users: users,
      maxParticipantsAllowed: 50,
      roomName: name,
      count: 0,
    };
    console.log(room);
    socket.join(room);
    socket.emit("get_room", room);
    console.log("Room created: " + room.id);
    rooms.push(room);

    socket.broadcast.emit("updateRooms", rooms);
  });

  socket.emit("getAllRooms", rooms);
  socket.broadcast.emit("updateRooms", rooms);

  socket.on("join_room", (room) => {
    console.log(room.usersJoined);
    socket.join(room.id);
    users = room.usersJoined;
    // console.log('join user is ', room.usersJoined.length);
    let connectedUsers = io.sockets.adapter.rooms.get(room.id);
    console.log(connectedUsers);
    let numClients = connectedUsers.size;
    room.count = numClients;
    // console.log('count is ', room.count);
    console.log(room);
    if (numClients > room.maxParticipantsAllowed) {
      socket.emit(`full`, room);
      console.log("room full...");
    }
    console.log("Number of clients in this room is ", numClients);
    socket.emit("updateUsers", connectedUsers);
    socket.emit("updateRooms", rooms);
  });

  socket.on("delete_room", (room) => {
    rooms = rooms.filter((r) => r['id'] !== room.id);
    console.log(rooms);
    socket.emit("updateRooms", rooms);
  });

  socket.on("leave_room", (room) => {
    console.log("user ", socket.id, " leave from room ", room);
    // socket.leave();
    socket.disconnect();
    // let connectedUsers = io.sockets.adapter.rooms.get(room);
    // console.log(connectedUsers);
    room.count = room.count - 1;
    console.log("Number of clients remain in this room is ", room.count);
    console.log(room);
    // socket.broadcast.emit("updateUsers", users);
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
