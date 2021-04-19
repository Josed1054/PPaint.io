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

        let arrayOfWords = docs[0].indexOfWords;

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

            let index1 = Math.floor(Math.random() * 2881 + 1);
            let index2 = Math.floor(Math.random() * 2881 + 1);
            let index3 = Math.floor(Math.random() * 2881 + 1);
            word1 = rows[index1];
            word2 = rows[index2];
            word3 = rows[index3];

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
              word1 = word1.split("\r");
              word2 = word2.split("\r");
              word3 = word3.split("\r");

              word1 = word1[0];
              word2 = word2[0];
              word3 = word3[0];

              if (arrayOfWords.length == 0)
                return io
                  .to(socketIdOfUser)
                  .emit("chooseWord", word1, word2, word3);
              else {
                arrayOfWords.forEach((word) => {
                  if (word1 == word || word2 == word || word3 == word) {
                    return sendWords();
                  } else if (
                    word == arrayOfWords[arrayOfWords.length - 1] &&
                    word1 !== arrayOfWords[arrayOfWords.length - 1] &&
                    word2 !== arrayOfWords[arrayOfWords.length - 1] &&
                    word3 !== arrayOfWords[arrayOfWords.length - 1]
                  ) {
                    return io
                      .to(socketIdOfUser)
                      .emit("chooseWord", word1, word2, word3);
                  } else {
                    return sendWords();
                  }
                });
              }
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
