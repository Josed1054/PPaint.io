const { io } = require("../../../server");
const { databaseRooms, databaseUsers } = require("../userHandeler/users");
const { sendUsersToRoom } = require("../controllers/sendUsersToRoom");
const {
  sendResultsOfTheMatch,
} = require("../controllers/sendResultsOfTheMatch");

function updateRoomUsers(_id, newLeaderNum, newLeaderName) {
  databaseUsers.find({ _id: `${_id}` }, (err, docs) => {
    if (docs[0] == null) {
      return err;
    } else if (docs[0] !== null) {
      try {
        let numbers = docs[0].users.userNumber;
        let users = docs[0].users.userName;
        let colors = docs[0].users.userColor;
        let points = docs[0].users.userPoints;
        let leaderNum = docs[0].users.userNumber[0];
        let leaderName = docs[0].users.userName[0];

        let gameStatus = docs[0].gameStatus;
        let gameRound = docs[0].gameRound;

        let numberOfUserPainting = docs[0].userTurn;
        let userNumberOfThePainter =
          docs[0].users.userNumber[numberOfUserPainting];
        // Send users and room info

        if (gameStatus == "waiting Room") {
          if (newLeaderNum == undefined) {
            sendUsersToRoom(
              _id,
              numbers,
              users,
              colors,
              points,
              leaderNum,
              leaderName
            );
          } else {
            io.to(_id).emit("newLeader", newLeaderNum, newLeaderName);
            sendUsersToRoom(
              _id,
              numbers,
              users,
              colors,
              points,
              leaderNum,
              leaderName
            );
          }
        } else if (gameStatus == "Painting") {
          io.in(_id).emit("round", gameRound);
          io.to(_id).emit("startGame");
          sendUsersToRoom(_id, numbers, users, colors, points);
          io.to(_id).emit("userPainting", userNumberOfThePainter);
        } else if (gameStatus == "ratingPaint") {
          io.in(_id).emit("round", gameRound);
          io.to(_id).emit("startGame");
          databaseRooms.find({ _id: `${_id}` }, (err, docs2) => {
            if (docs2[0] == null) {
              return err;
            } else {
              let wordPaintedNum = docs2[0].paint.words.length - 1;
              let wordPainted = docs2[0].paint.words[wordPaintedNum];
              let lastCanvasPainted = docs2[0].paint.canvas.length - 1;
              let canvasPainted = docs2[0].paint.canvas[lastCanvasPainted];
              io.in(_id).emit("rateCanvas", canvasPainted, wordPainted);

              sendUsersToRoom(_id, numbers, users, colors, points);
            }
          });
        } else if (gameStatus == "viewing Score") {
          io.in(_id).emit("round", gameRound);
          io.to(_id).emit("startGame");
          databaseRooms.find({ _id: `${_id}` }, (err, docs2) => {
            if (docs2[0] == null) {
              return err;
            } else {
              let wordPaintedNum = docs2[0].paint.words.length - 1;
              let wordPainted = docs2[0].paint.words[wordPaintedNum];
              let lastCanvasPainted = docs2[0].paint.canvas.length - 1;
              let canvasPainted = docs2[0].paint.canvas[lastCanvasPainted];
              let canvasRateNum = docs2[0].paint.canvasPoints.length - 1;
              let sumedPoints = docs2[0].paint.canvasPoints[canvasRateNum];
              io.in(_id).emit("rateCanvas", canvasPainted, wordPainted);
              io.in(_id).emit("canvasRate", sumedPoints);
              io.in(_id).emit("sendRate");
            }
          });

          sendUsersToRoom(_id, numbers, users, colors, points);
        } else if (gameStatus == "Final") {
          io.to(_id).emit("startGame");
          sendResultsOfTheMatch(_id);
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
}

module.exports = {
  updateRoomUsers,
};
