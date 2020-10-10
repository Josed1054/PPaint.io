const socket = io();

let round;

const _id = `${sessionStorage.getItem("room")}${sessionStorage.getItem(
  "code"
)}`;
const room = sessionStorage.getItem("room");
const code = sessionStorage.getItem("code");
const userName = sessionStorage.getItem("userName");
const userColor = sessionStorage.getItem("userColor");
let userNumber = Number(sessionStorage.getItem("userNumber"));

// Room
import {
  innerCodeRoom,
  innerGameRound,
  newLeader,
  leaderDiv,
  playerDiv,
  outputUsers,
  setPainter,
} from "./room.js";

// Messages
import {
  eraseChatContent,
  outputMessage,
  outputMessageWord,
  disableInputChat,
} from "./messages.js";

// Game
import {
  setP,
  oneTime60SecFunc,
  chooseWords,
  ratePaint,
  rateCanvas,
  rateContainer,
  sendRate,
  canvasRate,
  continueCounting15sec,
  continueCounting10sec,
  usersResume,
  paintsResume,
} from "./game.js";

// Canvas
import {
  eraseCanvas,
  setCanvasSize,
  drawMoventDown,
  drawMovementMove,
  drawMovementUp,
} from "./canvas.js";

socket.emit("joinRoom", {
  _id,
  room,
  code,
  userNumber,
  userName,
  userColor,
});

socket.on("userNumber", (number) => {
  userNumber = number;
  sessionStorage.setItem("userNumber", number);
});

innerCodeRoom(room, code);

ifvisible.now("hidden", function () {
  console.log("lol page hidden");
});

// Emit Url

const url = window.location.href;
const arr = url.split("/");
const result = arr[0] + "//" + arr[2];
socket.emit("url", result);

// Erro handleler
socket.on("bruh", (bruh) => {
  alert(`${bruh}`);
});

window.addEventListener("beforeunload", function (e) {
  // Cancel the event
  e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
  // Chrome requires returnValue to be set
  e.returnValue = "";
});

let gameStatus = "waiting Room";
let msgTime;

socket.on("eraseChat", () => {
  eraseChatContent();
});

socket.on("round", (gameRound) => {
  round = gameRound;
  innerGameRound(gameRound);
});

let oneStartGame = false;
socket.on("startGame", () => {
  if (!oneStartGame) {
    oneStartGame = true;

    oneUsersResume = true;
    onePaintsResume = true;

    const startBlock =
      document.querySelector(".startBlock") ||
      document.querySelector(".canvasDivs");

    if (startBlock.attributes.class.nodeValue == "canvasDivs") {
      const drawBlock = document.querySelector(".paintDiv");

      if (drawBlock == null || drawBlock == undefined) {
        startBlock.remove();
        document.querySelector(".wallBlock").remove();
        document.querySelector(".usersDiv").remove();
      } else {
        startBlock.remove();
        document.querySelector(".wallBlock").remove();
        document.querySelector(".usersDiv").remove();
        document.querySelector(".paintPlate").remove();
        document.querySelector(".paintDiv").remove();
      }
    } else {
      startBlock.remove();
    }
  }
});

// Handleling secret word
socket.on("secretChart", (backSlash) => {
  setP(backSlash);
});

socket.on("userPainting", (userNumberOfThePainter, userNameOfThePainter) => {
  setPainter(userNumberOfThePainter, userNameOfThePainter);
});

socket.on("broadcastedTime60", (seconds) => {
  gameStatus = "Painting";
  oneTime60SecFunc(seconds);
  msgTime = seconds;
});

// Handleling secret word

// Message from server
socket.on("message", (message, userColor) => {
  outputMessage(message, userColor);
});

socket.on("messageWord", (userName, seconds, userColor) => {
  outputMessageWord(userName, seconds, userColor);
});

socket.on("disableChat", () => {
  disableInputChat();
});

let usersWaiting;

socket.on(
  "roomUsers",
  ({ numbers, users, colors, points, leaderName, leaderNum }) => {
    usersWaiting = users.length;

    outputUsers(
      numbers,
      users,
      colors,
      points,
      leaderName,
      leaderNum,
      userNumber,
      usersWaiting,
      _id
    );
  }
);

socket.on("newLeader", (newLeaderNum, newLeaderName) => {
  let leaderName = newLeaderName;
  newLeader(newLeaderNum, newLeaderName);

  if (newLeaderNum === userNumber) {
    leaderDiv(_id, usersWaiting);
  } else {
    playerDiv(leaderName);
  }
});

// Game

socket.on("chooseWord", (word1, word2, word3) => {
  chooseWords(word1, word2, word3, _id, userName, round);
});

socket.on(
  "canvasXYs",
  (canvasAction, loc, userName, userColor, colorSet, line_Width) => {
    if (canvasAction == "canvasDown") {
      drawMoventDown(loc, userName, userColor, colorSet, line_Width);
    } else if (canvasAction == "canvasMove") {
      drawMovementMove(loc, userName, userColor, colorSet, line_Width);
    } else if (canvasAction == "canvasUp") {
      drawMovementUp();
    } else if (canvasAction == "eraseCanvas") {
      eraseCanvas();
    }
  }
);

window.addEventListener("resize", setCanvasSize);

socket.on("allPlayersRigth", () => {
  ratePaint();
});

let oneTimeRate = false;

socket.on("rateCanvas", (canvasPainted, wordPainted) => {
  if (!oneTimeRate) {
    rateCanvas(canvasPainted, wordPainted);

    return (oneTimeRate = true), (gameStatus = "ratingPaint");
  }
});

let oneTimeSendRate = false;
socket.on("sendRate", () => {
  if (!oneTimeSendRate) {
    sendRate(_id, round);

    oneTimeSendRate = true;
  }
});

socket.on("broadcastedTime15Rate", (seconds) => {
  rateContainer(seconds);
});

socket.on("canvasRate", (sumedPoints) => {
  canvasRate(sumedPoints);
});

// Set New Turn
socket.on("eraseRate", () => {
  document.querySelector(".rateBlock").className = "uselessRateBlock";
  document.querySelector(".rateContainer").className = "uselessRateContainer";
  document.querySelector(".rateImg").remove();
  document.querySelector(".rate").innerText = "";
  document.querySelector(".rate").style.background = "none";
  document.querySelector(".timerWords").innerText = "";
  document.querySelector(".timerWords").style.border = "none";
  document.querySelector(".secondsP").innerText = "";

  oneTimeRate = false;
  oneTimeSendRate = false;
});

socket.on("continueCounting15sec", () => {
  continueCounting15sec();
});

socket.on("continueCounting10sec", () => {
  continueCounting10sec();
});

let oneUsersResume = true;
socket.on("usersResume", (numbers, users, colors, points) => {
  if (oneUsersResume)
    usersResume(numbers, users, colors, points, userNumber, userColor),
      (oneUsersResume = false);
});

let onePaintsResume = true;
socket.on("paintsResume", (canvas, users, colors, points, words) => {
  if (onePaintsResume)
    paintsResume(canvas, users, colors, points, words),
      (onePaintsResume = false);
});

// Emit events

// Room.js
export function emitStarGame() {
  socket.emit("startGame", _id);
}
// Room.js

// Messages.js
export function emitChatMessage(msg) {
  socket.emit(
    "chatMessage",
    msg,
    _id,
    gameStatus,
    msgTime,
    userName,
    userColor
  );
}
// Messages.js

// Game.js
export function emit15secWord(seconds) {
  socket.emit("15secWord", _id, userName, seconds, userColor);
}

export function emitChoosendWord(wordArray) {
  socket.emit("choosendWord", _id, wordArray);
}

export function emitEraseChat() {
  socket.emit("eraseChat", _id);
}

export function emitSecretChart(backSlash) {
  socket.emit("secretChart", _id, backSlash);
}

export function emit60sec(seconds) {
  socket.emit("60sec", _id, seconds);
}

export function emit15secRate(seconds) {
  socket.emit("15secRate", _id, round, seconds);
}

export function emitCanvasRate(rate) {
  socket.emit("canvasRate", _id, rate);
}

export function emit10secMatch(seconds) {
  gameStatus = "viewing Score";
  socket.emit("10secMatch", _id, seconds);
}

export function emit15secNewRate(seconds2) {
  socket.emit("15secNewRate", _id, seconds2);
}

export function emit10secNewMatch(seconds2) {
  gameStatus = "viewing Score";
  socket.emit("10secNewMatch", _id, seconds2);
}

export function emitPlayAgain() {
  socket.emit("newPlayerPlayingAgain", _id, userName, userColor);

  oneStartGame = false;
}
// Game.js

// Canvas.js
export function sendLocCanvas(
  canvasAction,
  loc,
  strokesColorEmit,
  strokesWidthEmit
) {
  socket.emit(
    "canvasXY",
    canvasAction,
    loc,
    strokesColorEmit,
    strokesWidthEmit,
    _id,
    userName,
    userColor
  );
}

export function emitCanvasPainted(canvasPainted) {
  socket.emit("canvasPainted", _id, userName, userColor, canvasPainted);
}
// Canvas.js

// Emit events
