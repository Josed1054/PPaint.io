const { io } = require("../../../server");
const { databaseRooms, databaseUsers } = require("../userHandeler/users");
const { updateRoomUsers } = require("./updateRoomUsers");

function spliceScore(_id, userTurn, scores, newPainterScore) {
  if (userTurn > -1) {
    scores.splice(userTurn, 1, newPainterScore);

    databaseUsers.update(
      { _id: `${_id}` },
      {
        $set: {
          "users.userPoints": scores,
        },
      }
    );
  }
}

function getTheRate(_id, action) {
  databaseUsers.find({ _id: `${_id}` }, (err, docs) => {
    if (docs[0] != null && docs[0] !== undefined) {
      try {
        if (action === true) {
          const rates = docs[0].canvasPionts.paintPlus;
          const usersRating = docs[0].users.userNumber.length;

          let rateCero = 0;

          rates.forEach((rate) => {
            rateCero += rate;
          });

          let sumedPoints = rateCero / usersRating;
          sumedPoints = Number(`${sumedPoints.toFixed(0)}`);

          io.in(_id).emit("canvasRate", sumedPoints);

          databaseRooms.update(
            { _id: `${_id}` },
            {
              $push: {
                "paint.canvasPoints": sumedPoints,
              },
            }
          );

          databaseRooms.persistence.compactDatafile();
        } else if (action === false) {
          const { userTurn } = docs[0];
          const rates = docs[0].canvasPionts.paintPlus;
          const usersRating = docs[0].users.userNumber.length;

          let rateCero = 0;

          rates.forEach((rate) => {
            rateCero += rate;
          });

          let sumedPoints = rateCero / usersRating;
          sumedPoints = Number(`${sumedPoints.toFixed(0)}`);

          const scores = docs[0].users.userPoints;
          const painterScore = docs[0].users.userPoints[userTurn];

          const newPainterScore = painterScore + sumedPoints;

          spliceScore(_id, userTurn, scores, newPainterScore);

          databaseUsers.persistence.compactDatafile();

          updateRoomUsers(_id);

          io.in(_id).emit("canvasRate", sumedPoints);

          databaseRooms.update(
            { _id: `${_id}` },
            {
              $push: {
                "paint.canvasPoints": sumedPoints,
              },
            }
          );

          databaseRooms.persistence.compactDatafile();
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
  getTheRate,
};
