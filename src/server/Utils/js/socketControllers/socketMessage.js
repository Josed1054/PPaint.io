const { io } = require("../../../server");
const { databaseUsers } = require("../userHandeler/users");
const { updateRoomUsers } = require("../controllers/updateRoomUsers");

function spliceScore(_id, scores, elId, newUserScore, usersRightPlusOne) {
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

function socketMessage(
  socket,
  msg,
  _id,
  gameStatus,
  msgTime,
  userName,
  userColor
) {
  if (gameStatus === "Painting") {
    databaseUsers.find({ _id: `${_id}` }, (err, docs) => {
      if (docs[0] != null && docs[0] !== undefined) {
        try {
          let secretWord = docs[0].word;

          secretWord = secretWord.replace(/[àáâãäå]/g, "a");
          secretWord = secretWord.replace(/[èéêë]/g, "e");
          secretWord = secretWord.replace(/[ìíîï]/g, "i");
          secretWord = secretWord.replace(/[òóôõö]/g, "o");
          secretWord = secretWord.replace(/[ùúûü]/g, "u");

          let newMsg = msg.replace(/[àáâãäå]/g, "a");
          newMsg = msg.replace(/[èéêë]/g, "e");
          newMsg = msg.replace(/[ìíîï]/g, "i");
          newMsg = msg.replace(/[òóôõö]/g, "o");
          newMsg = msg.replace(/[ùúûü]/g, "u");

          const msgLower = newMsg.toLowerCase();

          const ifTheWordHasUnderScore = secretWord.indexOf(`${msgLower}`);

          if (
            ifTheWordHasUnderScore === 0 &&
            secretWord.length === newMsg.length
          ) {
            io.to(socket.id).emit("disableChat");

            io.in(_id).emit("message", `${userName} got it`, userColor);

            const arrayDeIds = docs[0].users.socketId;
            const elId = arrayDeIds.indexOf(`${socket.id}`);
            const scores = docs[0].users.userPoints;
            const userScore = scores[elId];

            const actualScore = msgTime / 10;

            const newUserScore =
              userScore + Number(`${actualScore.toFixed(0)}`);

            const usersRightPlusOne = Number(docs[0].usersRight) + 1;

            if (usersRightPlusOne === arrayDeIds.length - 1) {
              const { userTurn } = docs[0];
              io.to(arrayDeIds[userTurn]).emit("allPlayersRight");
            }

            spliceScore(_id, scores, elId, newUserScore, usersRightPlusOne);

            databaseUsers.persistence.compactDatafile();

            updateRoomUsers(_id);
          } else {
            io.to(_id).emit("message", `${userName}: ${newMsg}`, userColor);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        return err;
      }
    });
  } else {
    io.to(_id).emit("message", `${userName}: ${msg}`, userColor);
  }
}

module.exports = {
  socketMessage,
};
