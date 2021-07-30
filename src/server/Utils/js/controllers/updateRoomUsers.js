const { io } = require("../../../server");
const { databaseRooms, databaseUsers } = require("../userHandeler/users");
const { sendUsersToRoom } = require("./sendUsersToRoom");
const { sendResultsOfTheMatch } = require("./sendResultsOfTheMatch");

function updateRoomUsers(_id, newLeaderNum, newLeaderName) {
  databaseUsers.find({ _id: `${_id}` }, (err, docs) => {
    if (docs[0] != null && docs[0] !== undefined) {
      try {
        const sockets = docs[0].users.socketId;
        const numbers = docs[0].users.userNumber;
        const users = docs[0].users.userName;
        const colors = docs[0].users.userColor;
        const points = docs[0].users.userPoints;
        const leaderNum = docs[0].users.userNumber[0];
        const leaderName = docs[0].users.userName[0];

        const { gameStatus } = docs[0];
        const { gameRound } = docs[0];

        const numberOfUserPainting = docs[0].userTurn;
        const userNumberOfThePainter =
          docs[0].users.userNumber[numberOfUserPainting];
        // Send users and room info

        if (gameStatus === "waiting Room") {
          if (newLeaderNum === undefined) {
            sendUsersToRoom(
              _id,
              sockets,
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
              sockets,
              numbers,
              users,
              colors,
              points,
              leaderNum,
              leaderName
            );
          }
        } else if (gameStatus === "Painting") {
          io.in(_id).emit("round", gameRound);
          io.to(_id).emit("startGame");
          sendUsersToRoom(_id, sockets, numbers, users, colors, points);
          io.to(_id).emit("userPainting", userNumberOfThePainter);

          // Get Painting
        } else if (gameStatus === "ratingPaint") {
          io.in(_id).emit("round", gameRound);
          io.to(_id).emit("startGame");
          databaseRooms.find({ _id: `${_id}` }, (err, docs2) => {
            if (docs2[0] != null && docs2[0] !== undefined) {
              const wordPaintedNum = docs2[0].paint.words.length - 1;
              const wordPainted = docs2[0].paint.words[wordPaintedNum];
              const lastCanvasPainted = docs2[0].paint.canvas.length - 1;
              const canvasPainted = docs2[0].paint.canvas[lastCanvasPainted];
              io.in(_id).emit("rateCanvas", canvasPainted, wordPainted);

              sendUsersToRoom(_id, sockets, numbers, users, colors, points);
            } else {
              return err;
            }
          });
        } else if (gameStatus === "viewing Score") {
          io.in(_id).emit("round", gameRound);
          io.to(_id).emit("startGame");
          databaseRooms.find({ _id: `${_id}` }, (err, docs2) => {
            if (docs2[0] != null && docs2[0] !== undefined) {
              const wordPaintedNum = docs2[0].paint.words.length - 1;
              const wordPainted = docs2[0].paint.words[wordPaintedNum];
              const lastCanvasPainted = docs2[0].paint.canvas.length - 1;
              const canvasPainted = docs2[0].paint.canvas[lastCanvasPainted];
              const canvasRateNum = docs2[0].paint.canvasPoints.length - 1;
              const sumedPoints = docs2[0].paint.canvasPoints[canvasRateNum];
              io.in(_id).emit("rateCanvas", canvasPainted, wordPainted);
              io.in(_id).emit("canvasRate", sumedPoints);
              io.in(_id).emit("sendRate");
            } else {
              return err;
            }
          });

          sendUsersToRoom(_id, sockets, numbers, users, colors, points);
        } else if (gameStatus === "Final") {
          io.to(_id).emit("startGame");
          sendResultsOfTheMatch(_id);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      return err;
    }
  });
}

module.exports = {
  updateRoomUsers,
};
