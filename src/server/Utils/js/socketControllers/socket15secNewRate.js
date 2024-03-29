const { io } = require("../../../server");
const { getTheRate } = require("../controllers/getTheRate");
const { databaseUsers } = require("../userHandeler/users");

function socket15secNewRate(_id, seconds) {
  if (seconds == 0) {
    databaseUsers.update(
      { _id: `${_id}` },
      {
        $set: {
          gameStatus: "viewing Score",
        },
      }
    );

    databaseUsers.persistence.compactDatafile();

    io.in(_id).emit("sendRate");
    setTimeout(function () {
      let notPlus = true;
      getTheRate(_id, notPlus);
    }, 2000);
  }
  io.in(_id).emit("broadcastedTime15Rate", seconds);
}

module.exports = {
  socket15secNewRate,
};
