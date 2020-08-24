const { databaseUsers } = require("../userHandeler/users");

function socketStartGame(_id) {
  databaseUsers.update(
    { _id: `${_id}` },
    {
      $set: {
        gameStatus: "Painting",
      },
    }
  );

  databaseUsers.persistence.compactDatafile();
}

module.exports = {
  socketStartGame,
};
