const { userJoin } = require("../userHandeler/users");
const { updateRoomUsers } = require("./updateRoomUsers");
const { databaseUsers } = require("../userHandeler/users");

function rejoinUser(socket, _id, userNumber, userName, userColor) {
  if (userNumber === 0) {
    userJoin(socket.id, _id, userNumber, userName, userColor);
    socket.emit("userNumber", userNumber);
    updateRoomUsers(_id);
  } else {
    databaseUsers.find({ _id: `${_id}` }, (err, docs) => {
      if (docs[0] != null && docs[0] !== undefined) {
        const newUserNumber =
          Number(
            docs[0].users.userNumber[docs[0].users.userNumber.length - 1]
          ) + 1;

        userJoin(socket.id, _id, newUserNumber, userName, userColor);
        socket.emit("userNumber", newUserNumber);

        updateRoomUsers(_id);
      } else {
        return err;
      }
    });
  }
}

module.exports = {
  rejoinUser,
};
