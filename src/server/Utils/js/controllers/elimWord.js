const { databaseRooms } = require("../userHandeler/users");

function elimnWord(_id) {
  databaseRooms.find({ _id: `${_id}` }, (err, docs) => {
    if (docs[0] == null) {
      return err;
    } else if (docs[0] !== null) {
      try {
        let words = docs[0].paint.words;
        let wordsLastChar = docs[0].paint.words.length - 1;

        returnWordsArray();
        function returnWordsArray() {
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
      } catch (error) {
        console.log(error);
      }
    }
  });
}

module.exports = {
  elimnWord,
};
