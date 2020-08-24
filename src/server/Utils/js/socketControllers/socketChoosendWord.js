const { databaseRooms, databaseUsers } = require("../userHandeler/users");

function socketChoosendWord(socket, _id, wordArray) {
  socket.broadcast.to(_id).emit("clear15secWord");

  databaseUsers.update(
    { _id: `${_id}` },
    {
      $set: {
        word: `${wordArray}`,
      },
    }
  );

  databaseRooms.update(
    { _id: `${_id}` },
    {
      $push: {
        "paint.words": `${wordArray}`,
      },
    }
  );

  databaseUsers.persistence.compactDatafile();
  databaseRooms.persistence.compactDatafile();
}

module.exports = {
  socketChoosendWord,
};
