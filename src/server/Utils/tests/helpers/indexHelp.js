const fetch = require("node-fetch");

async function fetchEndPoints({
  btnGender,
  createRoomName,
  createRoomCode,
  joinRoomName,
  joinRoomCode,
}) {
  const data = {
    btnGender,
    createRoomName,
    createRoomCode,
    joinRoomName,
    joinRoomCode,
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const responseCreate = await fetch("http://localhost:3000/Join", options);
  const responseJson = await responseCreate.json();

  return responseJson.status;
}

module.exports = {
  fetchEndPoints,
};
