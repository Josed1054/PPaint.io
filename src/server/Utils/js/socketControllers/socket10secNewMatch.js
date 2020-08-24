const { io } = require("../../../server");
const { databaseUsers } = require("../userHandeler/users");
const { endOfTheMatch } = require("../controllers/endOfTheMatch");

function socket10secNewMatch(socket, _id, seconds, absoluteUrl) {
  if (seconds == 0) {
    io.in(_id).emit("eraseRate");
    let end = "forced";

    databaseUsers.update(
      { _id: `${_id}` },
      {
        $set: {
          "canvasPionts.paintPlus": [],
        },
      }
    );

    databaseUsers.persistence.compactDatafile();

    endOfTheMatch(socket, _id, end, absoluteUrl);
  }
  io.in(_id).emit("broadcastedTime15Rate", seconds);
}

module.exports = {
  socket10secNewMatch,
};
