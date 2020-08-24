function socketCanvasXY(
  socket,
  canvasAction,
  loc,
  strokesColorEmit,
  strokesWidthEmit,
  _id,
  userName,
  userColor
) {
  socket
    .to(_id)
    .emit(
      "canvasXYs",
      canvasAction,
      loc,
      strokesColorEmit,
      strokesWidthEmit,
      _id,
      userName,
      userColor
    );
}

module.exports = {
  socketCanvasXY,
};
