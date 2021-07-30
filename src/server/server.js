// Set Server
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const helmet = require("helmet");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

module.exports = { io };

const { resetDB } = require("./Utils/js/controllers/resetDB");
const { expressRouteCreate } = require("./Utils/js/routesCallbacks/routes");
const { socketIndex } = require("./Utils/js/socketControllers/socketIndex");

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use(helmet());
app.use(express.static("./"));
app.use(express.json({ limit: "1mb" }));

resetDB();

app.get("/", (req, res) => {
  res.sendFile("/src/public/Home/index.html", { root: process.cwd() });
});

app.use("/Join", function (request, response) {
  expressRouteCreate(request, response);
});

app.post("/", (req, res) => {
  res.sendFile("/src/public/Game/index.html", { root: process.cwd() });
});

io.on("connection", function (socket) {
  socketIndex(socket);
});

app.get("*", (req, res) => {
  res.status(404).sendFile("/src/public/404/404.html", { root: process.cwd() });
});

module.exports = { app, server };
