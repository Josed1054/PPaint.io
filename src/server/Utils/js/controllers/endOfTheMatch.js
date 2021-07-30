const { databaseUsers } = require("../userHandeler/users");
const { playingGame } = require("./playingGame");
const { sendResultsOfTheMatch } = require("./sendResultsOfTheMatch");

function endOfTheMatch(socket, _id, end, absoluteUrl) {
  databaseUsers.find({ _id: `${_id}` }, (err, docs) => {
    if (docs[0] != null && docs[0] !== undefined) {
      try {
        if (end === "natural") {
          const { gameRound } = docs[0];

          if (gameRound <= 3) {
            const { userTurn } = docs[0];
            const users = docs[0].users.userName;

            if (userTurn < users.length - 1) {
              const userTurn1Plus = Number(userTurn + 1);
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
            } else if (userTurn === users.length - 1 && gameRound === 3) {
              databaseUsers.update(
                { _id: `${_id}` },
                {
                  $set: {
                    softReset: false,
                    gameStatus: "Final",
                  },
                }
              );
              sendResultsOfTheMatch(_id);
            } else if (userTurn === users.length - 1) {
              const gameRound1Plus = Number(gameRound + 1);
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
        } else if (end === "forced") {
          const { gameRound } = docs[0];

          const canvasAction = "eraseCanvas";
          socket.to(_id).emit("canvasXYs", canvasAction);

          if (gameRound <= 3) {
            const { userTurn } = docs[0];
            const users = docs[0].users.userName;

            if (userTurn < users.length) {
              playingGame(_id, absoluteUrl);
            } else if (userTurn >= users.length && gameRound === 3) {
              databaseUsers.update(
                { _id: `${_id}` },
                {
                  $set: {
                    softReset: false,
                    gameStatus: "Final",
                  },
                }
              );
              sendResultsOfTheMatch(_id);
            } else if (userTurn >= users.length - 1) {
              const userTurn0 = 0;
              const gameRound1Plus = Number(gameRound + 1);
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
    } else {
      return err;
    }
  });
}

module.exports = {
  endOfTheMatch,
};
