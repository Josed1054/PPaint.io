export function checkUserData(room) {
  if (room == null || room == "null") window.location.replace("./");
}

export function eraseUserData() {
  sessionStorage.setItem("userColor", null);
  sessionStorage.setItem("userName", null);
  sessionStorage.setItem("userNumber", null);
  sessionStorage.setItem("room", null);
  sessionStorage.setItem("code", null);
}

export function senUserToHome() {
  window.location.replace("./");
}
