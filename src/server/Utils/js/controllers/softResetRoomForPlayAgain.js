const { databaseRooms, databaseUsers } = require("../userHandeler/users");

function softResetRoomForPlayAgain(_id) {
  databaseUsers.update(
    { _id: `${_id}` },
    {
      $set: {
        softReset: true,
        gameStatus: "waiting Room",
        gameRound: 1,
        userTurn: 0,
        word: "",
        "canvasPionts.paintPlus": [],
        "users.socketId": [],
        "users.userNumber": [],
        "users.userName": [],
        "users.userColor": [],
        "users.userPoints": [],
      },
    }
  );

  databaseRooms.update(
    { _id: `${_id}` },
    {
      $set: {
        "paint.canvas": [],
        "paint.users": [],
        "paint.colors": [],
        "paint.canvasPoints": [],
        "paint.words": [],
      },
    }
  );

  databaseUsers.persistence.compactDatafile();
  databaseRooms.persistence.compactDatafile();
}

module.exports = {
  softResetRoomForPlayAgain,
};
