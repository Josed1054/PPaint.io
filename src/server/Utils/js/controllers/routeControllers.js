const {
  databaseRooms,
  databaseUsers,
  createRoom,
} = require("../userHandeler/users");

function cleanData(value) {
  let newValue = value.replace(/[^\w\s]/gi, "");
  newValue = value.replace(/[ ]{2,}/gi, " ");
  newValue = value.replace(/(^\s*)|(\s*$)/gi, "");
  newValue = value.replace(/\n /, "\n");

  return newValue;
}

function createRoomController(request, response) {
  const data = request.body;

  if (
    data.createRoomName === "" ||
    data.createRoomName === null ||
    data.createRoomName === undefined ||
    data.createRoomCode === "" ||
    data.createRoomCode === null ||
    data.createRoomCode === undefined
  ) {
    response.json({
      status: "No data",
    });
  } else {
    data.createRoomName = cleanData(data.createRoomName);
    data.createRoomCode = cleanData(data.createRoomCode);

    const _id = `${data.createRoomName}${data.createRoomCode}`;

    databaseRooms.find({ _id: `${_id}` }, (err, docs) => {
      if (docs[0] == null) {
        const room = data.createRoomName;
        const code = data.createRoomCode;

        createRoom(_id, room, code);

        response.json({
          status: "Room Created",
        });
      } else if (docs[0] !== null) {
        response.json({
          status: "Room Already Created",
        });
      }
    });
  }
}

function joinRoomController(request, response) {
  const data = request.body;

  if (
    data.joinRoomName === "" ||
    data.joinRoomName === null ||
    data.joinRoomName === undefined ||
    data.joinRoomCode === "" ||
    data.joinRoomCode === null ||
    data.joinRoomCode === undefined
  ) {
    response.json({
      status: "No data",
    });
  } else {
    data.joinRoomName = cleanData(data.joinRoomName);
    data.joinRoomCode = cleanData(data.joinRoomCode);

    const _id = `${data.joinRoomName}${data.joinRoomCode}`;

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
}

module.exports = {
  createRoomController,
  joinRoomController,
};
