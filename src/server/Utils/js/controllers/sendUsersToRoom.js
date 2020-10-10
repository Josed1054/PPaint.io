const { io } = require("../../../server");

function sendUsersToRoom(
  _id,
  sockets,
  numbers,
  users,
  colors,
  points,
  leaderNum,
  leaderName
) {
  sockets.forEach((socket) => {
    io.to(socket).emit("roomUsers", {
      numbers,
      users,
      colors,
      points,
      leaderNum,
      leaderName,
    });
  });
}

module.exports = {
  sendUsersToRoom,
};
