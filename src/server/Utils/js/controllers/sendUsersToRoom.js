const { io } = require("../../../server");

function sendUsersToRoom(
  _id,
  numbers,
  users,
  colors,
  points,
  leaderNum,
  leaderName
) {
  io.to(_id).emit("roomUsers", {
    numbers: numbers,
    users: users,
    colors: colors,
    points: points,
    leaderNum: leaderNum,
    leaderName: leaderName,
  });
}

module.exports = {
  sendUsersToRoom,
};
