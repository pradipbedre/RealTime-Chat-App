const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const port = process.env.PORT || 2000;

const app = express();
app.use(cors());

const users = [{}];

const server = http.createServer(app);
const io = socketIO(server);

app.get("/", (req, res) => {
  res.send("you are live pk");
});

io.on("connection", (socket) => {
  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    socket.emit("welcome", {
      user: "Admin",
      message: `welcome to the chat ${users[socket.id]}`,
    });
  });

  // messages send
  socket.on("message", ({ message, userid }) => {
    io.emit("sendMsg", { user: users[userid], message, userid });
  });
});

server.listen(port, () => {
  console.log(`I am listning...`);
});
