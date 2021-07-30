const { databaseRooms } = require("../userHandeler/users");

function returnWordsArray(_id, words, wordsLastChar) {
  words.splice(wordsLastChar, 1);

  databaseRooms.update(
    { _id: `${_id}` },
    {
      $set: {
        "paint.words": words,
      },
    }
  );

  databaseRooms.persistence.compactDatafile();
}

function elimnWord(_id) {
  databaseRooms.find({ _id: `${_id}` }, (err, docs) => {
    if (docs[0] != null && docs[0] !== undefined) {
      try {
        const { words } = docs[0].paint;
        const wordsLastChar = docs[0].paint.words.length - 1;

        returnWordsArray(_id, words, wordsLastChar);
      } catch (error) {
        console.log(error);
      }
    } else {
      return err;
    }
  });
}

module.exports = {
  elimnWord,
};
