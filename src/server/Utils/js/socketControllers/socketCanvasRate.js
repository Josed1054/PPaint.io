const { databaseUsers } = require("../userHandeler/users");

function socketCanvasRate(_id, rate) {
  databaseUsers.update(
    { _id: `${_id}` },
    {
      $push: {
        "canvasPionts.paintPlus": rate,
      },
    }
  );

  databaseUsers.persistence.compactDatafile();
}

module.exports = {
  socketCanvasRate,
};
