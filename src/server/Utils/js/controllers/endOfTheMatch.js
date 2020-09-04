const { databaseUsers } = require("../userHandeler/users");
const { playingGame } = require("../controllers/playingGame");
const {
  sendResultsOfTheMatch,
} = require("../controllers/sendResultsOfTheMatch");

function endOfTheMatch(socket, _id, end, absoluteUrl) {
  databaseUsers.find({ _id: `${_id}` }, (err, docs) => {
    if (docs[0] == null) {
      return err;
    } else {
      try {
        if (end == "natural") {
          let gameRound = docs[0].gameRound;

          if (gameRound <= 3) {
            let userTurn = docs[0].userTurn;
            let users = docs[0].users.userName;

            if (userTurn < users.length - 1) {
              let userTurn1Plus = Number(userTurn + 1);
              databaseUsers.update(
                { _id: `${_id}` },
                {
                  $set: {
                    userTurn: userTurn1Plus,
                  },
                }
              );

              databaseUsers.persistence.compactDatafile();

              playingGame(_id, absoluteUrl);
            } else if (userTurn == users.length - 1 && gameRound == 3) {
              databaseUsers.update(
                { _id: `${_id}` },
                {
                  $set: {
                    softReset: false,
                    gameStatus: "Final",
                  },
                }
              );
              console.log("set softReset = false");
              sendResultsOfTheMatch(_id);
            } else if (userTurn == users.length - 1) {
              let gameRound1Plus = Number(gameRound + 1);
              databaseUsers.update(
                { _id: `${_id}` },
                {
                  $set: {
                    userTurn: 0,
                    gameRound: gameRound1Plus,
                  },
                }
              );

              databaseUsers.persistence.compactDatafile();

              playingGame(_id, absoluteUrl);
            }
          }
        } else if (end == "forced") {
          let gameRound = docs[0].gameRound;

          let canvasAction = "eraseCanvas";
          socket.to(_id).emit("canvasXYs", canvasAction);

          if (gameRound <= 3) {
            let userTurn = docs[0].userTurn;
            let users = docs[0].users.userName;

            if (userTurn < users.length) {
              playingGame(_id, absoluteUrl);
            } else if (userTurn >= users.length && gameRound == 3) {
              databaseUsers.update(
                { _id: `${_id}` },
                {
                  $set: {
                    softReset: false,
                    gameStatus: "Final",
                  },
                }
              );
              console.log("set softReset = false");
              sendResultsOfTheMatch(_id);
            } else if (userTurn >= users.length - 1) {
              let userTurn0 = 0;
              let gameRound1Plus = Number(gameRound + 1);
              databaseUsers.update(
                { _id: `${_id}` },
                {
                  $set: {
                    userTurn: userTurn0,
                    gameRound: gameRound1Plus,
                  },
                }
              );

              databaseUsers.persistence.compactDatafile();

              playingGame(_id, absoluteUrl);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
}

module.exports = {
  endOfTheMatch,
};
