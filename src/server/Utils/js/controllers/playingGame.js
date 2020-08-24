const fetch = require("node-fetch");
const { io } = require("../../../server");
const { updateRoomUsers } = require("../controllers/updateRoomUsers");
const { databaseUsers } = require("../userHandeler/users");

function playingGame(_id, absoluteUrl) {
  databaseUsers.find({ _id: `${_id}` }, (err, docs) => {
    if (docs[0] == null) {
      return err;
    } else if (docs[0] !== null) {
      try {
        let userTurn = docs[0].userTurn;

        let socketIdOfUser = docs[0].users.socketId[userTurn];

        let word1;
        let word2;
        let word3;

        sendWords();

        databaseUsers.update(
          { _id: `${_id}` },
          {
            $set: {
              gameStatus: "Painting",
            },
          }
        );

        updateRoomUsers(_id);

        async function sendWords() {
          try {
            const getWords = await fetch(
              `${absoluteUrl}/src/server/Utils/csv/justWords.csv`
            );
            const words = await getWords.text();

            const rows = words.split("\n");

            word1 = rows[Math.floor(Math.random() * 2881 + 1)];
            word2 = rows[Math.floor(Math.random() * 2881 + 1)];
            word3 = rows[Math.floor(Math.random() * 2881 + 1)];

            if (
              word1 == null ||
              word2 == null ||
              word3 == null ||
              word1 == undefined ||
              word2 == undefined ||
              word3 == undefined ||
              word1 == " " ||
              word2 == " " ||
              word3 == " "
            ) {
              sendWords();
            } else {
              io.to(socketIdOfUser).emit("chooseWord", word1, word2, word3);
            }
          } catch (error) {
            console.log(error);
          }
        }
        // Words
      } catch (error) {
        console.log(error);
      }
    }
  });
}

module.exports = {
  playingGame,
};
