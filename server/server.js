const express = require("express");
const http = require("http");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send(`Server is running on port : ${PORT}`);
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
