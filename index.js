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
// io.use(async (socket, next) => {
//   socket.customToken = socket.handshake.query.token;

//   if (socket.handshake.query && socket.handshake.query.token) {
//     await jwt.verify(
//       socket.handshake.query.token,
//       "hsfyeuf8349)#$65",
//       function (err, decoded) {
//         if (err) return next(new Error("Authentication error"));
//         socket.decoded = decoded;
//         next();
//       }
//     );
//   } else {
//     next(new Error("Authentication error"));
//   }
// })
const fetchUserID = async (socket) => {
  return new Promise(async (resolve, reject) => {
    if (socket.handshake.query && socket.handshake.query.token) {
      await jwt.verify(
        socket.handshake.query.token,
        "hsfyeuf8349)#$65",
        function (err, decoded) {
          if (err) {
            resolve(null);
          }
          socket.decoded = decoded;
          if (socket.decoded === undefined) {
            return resolve(null);
          }
          return resolve(socket.decoded.uid);
        }
      );
    } else {
      resolve(null);
    }
  });
};
io.on("connection", async (socket) => {
  const userId = await fetchUserID(socket);
  console.log("USER ID", userId);
  if (!userId) {
    return io.emit("verify-error", {
      error: "Not able to extract User ID",
    });
  }
  if (userId === null) {
    return socket.emit("verify-error", {
      error: "Not able to extract User ID",
    });
  }
  socket.join(userId);
  // console.log(` ${socket.id}new client Connected ${userId}`);

  //to just emit the same event to all members of a room
  // io.to("Room Name").emit("new event", "Updates");

  // for (const clientId of clients) {
  //   //this is the socket of each client in the room.
  //   const clientSocket = io.sockets.sockets.get(clientId);
  //   console.log("CLIENT SOCKET", clientSocket.id);
  //   //you can do whatever you need with this
  //   // clientSocket.leave("Other Room");
  // }
  socket.on("auto-save", (data) => {
    // var rooms = Object.keys(io.sockets.adapter.sids[socket.id]);
    // console.log(io.sockets.adapter.sids);
    // for (let [k, v] of io.sockets.adapter.sids) {
    //   if (v === userId) {
    //     console.log(k);
    //   }
    // }
    const clients = io.sockets.adapter.rooms.get(userId);
    //to get the number of clients in this room
    const numClients = clients ? clients.size : 0;
    console.log(numClients);
    for (const clientId of clients) {
      //this is the socket of each client in the room.
      const clientSocket = io.sockets.sockets.get(clientId);
      console.log("CLIENT SOCKET", clientSocket.id);
      //you can do whatever you need with this
      // clientSocket.leave("Other Room");
    }
    io.to(userId).emit("message", {
      data,
      socket: socket.id,
      userId,
    });
  });
  // io.to(userId).emit("message", {
  //   socket: socket.id,
  //   message: "Well I am just checking if my socket is working properly",
  // });
  // console.log("ROOMS", io.sockets.adapter.rooms);
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
// socket1.emit("auto-save", { name: "Joy" });
socket1.on("message", (data) => {
  console.log("SOCKET1", data);
});
const socket3 = socketio_client(`http://localhost:${PORT}`, {
  query: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MGI3NzA0ZTY4MzU4NzA1N2I3MmUzZTIiLCJpYXQiOjE2MjQyNjQ4Mjl9.EHE9llM1CGT1rOSWtQjAge7E2luwJmUHPpgajt1E9_8",
  },
});
// socket3.emit("auto-save", { name: "Joy" });
socket3.on("message", (data) => {
  console.log("SOCKET3", data);
});
const socket4 = socketio_client(`http://localhost:${PORT}`, {
  query: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MGI3NzA0ZTY4MzU4NzA1N2I3MmUzZTIiLCJpYXQiOjE2MjQyNjQ4Mjl9.EHE9llM1CGT1rOSWtQjAge7E2luwJmUHPpgajt1E9_8",
  },
});
// socket4.emit("auto-save", { name: "Joy" });
socket4.on("message", (data) => {
  console.log("SOCKET4", data);
});
const socket2 = socketio_client(`http://localhost:${PORT}`, {
  query: {
    // token: "jnfeur94**&*(",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MGQ1NjdjMDUyZDVkZTAwMTVhYTg1NzAiLCJpYXQiOjE2MjQ3ODI1MjN9.uoVk-2YwAiRAdc-TPcf4gPA-U0XM_WljgqxoPiRGrnU",
  },
});
socket2.emit("auto-save", { name: "Joy" });
socket2.on("message", (data) => {
  console.log("SOCKET2", data);
});
