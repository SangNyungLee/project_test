const express = require("express");
const app = express();
const http = require("http");
const PORT = 8000;
const SocketIO = require("socket.io");
const db = require("./models");
const session = require('express-session');

const server = http.createServer(app);
const sessionMiddleware = session({
  secret: "changeit",
  resave: false,
  saveUninitialized: false
});

app.use(sessionMiddleware);
const io = SocketIO(server);
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//router 분리
const router = require("./routes/main");
app.use("/", router);

//socket.io 분리
const socketRouter = require("./routes/socket");
socketRouter(io);

//dbSync
db.sequelize.sync({ force: false }).then(() => {
  server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});
