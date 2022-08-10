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
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  socket.on("endCall", () => {
    users = users.filter((user) => user !== socket.id);
    socket.disconnect();
    socket.broadcast.emit("updateUsers", users);
    console.log(users);
  })
});

const PORT = process.env.SERVER_PORT || 5000;

app.get("/", (req, res) => {
  res.send("Server is running successfully!");
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
