const {
  databaseRooms,
  databaseUsers,
  createRoom,
  userJoin,
} = require("../userHandeler/users");

function resetDB() {
  databaseRooms.remove({}, { multi: true }, (err, numRemoved) => {
    if (err) return err.console.log(err);
  });

  databaseUsers.remove({}, { multi: true }, (err, numRemoved) => {
    if (err) return err.console.log(err);
  });

  databaseUsers.persistence.compactDatafile();
  databaseRooms.persistence.compactDatafile();
}

module.exports = {
  resetDB,
};
