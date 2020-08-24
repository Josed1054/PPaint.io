const colorProfile = document.querySelector(".color-one");

const $paintSvg = document.querySelectorAll(".paintSvg");

const $smilsad = document.querySelectorAll(".smilsad");

const $pathC = document.querySelectorAll(".pathC");
const $path1 = document.querySelector(".path1");
const $path2 = document.querySelector(".path2");
const $path3 = document.querySelector(".path3");
const $path4 = document.querySelector(".path4");
const $path5 = document.querySelector(".path5");

const $pathFace = document.querySelectorAll(".eyes");
const $pathFaceEye1 = document.querySelector(".eye1");
const $pathFaceEye2 = document.querySelector(".eye2");

const $pathAbstract = document.querySelectorAll(".abstract");
const $pathTriangle = document.querySelector(".triangle");
const $pathStar = document.querySelector(".star");
const $pathLoop = document.querySelector(".loop");
const $pathWave = document.querySelector(".wave");

const $drip = document.querySelectorAll(".drip");
const $drip1 = document.querySelector(".drip1");
const $drip2 = document.querySelector(".drip2");
const $point = document.querySelector(".point");

window.addEventListener("keyup", domSelectors);

const colors = [
  "#2b2c50",
  "#E072A4",
  "#DACC3E",
  "#BC2C1A",
  "#7D1538",
  "#8E6C88",
  "#28536B",
  "#A8763E",
  "#6CAE75",
  "#33CA7F",
];
let colorIndex = 0;

let selectedColor = colors[colorIndex];

colorProfile.style.backgroundColor = `${colors[colorIndex]}`;

$point.setAttribute("fill", `${colors[colorIndex]}`);

colorProfile.addEventListener("click", changeColor);

function changeColor(e) {
  domSelectors();

  if (colorIndex === colors.length - 1) {
    colorIndex = 0;
    colorProfile.style.backgroundColor = `${colors[0]}`;
    $point.setAttribute("fill", `${colors[0]}`);
  } else {
    colorIndex++;
    colorProfile.style.backgroundColor = `${colors[colorIndex]}`;
    $point.setAttribute("fill", `${colors[colorIndex]}`);
  }
  selectedColor = colors[colorIndex];
}

domSelectors();
function domSelectors() {
  let variableSmilsad = ["rotate", "top", "left", "scale"];
  let variableTool = ["rotate", "bottom", "right", "scale"];
  let variableFace = ["rotate", "bottom", "left", "scale"];
  let variablePaint = ["rotate", "top", "right", "scale"];

  setCssProps(
    "smilsadFace",
    variableSmilsad[Math.floor(Math.random() * 4 + 1 - 1)]
  );
  setCssProps("paintTool", variableTool[Math.floor(Math.random() * 4 + 1 - 1)]);
  setCssProps("svgFace", variableFace[Math.floor(Math.random() * 4 + 1 - 1)]);
  setCssProps(
    "abstractPaint",
    variablePaint[Math.floor(Math.random() * 4 + 1 - 1)]
  );

  $smilsad.forEach((sms) => {
    sms.setAttribute(
      "fill",
      `${colors[Math.floor(Math.random() * 9 + 1 - 1)]}`
    );
  });

  $drip1.setAttribute(
    "fill",
    `${colors[Math.floor(Math.random() * 9 + 1 - 1)]}`
  );
  $drip2.setAttribute(
    "fill",
    `${colors[Math.floor(Math.random() * 9 + 1 - 1)]}`
  );

  $pathC.forEach((path) => {
    path.setAttribute(
      "fill",
      `${colors[Math.floor(Math.random() * 9 + 1 - 1)]}`
    );
  });

  $pathFace.forEach((eye) => {
    eye.setAttribute(
      "fill",
      `${colors[Math.floor(Math.random() * 9 + 1 - 1)]}`
    );
  });

  $pathAbstract.forEach((abs) => {
    abs.setAttribute(
      "fill",
      `${colors[Math.floor(Math.random() * 9 + 1 - 1)]}`
    );
  });
}

function setCssProps(element, variable) {
  if (variable == "rotate") {
    document.querySelector(
      `.${element}`
    ).style.transform = `rotate(${Math.floor(Math.random() * 360)}deg)`;
  } else if (variable == "top") {
    document.querySelector(`.${element}`).style.top = `${Math.floor(
      Math.random() * 20
    )}%`;
  } else if (variable == "bottom") {
    document.querySelector(`.${element}`).style.bottom = `${Math.floor(
      Math.random() * 20
    )}%`;
  } else if (variable == "left") {
    document.querySelector(`.${element}`).style.left = `${Math.floor(
      Math.random() * 20
    )}%`;
  } else if (variable == "right") {
    document.querySelector(`.${element}`).style.right = `${Math.floor(
      Math.random() * 20
    )}%`;
  } else if (variable == "scale") {
    let scales = [0.5, 0.6, 0.8, 0.9, 1, 1.1];

    document.querySelector(`.${element}`).style.transform = `scale(${
      scales[Math.floor(Math.random() * 6 + 1 - 1)]
    })`;
  }
}

const dropDownJoin = document.querySelector(".dropDownJoin");
const joinInputs = document.querySelectorAll(".joinInput");
const dropDownCreate = document.querySelector(".dropDownCreate");
const createInputs = document.querySelectorAll(".createInput");

const labelJoin = document.querySelector(".labelJoin");
const labelCreate = document.querySelector(".labelCreate");

function clearJoin() {
  joinInputs.forEach((joinInput) => {
    joinInput.style.opacity = "0";
    joinInput.style.display = "none";
  });
}

function addJoin() {
  joinInputs.forEach((joinInput) => {
    joinInput.style.opacity = "100";
    joinInput.style.display = "block";
  });
  document.querySelector(".joinRoomName").focus();
}

function clearCreate() {
  createInputs.forEach((createInput) => {
    createInput.style.opacity = "0";
    createInput.style.display = "none";
  });
}

function addCreate() {
  createInputs.forEach((createInput) => {
    createInput.style.opacity = "100";
    createInput.style.display = "block";
  });
  document.querySelector(".createRoomName").focus();
}

clearJoin();
clearCreate();

let dropValue = "opened";
let dropValue2 = "opened";

labelJoin.addEventListener("click", (e) => {
  clear2();
  clickJoin();
});
dropDownJoin.addEventListener("click", (e) => {
  clear2();
  clickJoin();
});

labelCreate.addEventListener("click", (e) => {
  clear1();
  clickCreate();
});
dropDownCreate.addEventListener("click", (e) => {
  clear1();
  clickCreate();
});

function clickJoin() {
  if (dropValue == "closed") {
    dropDownJoin.style.transform = `rotate(360deg)`;
    clearJoin();
    return (dropValue = "opened");
  }
  if (dropValue == "opened") {
    dropDownJoin.style.transform = `rotate(180deg)`;
    addJoin();
    return (dropValue = "closed");
  }
}

function clickCreate() {
  if (dropValue2 == "closed") {
    dropDownCreate.style.transform = `rotate(360deg)`;
    clearCreate();
    return (dropValue2 = "opened");
  }
  if (dropValue2 == "opened") {
    dropDownCreate.style.transform = `rotate(180deg)`;
    addCreate();
    return (dropValue2 = "closed");
  }
}

function clear1() {
  if (dropValue && dropValue2)
    clearJoin(),
      (dropValue = "opened"),
      (dropDownJoin.style.transform = `rotate(360deg)`);
}

function clear2() {
  if (dropValue && dropValue2)
    clearCreate(),
      (dropValue2 = "opened"),
      (dropDownCreate.style.transform = `rotate(360deg)`);
}

const userName = document.getElementById("username");
userName.addEventListener("keyup", function () {
  setCharLimit(userName);
});

const btnJoin = document.querySelector(".btnJoin");
const btnCreate = document.querySelector(".btnCreate");

const joinRoomNameInput = document.getElementById("joinRoomName");
joinRoomNameInput.addEventListener("keyup", function () {
  setCharLimit(joinRoomNameInput);
});
const joinRoomCodeInput = document.getElementById("joinRoomCode");
joinRoomCodeInput.addEventListener("keyup", function () {
  setCharLimit(joinRoomCodeInput);
});
const createRoomNameInput = document.getElementById("createRoomName");
createRoomNameInput.addEventListener("keyup", function () {
  setCharLimit(createRoomNameInput);
});
const createRoomCodeInput = document.getElementById("createRoomCode");
createRoomCodeInput.addEventListener("keyup", function () {
  setCharLimit(createRoomCodeInput);
});

function setCharLimit(input) {
  let maxLength = 8;

  if (input.value.length > maxLength) {
    input.value = input.value.substring(0, maxLength);
  }
}

let userNameValue;
let joinRoomName;
let joinRoomCode;
let createRoomName;
let createRoomCode;

let btnGender;

let alreadyOpened = false;

document.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    if (!alreadyOpened) {
      if (dropValue == "opened" && dropValue2 == "opened") {
        clear2();
        clickJoin();
      } else {
        if (dropValue == "closed") {
          sendJoin();
        } else if (dropValue2 == "closed") {
          sendCreate();
        }
      }
    }
  }
});

btnJoin.addEventListener("click", sendJoin);

function sendJoin() {
  userNameValue = userName.value;
  const joinRoomNameValue = document.getElementById("joinRoomName").value;
  const joinRoomCodeValue = document.getElementById("joinRoomCode").value;

  if (
    userNameValue === "" ||
    joinRoomNameValue === "" ||
    joinRoomCodeValue === ""
  ) {
    return alertSquare("Empty Fields");
  } else {
    btnJoin.setAttribute("disabled", "disabled");
    blockInputs();

    btnGender = "join";

    joinRoomCode = clearSpaces(joinRoomCodeValue);
    joinRoomName = clearSpaces(joinRoomNameValue);

    sendJoinData();
  }
}

btnCreate.addEventListener("click", sendCreate);

function sendCreate() {
  userNameValue = userName.value;
  const createRoomNameValue = document.getElementById("createRoomName").value;
  const createRoomCodeValue = document.getElementById("createRoomCode").value;

  if (
    userNameValue === "" ||
    createRoomNameValue === "" ||
    createRoomCodeValue === ""
  ) {
    return alertSquare("Empty Fields");
  } else {
    btnCreate.setAttribute("disabled", "disabled");
    blockInputs();

    btnGender = "create";

    createRoomName = clearSpaces(createRoomNameValue);
    createRoomCode = clearSpaces(createRoomCodeValue);
    sendJoinData();
  }
}

function blockInputs() {
  userName.disabled = true;
  joinRoomNameInput.disabled = true;
  joinRoomCodeInput.disabled = true;
  createRoomNameInput.disabled = true;
  createRoomCodeInput.disabled = true;
}

function clearSpaces(value) {
  (value = value.replace(/[ ]{2,}/gi, " ")),
    (value = value.replace(/(^\s*)|(\s*$)/gi, "")),
    (value = value.replace(/\n /, "\n"));
  return value;
}

async function sendJoinData() {
  userNameValue = clearSpaces(userNameValue);

  const dataJoin = {
    btnGender,
    joinRoomName,
    joinRoomCode,
    createRoomName,
    createRoomCode,
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataJoin),
  };

  const response = await fetch("/Join", options);
  const json = await response.json();

  if (json.status == "Room Found") {
    document.RoomForm.submit();
    setTimeout(resetInputs, 5000);
    sessionStorage.setItem("userColor", `${selectedColor}`);
    sessionStorage.setItem("userName", `${userNameValue}`);
    sessionStorage.setItem("userNumber", -1);
    sessionStorage.setItem("room", `${joinRoomName}`);
    sessionStorage.setItem("code", `${joinRoomCode}`);
  }
  if (json.status == "No Room Found")
    alertSquare(json.status),
      btnJoin.removeAttribute("disabled"),
      resetInputs();
  if (json.status == "Room Created") {
    document.RoomForm.submit();
    setTimeout(resetInputs, 5000);
    sessionStorage.setItem("userColor", `${selectedColor}`);
    sessionStorage.setItem("userName", `${userNameValue}`);
    sessionStorage.setItem("userNumber", 0);
    sessionStorage.setItem("room", `${createRoomName}`);
    sessionStorage.setItem("code", `${createRoomCode}`);
  }
  if (json.status == "Room Already Created")
    alertSquare(json.status),
      btnCreate.removeAttribute("disabled"),
      resetInputs();
}

function resetInputs() {
  userName.disabled = false;
  joinRoomNameInput.disabled = false;
  joinRoomCodeInput.disabled = false;
  createRoomNameInput.disabled = false;
  createRoomCodeInput.disabled = false;
}

function alertSquare(status) {
  alreadyOpened = true;
  const alertBlock = document.createElement("div");
  alertBlock.className = "alertBlock";
  alertBlock.addEventListener("click", removeAlert);
  document.body.appendChild(alertBlock);

  const alertDiv = document.createElement("div");
  alertDiv.className = "alertDiv";
  const alertText = document.createElement("p");
  alertText.innerText = `${status}`;
  alertDiv.appendChild(alertText);
  const alertBtun = document.createElement("p");
  alertBtun.className = "alertBtun";
  alertBtun.innerText = "Ok";
  alertBtun.addEventListener("click", removeAlert);
  alertDiv.appendChild(alertBtun);

  document.body.appendChild(alertDiv);
}

function removeAlert() {
  document.querySelector(".alertBlock").remove();
  document.querySelector(".alertDiv").remove();
  alreadyOpened = false;
}
