function socket60sec(socket, _id, seconds) {
  socket.to(_id).emit("broadcastedTime60", seconds);
}

module.exports = {
  socket60sec,
};
