const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const port = process.env.PORT || 2000;

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIO(server);

const users = [{}];

app.get("/", (req, res) => {
  res.send("you are live pk");
});

io.on("connection", (socket) => {
  console.log("new connection socket");

  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    socket.broadcast.emit("userjoined", {
      user: `${users[socket.id]}`,
      message: `${users[socket.id]} has joined chat`,
    });

    socket.emit("welcome", {
      user: `${users[socket.id]}`,
      message: `welcome to the chat ${users[socket.id]}`,
    });
  });

  // messages logics
  socket.on("message", ({ message, userid }) => {
    io.emit("sendMsg", { user: users[userid], message, userid });
  });

  // end connection
  socket.on("disconnect", () => {
    socket.broadcast.emit("leave", {
      user: `${users[socket.id]}`,
      message: `${users[socket.id]} leave chat. `,
    });
    console.log("user left");
  });
});

server.listen(port, () => {
  console.log(`I am listning on http://localhost:${port}`);
});
