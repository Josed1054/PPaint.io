const { io } = require("../../../server");
const { databaseUsers } = require("../userHandeler/users");
const { updateRoomUsers } = require("../controllers/updateRoomUsers");

function socketMessage(
  socket,
  msg,
  _id,
  gameStatus,
  msgTime,
  userName,
  userColor
) {
  if (gameStatus == "Painting") {
    databaseUsers.find({ _id: `${_id}` }, (err, docs) => {
      if (docs[0] == null) {
        return err;
      } else {
        try {
          let secretWord = docs[0].word;

          secretWord = secretWord.replace(/[àáâãäå]/g, "a");
          secretWord = secretWord.replace(/[èéêë]/g, "e");
          secretWord = secretWord.replace(/[ìíîï]/g, "i");
          secretWord = secretWord.replace(/[òóôõö]/g, "o");
          secretWord = secretWord.replace(/[ùúûü]/g, "u");

          msg = msg.replace(/[àáâãäå]/g, "a");
          msg = msg.replace(/[èéêë]/g, "e");
          msg = msg.replace(/[ìíîï]/g, "i");
          msg = msg.replace(/[òóôõö]/g, "o");
          msg = msg.replace(/[ùúûü]/g, "u");

          let msgLower = msg.toLowerCase();

          if (secretWord == msgLower || msgLower == secretWord) {
            io.to(socket.id).emit("disableChat");

            io.in(_id).emit("message", `${userName} got it`, userColor);

            let arrayDeIds = docs[0].users.socketId;
            let elId = arrayDeIds.indexOf(`${socket.id}`);
            let scores = docs[0].users.userPoints;
            let userScore = scores[elId];

            let actualScore = msgTime / 10;

            let newUserScore = userScore + Number(`${actualScore.toFixed(0)}`);

            let usersRight = docs[0].usersRight;
            let uno = 1;
            let usersRightPlusOne = usersRight + uno;

            if (usersRightPlusOne == arrayDeIds.length - 1) {
              let userTurn = docs[0].userTurn;
              io.to(arrayDeIds[userTurn]).emit("allPlayersRigth");
            }

            spliceScore();
            function spliceScore() {
              if (elId > -1) {
                scores.splice(elId, 1, newUserScore);

                databaseUsers.update(
                  { _id: `${_id}` },
                  {
                    $set: {
                      "users.userPoints": scores,
                      usersRight: usersRightPlusOne,
                    },
                  }
                );
              }
            }

            databaseUsers.persistence.compactDatafile();

            updateRoomUsers(_id);
          } else {
            io.to(_id).emit("message", `${userName}: ${msg}`, userColor);
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  } else {
    io.to(_id).emit("message", `${userName}: ${msg}`, userColor);
  }
}

module.exports = {
  socketMessage,
};
