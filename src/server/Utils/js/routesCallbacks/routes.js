const {
  createRoomController,
  joinRoomController,
  returnRoomController,
} = require("../controllers/routeControllers");

function expressRouteCreate(request, response) {
  const data = request.body;
  const btnGender = data.btnGender;

  if (data.btnGender == undefined) {
    return response.redirect("/");
  } else {
    if (btnGender == "create") {
      createRoomController(request, response);
    } else if (btnGender == "join") {
      joinRoomController(request, response);
    }
  }
}

module.exports = {
  expressRouteCreate,
};
