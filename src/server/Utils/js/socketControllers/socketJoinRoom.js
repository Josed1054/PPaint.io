const { userJoin } = require("../userHandeler/users");
const { databaseUsers } = require("../userHandeler/users");
const { updateRoomUsers } = require("../controllers/updateRoomUsers");

function socketJoinRoom(
  socket,
  _id,
  room,
  code,
  userNumber,
  userName,
  userColor
) {
  if (userNumber == -1) {
    databaseUsers.find({ _id: `${_id}` }, (err, docs) => {
      if (docs[0] == null) {
        return err;
      } else if (docs[0] !== null) {
        const getLastNumArray = docs[0].users.userNumber.length - 1;
        const getLastNum = docs[0].users.userNumber[getLastNumArray];
        const uno = 1;
        const userNumber = getLastNum + uno;

        const user = userJoin(socket.id, _id, userNumber, userName, userColor);

        socket.emit("userNumber", userNumber);

        socket.join(user._id);

        socket.emit("message", `${user.userName} welcome to PPaint`, userColor);

        socket
          .to(user._id)
          .emit(
            "message",
            `${user.userName} has joined the Game`,
            user.userColor
          );
        updateRoomUsers(_id);
      }
    });
  } else {
    const user = userJoin(socket.id, _id, userNumber, userName, userColor);

    socket.join(user._id);

    socket.emit("message", `${user.userName} welcome to PPaint`, userColor);

    socket
      .to(user._id)
      .emit("message", `${user.userName} has joined the Game`, user.userColor);
    updateRoomUsers(_id);
  }
}

module.exports = {
  socketJoinRoom,
};
