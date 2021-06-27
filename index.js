require("dotenv").config();
const express = require("express");
const app = express();
// const http = require("http");
const socketio = require("socket.io");
const socketio_client = require("socket.io-client");
const PORT = process.env.PORT || 8080;
const server = require("http").createServer(app);
const jwt = require("jsonwebtoken");
// const WebSocket = require("ws");

// const wss = new WebSocket.Server({ server: server });
// const server = http.createServer(app);
const io = socketio(server);
io.use(async (socket, next) => {
  socket.customToken = socket.handshake.query.token;

  if (socket.handshake.query && socket.handshake.query.token) {
    await jwt.verify(
      socket.handshake.query.token,
      "hsfyeuf8349)#$65",
      function (err, decoded) {
        if (err) return next(new Error("Authentication error"));
        socket.decoded = decoded;
        next();
      }
    );
  } else {
    next(new Error("Authentication error"));
  }
}).on("connection", (socket) => {
  console.log("A new client Connected!");

  socket.on("auto-save", (data) => {
    console.log(data);
    socket.emit("auto-save-flag", true);
  });
  if (socket.decoded.uid === "60b7704e683587057b72e3e2") {
    socket.join(socket.decoded.uid);
  }
  io.in(socket.decoded.uid).emit("message", { gender: "Trans" });
});

app.get("/", (req, res) => res.send("Hello World!"));

server.listen(PORT, () => console.log(`Lisening on port :${PORT}`));
//client side
const socket1 = socketio_client(`http://localhost:${PORT}`, {
  query: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MGI3NzA0ZTY4MzU4NzA1N2I3MmUzZTIiLCJpYXQiOjE2MjQyNjQ4Mjl9.EHE9llM1CGT1rOSWtQjAge7E2luwJmUHPpgajt1E9_8",
  },
});
socket1.emit("auto-save", { name: "Joy" });
socket1.on("message", (data) => {
  console.log("SOCKET1", data);
});
// const socket3 = socketio_client(`http://localhost:${PORT}`, {
//   query: {
//     token:
//       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MGI3NzA0ZTY4MzU4NzA1N2I3MmUzZTIiLCJpYXQiOjE2MjQyNjQ4Mjl9.EHE9llM1CGT1rOSWtQjAge7E2luwJmUHPpgajt1E9_8",
//   },
// });
// socket3.emit("auto-save", { name: "Joy" });
// socket3.on("message", (data) => {
//   console.log("SOCKET3", data);
// });
const socket2 = socketio_client(`http://localhost:${PORT}`, {
  query: {
    token: "jnfeur94**&*(",
  },
});
socket2.emit("auto-save", { name: "Joy" });
socket2.on("message", (data) => {
  console.log("SOCKET2", data);
});


//this is something new
