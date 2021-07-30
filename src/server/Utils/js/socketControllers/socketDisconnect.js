const { io } = require("../../../server");
const { databaseUsers } = require("../userHandeler/users");
const { endOfTheMatch } = require("../controllers/endOfTheMatch");
const { elimnWord } = require("../controllers/elimWord");
const { erraseRoom } = require("../controllers/erraseRoom");
const { updateRoomUsers } = require("../controllers/updateRoomUsers");

function checkIfIsAnUserBef(_id, userNumber, numTurn, userTurn) {
  if (userNumber < numTurn) {
    const userTurn1Less = Number(userTurn) - 1;
    databaseUsers.update(
      { _id: `${_id}` },
      {
        $set: {
          userTurn: userTurn1Less,
        },
      }
    );
  }
}

function returnColorsArray(_id, elArray, userNames, userColors, userPoints) {
  if (elArray > -1) {
    databaseUsers.update(
      { _id: `${_id}` },
      {
        $set: {
          "users.userName": userNames,
          "users.userColor": userColors,
          "users.userPoints": userPoints,
        },
      }
    );

    databaseUsers.persistence.compactDatafile();
  }
}

function socketDisconnect(socket, socketId, absoluteUrl) {
  databaseUsers.find({ "users.socketId": `${socketId}` }, (err, docs) => {
    if (docs[0] != null && docs[0] !== undefined) {
      try {
        const arrayDeIds = docs[0].users.socketId;
        const elArray = arrayDeIds.indexOf(`${socketId}`);
        const { _id } = docs[0];
        const userNumber = docs[0].users.userNumber[elArray];
        const userName = docs[0].users.userName[elArray];
        const userColor = docs[0].users.userColor[elArray];

        const userNames = docs[0].users.userName;
        const userColors = docs[0].users.userColor;
        const { userPoints } = docs[0].users;

        const newLeaderNum = docs[0].users.userNumber[1];
        const newLeaderName = docs[0].users.userName[1];

        const leaderNum = docs[0].users.userNumber[0];

        const { userTurn } = docs[0];
        const numTurn = docs[0].users.userNumber[userTurn];

        const { gameStatus } = docs[0];

        databaseUsers.update(
          { _id: `${_id}` },
          {
            $pull: {
              "users.socketId": socketId,
              "users.userNumber": userNumber,
            },
          }
        );

        userNames.splice(elArray, 1);
        userColors.splice(elArray, 1);
        userPoints.splice(elArray, 1);

        checkIfIsAnUserBef(_id, userNumber, numTurn, userTurn);

        returnColorsArray(_id, elArray, userNames, userColors, userPoints);

        const checkIf = arrayDeIds.length;

        io.to(_id).emit("message", `${userName} has left the chat`, userColor);

        erraseRoom(_id, checkIf);

        // Send users and room info
        if (userNumber === leaderNum && gameStatus === "waiting Room") {
          updateRoomUsers(_id, newLeaderNum, newLeaderName);
        } else if (elArray === userTurn && gameStatus === "Painting") {
          const end = "forced";
          updateRoomUsers(_id);
          endOfTheMatch(socket, _id, end, absoluteUrl);
          elimnWord(_id);
        } else if (elArray === userTurn && gameStatus === "ratingPaint") {
          updateRoomUsers(_id);
          if (userTurn >= arrayDeIds.length - 1) {
            socket.to(arrayDeIds[0]).emit("continueCounting15sec");
          } else if (userTurn < arrayDeIds.length - 1) {
            socket.to(arrayDeIds[userTurn + 1]).emit("continueCounting15sec");
          }
        } else if (elArray === userTurn && gameStatus === "viewing Score") {
          updateRoomUsers(_id);
          if (userTurn >= arrayDeIds.length - 1) {
            socket.to(arrayDeIds[0]).emit("continueCounting10sec");
          } else {
            socket.to(arrayDeIds[userTurn + 1]).emit("continueCounting10sec");
          }
        } else {
          updateRoomUsers(_id);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      socket.emit("bruh", "connection error, please relogin");
      return err;
    }
  });
}

module.exports = {
  socketDisconnect,
};
