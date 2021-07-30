/* eslint-disable no-unused-expressions */
const {
  createRoomController,
  joinRoomController,
} = require("../controllers/routeControllers");

function expressRouteCreate(request, response) {
  const data = request.body;
  const { inputType } = data;

  const RESPONSE_REDIRECT = {
    create: () => createRoomController(request, response),
    join: () => joinRoomController(request, response),
  };

  RESPONSE_REDIRECT[inputType]
    ? RESPONSE_REDIRECT[inputType]()
    : response.redirect("/")();
}

module.exports = {
  expressRouteCreate,
};
