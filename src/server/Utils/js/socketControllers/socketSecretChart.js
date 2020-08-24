function socketSecretChart(socket, _id, backSlash) {
  socket.to(_id).emit("secretChart", backSlash);
}

module.exports = {
  socketSecretChart,
};
