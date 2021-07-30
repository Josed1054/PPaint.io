const { databaseRooms, databaseUsers } = require("../userHandeler/users");

function erraseRoom(_id, checkIf) {
  if (checkIf === 1 || checkIf === 0 || checkIf === "" || checkIf === null) {
    databaseUsers.remove({ _id: `${_id}` }, {}, (err) => {
      if (err)
        return console.log("problemRemovingDocumentFromTheDataBase Users", err);
    });
    databaseRooms.remove({ _id: `${_id}` }, {}, (err) => {
      if (err)
        return console.log("problemRemovingDocumentFromTheDataBase Rooms", err);
    });

    databaseUsers.persistence.compactDatafile();
    databaseRooms.persistence.compactDatafile();
  }
}

module.exports = {
  erraseRoom,
};
