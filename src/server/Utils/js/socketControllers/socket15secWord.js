function socket15secWord(socket, _id, userName, seconds, userColor) {
  socket.to(_id).emit("messageWord", userName, seconds, userColor);
}

module.exports = {
  socket15secWord,
};
