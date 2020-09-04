//  Data Base
const Datastore = require("nedb");

const databaseRooms = new Datastore("./src/server/Utils/DataBases/rooms.db");
databaseRooms.loadDatabase();

const databaseUsers = new Datastore("./src/server/Utils/DataBases/users.db");
databaseUsers.loadDatabase();
//  Data Base

function createRoom(_id, Room, Code) {
  const roomCreate = {
    _id,
    Room,
    Code,
  };

  const userCreate = {
    _id,
    softReset: false,
    gameStatus: "waiting Room",
    gameRound: 1,
    userTurn: 0,
    usersRight: 0,
    word: "",
  };

  databaseRooms.insert(roomCreate);
  databaseUsers.insert(userCreate);

  databaseUsers.update(
    { _id: `${roomCreate._id}` },
    {
      $set: {
        "users.socketId": [],
        "users.userNumber": [],
        "users.userName": [],
        "users.userColor": [],
        "users.userPoints": [],
      },
      $set: {
        "canvasPionts.paintPlus": [],
      },
    }
  );

  databaseRooms.update(
    { _id: `${roomCreate._id}` },
    {
      $set: {
        "paint.canvas": [],
        "paint.users": [],
        "paint.colors": [],
        "paint.canvasPoints": [],
        "paint.words": [],
      },
    }
  );

  databaseUsers.persistence.compactDatafile();
  databaseRooms.persistence.compactDatafile();

  return roomCreate;
}

// Join user to chat
function userJoin(id, _id, userNumber, userName, userColor) {
  const user = { id, _id, userNumber, userName, userColor };

  databaseUsers.update(
    { _id: `${user._id}` },
    {
      $push: {
        "users.socketId": user.id,
        "users.userNumber": user.userNumber,
        "users.userName": `${user.userName}`,
        "users.userColor": `${user.userColor}`,
        "users.userPoints": 0,
      },
    }
  );

  databaseUsers.persistence.compactDatafile();

  return user;
}

module.exports = {
  databaseRooms,
  databaseUsers,
  createRoom,
  userJoin,
};
