const fetch = require("node-fetch");
const { io } = require("../../../server");
const { updateRoomUsers } = require("./updateRoomUsers");
const { databaseUsers } = require("../userHandeler/users");

async function sendWords(absoluteUrl, arrayOfWords, socketIdOfUser) {
  try {
    const getWords = await fetch(
      `${absoluteUrl}/src/server/Utils/csv/justWords.csv`
    );
    const words = await getWords.text();

    const rows = words.split("\n");

    const index1 = Math.floor(Math.random() * 2881 + 1);
    const index2 = Math.floor(Math.random() * 2881 + 1);
    const index3 = Math.floor(Math.random() * 2881 + 1);
    let word1 = rows[index1];
    let word2 = rows[index2];
    let word3 = rows[index3];

    if (
      word1 == null ||
      word2 == null ||
      word3 == null ||
      word1 === undefined ||
      word2 === undefined ||
      word3 === undefined ||
      word1 === " " ||
      word2 === " " ||
      word3 === " "
    ) {
      sendWords();
    } else {
      word1 = word1.split("\r");
      word2 = word2.split("\r");
      word3 = word3.split("\r");

      [word1, word2, word3] = [word1[0], word2[0], word3[0]];

      //  arrayOfWords, socketIdOfUser, word1, word2, word3
      if (arrayOfWords.length > 0) {
        arrayOfWords.forEach((word) => {
          if (
            word === arrayOfWords[arrayOfWords.length - 1] &&
            word1 !== arrayOfWords[arrayOfWords.length - 1] &&
            word2 !== arrayOfWords[arrayOfWords.length - 1] &&
            word3 !== arrayOfWords[arrayOfWords.length - 1]
          ) {
            io.to(socketIdOfUser).emit("chooseWord", word1, word2, word3);
          } else if (word1 === word || word2 === word || word3 === word) {
            return sendWords();
          }
        });
      } else {
        return io.to(socketIdOfUser).emit("chooseWord", word1, word2, word3);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function playingGame(_id, absoluteUrl) {
  databaseUsers.find({ _id: `${_id}` }, (err, docs) => {
    if (docs[0] != null && docs[0] !== undefined) {
      try {
        const { userTurn } = docs[0];

        const socketIdOfUser = docs[0].users.socketId[userTurn];

        const arrayOfWords = docs[0].indexOfWords;

        sendWords(absoluteUrl, arrayOfWords, socketIdOfUser);

        databaseUsers.update(
          { _id: `${_id}` },
          {
            $set: {
              gameStatus: "Painting",
            },
          }
        );
        updateRoomUsers(_id);
        // Words
      } catch (error) {
        console.log(error);
      }
    } else {
      return err;
    }
  });
}

module.exports = {
  playingGame,
};
