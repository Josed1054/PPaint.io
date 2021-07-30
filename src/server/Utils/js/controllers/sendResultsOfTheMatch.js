const { io } = require("../../../server");
const { databaseRooms, databaseUsers } = require("../userHandeler/users");

function sendResultsOfTheMatch(_id) {
  databaseUsers.find({ _id: `${_id}` }, (err, docs) => {
    if (docs[0] != null) {
      const numbers = docs[0].users.userNumber;
      const users = docs[0].users.userName;
      const colors = docs[0].users.userColor;
      const points = docs[0].users.userPoints;

      io.in(_id).emit("usersResume", numbers, users, colors, points);
    } else {
      return err;
    }
  });
  databaseRooms.find({ _id: `${_id}` }, (err, docs) => {
    if (docs[0] != null) {
      const { canvas } = docs[0].paint;
      const { users } = docs[0].paint;
      const { colors } = docs[0].paint;
      const points = docs[0].paint.canvasPoints;
      const { words } = docs[0].paint;

      io.in(_id).emit("paintsResume", canvas, users, colors, points, words);
    } else {
      return err;
    }
  });
}

module.exports = {
  sendResultsOfTheMatch,
};
