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
  if (userNumber === -1) {
    databaseUsers.find({ _id: `${_id}` }, (err, docs) => {
      if (docs[0] != null && docs[0] !== undefined) {
        const getLastNumArray = docs[0].users.userNumber.length - 1;
        const newUserNumber =
          Number(docs[0].users.userNumber[getLastNumArray]) + 1;

        const user = userJoin(
          socket.id,
          _id,
          newUserNumber,
          userName,
          userColor
        );

        socket.emit("userNumber", newUserNumber);

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
      } else {
        return err;
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
