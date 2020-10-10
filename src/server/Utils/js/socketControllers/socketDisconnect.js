const { io } = require("../../../server");
const { databaseUsers } = require("../userHandeler/users");
const { endOfTheMatch } = require("../controllers/endOfTheMatch");
const { elimnWord } = require("../controllers/elimWord");
const { erraseRoom } = require("../controllers/erraseRoom");
const { updateRoomUsers } = require("../controllers/updateRoomUsers");

function socketDisconnect(socket, socketId, absoluteUrl) {
  databaseUsers.find({ "users.socketId": `${socketId}` }, (err, docs) => {
    if (docs[0] == null) {
      socket.emit("bruh", "connection error, please relogin");
      return err;
    }

    if (docs[0] !== null) {
      try {
        let arrayDeIds = docs[0].users.socketId;
        let elArray = arrayDeIds.indexOf(`${socket.id}`);
        let _id = docs[0]._id;
        let userNumber = docs[0].users.userNumber[elArray];
        let userName = docs[0].users.userName[elArray];
        let userColor = docs[0].users.userColor[elArray];

        let userNames = docs[0].users.userName;
        let userColors = docs[0].users.userColor;
        let userPoints = docs[0].users.userPoints;

        let newLeaderNum = docs[0].users.userNumber[1];
        let newLeaderName = docs[0].users.userName[1];

        let leaderNum = docs[0].users.userNumber[0];

        let userTurn = docs[0].userTurn;
        let numTurn = docs[0].users.userNumber[userTurn];

        let gameStatus = docs[0].gameStatus;

        databaseUsers.update(
          { _id: `${_id}` },
          {
            $pull: {
              "users.socketId": socket.id,
              "users.userNumber": userNumber,
            },
          }
        );

        retunrColorsArray(elArray);

        checkIfIsAnUserBef();
        function checkIfIsAnUserBef() {
          if (userNumber < numTurn) {
            let userTurn1Less = Number(userTurn - 1);
            databaseUsers.update(
              { _id: `${_id}` },
              {
                $set: {
                  userTurn: userTurn1Less,
                },
              }
            );

            databaseUsers.persistence.compactDatafile();
          }
        }

        function retunrColorsArray(elArray) {
          if (elArray > -1) {
            userNames.splice(elArray, 1);
            userColors.splice(elArray, 1);
            userPoints.splice(elArray, 1);

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
          }
        }

        databaseUsers.persistence.compactDatafile();

        let checkIf = arrayDeIds.length;

        io.to(_id).emit("message", `${userName} has left the chat`, userColor);

        // Send users and room info
        if (userNumber === leaderNum && gameStatus == "waiting Room") {
          updateRoomUsers(_id, newLeaderNum, newLeaderName);
        } else if (elArray === userTurn && gameStatus == "Painting") {
          let end = "forced";
          updateRoomUsers(_id);
          endOfTheMatch(socket, _id, end, absoluteUrl);
          elimnWord(_id);
        } else if (elArray === userTurn && gameStatus == "ratingPaint") {
          updateRoomUsers(_id);
          if (userTurn >= arrayDeIds.length - 1) {
            socket.to(arrayDeIds[0]).emit("continueCounting15sec");
          } else if (userTurn < arrayDeIds.length - 1) {
            socket.to(arrayDeIds[userTurn + 1]).emit("continueCounting15sec");
          }
        } else if (elArray === userTurn && gameStatus == "viewing Score") {
          updateRoomUsers(_id);
          if (userTurn >= arrayDeIds.length - 1) {
            socket.to(arrayDeIds[0]).emit("continueCounting10sec");
          } else {
            socket.to(arrayDeIds[userTurn + 1]).emit("continueCounting10sec");
          }
        } else {
          updateRoomUsers(_id);
        }

        erraseRoom(_id, checkIf);
      } catch (error) {
        console.log(error);
      }
    }
  });
}

module.exports = {
  socketDisconnect,
};
