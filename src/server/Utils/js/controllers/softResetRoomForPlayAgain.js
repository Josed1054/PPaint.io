const { databaseRooms, databaseUsers } = require("../userHandeler/users");

function softResetRoomForPlayAgain(_id) {
  console.log("cleaning data bases");
  databaseUsers.update(
    { _id: `${_id}` },
    {
      $set: {
        "canvasPionts.paintPlus": [],
      },
      $set: {
        softReset: true,
      },
      $set: {
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
