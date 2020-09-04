const { updateRoomUsers } = require("../controllers/updateRoomUsers");
const { playingGame } = require("../controllers/playingGame");

const { socketJoinRoom } = require("./socketJoinRoom");
const { socketMessage } = require("./socketMessage");
const { socketStartGame } = require("./socketStartGame");
const { socket15secWord } = require("./socket15secWord");
const { socketEraseChat } = require("./socketEraseChat");
const { socketChoosendWord } = require("./socketChoosendWord");
const { socket60sec } = require("./socket60sec");
const { socketSecretChart } = require("./socketSecretChart");
const { socketCanvasXY } = require("./socketCanvasXY");
const { socketCanvasPainted } = require("./socketCanvasPainted");
const { socket15secRate } = require("./socket15secRate");
const { socketCanvasRate } = require("./socketCanvasRate");
const { socket10secMatch } = require("./socket10secMatch");
const { socket15secNewRate } = require("./socket15secNewRate");
const { socket10secNewMatch } = require("./socket10secNewMatch");
const {
  socketNewPlayerPlayingAgain,
} = require("./socketNewPlayerPlayingAgain");
const { socketDisconnect } = require("./socketDisconnect");

let absoluteUrl;

function socketIndex(socket) {
  socket.on("joinRoom", function ({
    _id,
    room,
    code,
    userNumber,
    userName,
    userColor,
  }) {
    socketJoinRoom(socket, _id, room, code, userNumber, userName, userColor);
  });

  socket.on("url", (result) => {
    absoluteUrl = result;
  });

  socket.on("chatMessage", function (
    msg,
    _id,
    gameStatus,
    msgTime,
    userName,
    userColor
  ) {
    socketMessage(socket, msg, _id, gameStatus, msgTime, userName, userColor);
  });

  socket.on("startGame", function (_id) {
    socketStartGame(_id);
    updateRoomUsers(_id);
    playingGame(_id, absoluteUrl);
  });

  socket.on("15secWord", function (_id, userName, seconds, userColor) {
    socket15secWord(socket, _id, userName, seconds, userColor);
  });

  socket.on("eraseChat", function (_id) {
    socketEraseChat(_id);
  });

  socket.on("choosendWord", function (_id, wordArray) {
    socketChoosendWord(socket, _id, wordArray);
  });

  socket.on("60sec", function (_id, seconds) {
    socket60sec(socket, _id, seconds);
  });

  socket.on("secretChart", function (_id, backSlash) {
    socketSecretChart(socket, _id, backSlash);
  });

  socket.on("canvasXY", function (
    canvasAction,
    loc,
    strokesColorEmit,
    strokesWidthEmit,
    _id,
    userName,
    userColor
  ) {
    socketCanvasXY(
      socket,
      canvasAction,
      loc,
      strokesColorEmit,
      strokesWidthEmit,
      _id,
      userName,
      userColor
    );
  });

  socket.on("canvasPainted", function (
    _id,
    userName,
    userColor,
    canvasPainted
  ) {
    socketCanvasPainted(_id, userName, userColor, canvasPainted);
  });

  socket.on("15secRate", function (_id, round, seconds) {
    socket15secRate(_id, round, seconds);
  });

  socket.on("canvasRate", function (_id, rate) {
    socketCanvasRate(_id, rate);
  });

  socket.on("10secMatch", function (_id, seconds) {
    socket10secMatch(socket, _id, seconds, absoluteUrl);
  });

  socket.on("15secNewRate", function (_id, seconds) {
    socket15secNewRate(_id, seconds);
  });

  socket.on("10secNewMatch", function (_id, seconds) {
    socket10secNewMatch(socket, _id, seconds, absoluteUrl);
  });

  socket.on("newPlayerPlayingAgain", function (_id, userName, userColor) {
    socketNewPlayerPlayingAgain(socket, _id, userName, userColor);
  });

  socket.on("disconnect", function () {
    socketDisconnect(socket, socket.id, absoluteUrl);
  });
}

module.exports = {
  socketIndex,
};
