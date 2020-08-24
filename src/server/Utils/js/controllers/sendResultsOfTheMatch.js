const { io } = require("../../../server");
const { databaseRooms, databaseUsers } = require("../userHandeler/users");

function sendResultsOfTheMatch(_id) {
  databaseUsers.find({ _id: `${_id}` }, (err, docs) => {
    if (docs[0] == null) {
      return err;
    } else {
      let numbers = docs[0].users.userNumber;
      let users = docs[0].users.userName;
      let colors = docs[0].users.userColor;
      let points = docs[0].users.userPoints;

      io.in(_id).emit("usersResume", numbers, users, colors, points);
    }
  });
  databaseRooms.find({ _id: `${_id}` }, (err, docs) => {
    if (docs[0] == null) {
      return err;
    } else {
      let canvas = docs[0].paint.canvas;
      let users = docs[0].paint.users;
      let colors = docs[0].paint.colors;
      let points = docs[0].paint.canvasPoints;
      let words = docs[0].paint.words;

      io.in(_id).emit("paintsResume", canvas, users, colors, points, words);
    }
  });
}

module.exports = {
  sendResultsOfTheMatch,
};
