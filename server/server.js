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
let deleteRooms = [];
// let remain_room = [];

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
    console.log('Number of users left in this room is ', users.length);
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
      users: users,
      maxParticipantsAllowed: 3,
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
    console.log('Number of user is ', users.length);
  });

  socket.on("delete_room", (room) => {
    console.log('room ', room.id, ' is deleted!');
    let delete_room = rooms.find(item => item.id === room.id);
    deleteRooms.push(delete_room);
    console.log('this is deleted room');
    console.log(deleteRooms);
    let remain_room= rooms.splice(delete_room.id, 1);
    io.in(delete_room).socketsLeave(delete_room);
    socket.leave(delete_room);
    console.log('this is remaining room');
    console.log(remain_room);
    
    // socket.on("remain_data",(remain_room));
    // socket.broadcast.emit("updateRooms", remain_room);
    // socket.disconnect();
    // // console.log('this is final result of room array');
    // socket.emit("getAllRooms", remain_room);
    // console.log(remain_room);
  });

  socket.emit("getAllRooms", rooms);
  console.log(rooms);
  socket.broadcast.emit("updateRooms", rooms);

  socket.on("message", (payload) => {
    console.log(`Message from ${socket.id} : ${payload.message} : ${payload.file}`);
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
