const {
  databaseRooms,
  databaseUsers,
  createRoom,
  userJoin,
} = require("../userHandeler/users");

function createRoomController(request, response) {
  const data = request.body;

  let _id = `${data.createRoomName}${data.createRoomCode}`;

  databaseRooms.find({ _id: `${_id}` }, (err, docs) => {
    if (docs[0] == null) {
      let _id = `${data.createRoomName}${data.createRoomCode}`;
      let room = data.createRoomName;
      let code = data.createRoomCode;

      response.json({
        status: "Room Created",
      });
      createRoom(_id, room, code);
    } else if (docs[0] !== null) {
      response.json({
        status: "Room Already Created",
      });
    }
  });
}

function joinRoomController(request, response) {
  const data = request.body;

  let _id = `${data.joinRoomName}${data.joinRoomCode}`;

  databaseUsers.find({ _id: `${_id}` }, (err, docs) => {
    if (docs[0] == null) {
      response.json({ status: "No Room Found" });
    } else {
      try {
        response.json({ status: "Room Found" });
      } catch (error) {
        response.json({ status: `Error: ${error}, please try again` });
      }
    }
  });
}

module.exports = {
  createRoomController,
  joinRoomController,
};
