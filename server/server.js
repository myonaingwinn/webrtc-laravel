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
let joinedUsers = [];

app.get("/", (req, res) => {
  res.send("Server is running successfully!");
});

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
    // console.log('Number of users remain in this room is ', users.length);
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
    socket.join(room.id);
    console.log(`user ${socket.id} joined room: ${room.id}`);
    joinedUsers.push(socket.id);
    console.log('Number of user in this room is ', joinedUsers.length);
    socket.emit("usersList", joinedUsers);
    socket.broadcast.emit("updateUsers", joinedUsers);
  });

  socket.emit("getAllRooms", rooms);
  // console.log(rooms);
  socket.broadcast.emit("updateRooms", rooms);

  socket.on("leave_room", (room) => {
    console.log('user ', socket.id, ' leave from room ', room);
    joinedUsers.splice(socket.id, 1);
    socket.emit("leftUsers", joinedUsers);
    socket.broadcast.emit("updateUsers", joinedUsers);
    socket.disconnect();
    console.log('Number of users remain in this room is ', joinedUsers.length);

    if (joinedUsers.length == 0) {
      console.log('no users in this room so this room will delete');
      rooms.splice(room, 1);
      io.in(rooms).socketsLeave(room);
      socket.leave(room);
      socket.broadcast.emit("updateRooms", rooms);
      console.log('current rooms are ', rooms);
      socket.broadcast.emit("updateRooms", rooms);
    }
  })
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
