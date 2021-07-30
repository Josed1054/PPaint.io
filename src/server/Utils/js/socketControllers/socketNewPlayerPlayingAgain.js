const { databaseUsers } = require("../userHandeler/users");

const { rejoinUser } = require("../controllers/rejoinUser");
const {
  softResetRoomForPlayAgain,
} = require("../controllers/softResetRoomForPlayAgain");

function socketNewPlayerPlayingAgain(socket, _id, userName, userColor) {
  databaseUsers.find({ _id: `${_id}` }, (err, docs) => {
    if (docs[0] != null && docs[0] !== undefined) {
      const checkIfHasAllreadySoftReseted = docs[0].softReset;
      if (checkIfHasAllreadySoftReseted === false) {
        softResetRoomForPlayAgain(_id);
        rejoinUser(socket, _id, 0, userName, userColor);
      } else {
        rejoinUser(socket, _id, -1, userName, userColor);
      }
    } else {
      return err;
    }
  });
}

module.exports = {
  socketNewPlayerPlayingAgain,
};
