const { io } = require("../../../server");
const { databaseRooms, databaseUsers } = require("../userHandeler/users");
const { updateRoomUsers } = require("../controllers/updateRoomUsers");

function getTheRate(_id, action) {
  databaseUsers.find({ _id: `${_id}` }, (err, docs) => {
    if (docs[0] == null) {
      return err;
    } else {
      try {
        if (action === true) {
          let rates = docs[0].canvasPionts.paintPlus;
          let usersRating = docs[0].users.userNumber.length;

          let rateCero = 0;

          rates.forEach((rate) => {
            rateCero = rateCero + rate;
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
          let userTurn = docs[0].userTurn;
          let rates = docs[0].canvasPionts.paintPlus;
          let usersRating = docs[0].users.userNumber.length;

          let rateCero = 0;

          rates.forEach((rate) => {
            rateCero = rateCero + rate;
          });

          let sumedPoints = rateCero / usersRating;
          sumedPoints = Number(`${sumedPoints.toFixed(0)}`);

          let scores = docs[0].users.userPoints;
          let painterScore = docs[0].users.userPoints[userTurn];

          let newPainterScore = painterScore + sumedPoints;

          spliceScore();
          function spliceScore() {
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
    }
  });
}

module.exports = {
  getTheRate,
};
