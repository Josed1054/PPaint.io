const { userJoin } = require("../userHandeler/users");
const { updateRoomUsers } = require("../controllers/updateRoomUsers");
const { databaseUsers } = require("../userHandeler/users");

function rejoinUser(socket, _id, userNumber, userName, userColor) {
  if (userNumber == 0) {
    userJoin(socket.id, _id, userNumber, userName, userColor);
    socket.emit("userNumber", userNumber);
    updateRoomUsers(_id);
  } else {
    databaseUsers.find({ _id: `${_id}` }, (err, docs) => {
      if (docs[0] == null) {
        return err;
      } else if (docs[0] !== null) {
        const getLastNumArray = docs[0].users.userNumber.length - 1;
        const getLastNum = docs[0].users.userNumber[getLastNumArray];
        const uno = 1;
        const userNumber = getLastNum + uno;

        userJoin(socket.id, _id, userNumber, userName, userColor);
        socket.emit("userNumber", userNumber);

        updateRoomUsers(_id);
      }
    });
  }
}

module.exports = {
  rejoinUser,
};
