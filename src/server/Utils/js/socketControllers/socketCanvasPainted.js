const { databaseRooms, databaseUsers } = require("../userHandeler/users");
const { updateRoomUsers } = require("../controllers/updateRoomUsers");

function socketCanvasPainted(_id, userName, userColor, canvasPainted) {
  databaseUsers.update(
    { _id: `${_id}` },
    {
      $set: {
        gameStatus: "ratingPaint",
        usersRight: 0,
      },
    }
  );

  databaseRooms.update(
    { _id: `${_id}` },
    {
      $push: {
        "paint.canvas": canvasPainted,
        "paint.users": userName,
        "paint.colors": userColor,
      },
    }
  );

  updateRoomUsers(_id);
}

module.exports = {
  socketCanvasPainted,
};
