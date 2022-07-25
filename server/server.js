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
      maxParticipantsAllowed: 3,
      roomName:name,
    };

    // const myRoom = io.sockets.adapter.rooms.get(room) || { size: 0 };
    // const numClients = myRoom.size;
    // console.log(room, 'has', numClients, 'clients');
    // if (numClients === room.maxParticipantsAllowed) {
    //   socket.emit("room_full", room);
    // }

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
});



server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
