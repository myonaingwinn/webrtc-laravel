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

app.get("/", (req, res) => {
  res.send("Server is running successfully!");
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
