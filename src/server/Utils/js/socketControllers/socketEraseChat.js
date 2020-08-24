const { io } = require("../../../server");

function socketEraseChat(_id) {
  io.in(_id).emit("eraseChat");
}

module.exports = {
  socketEraseChat,
};
