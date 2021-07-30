import { domSelectors } from "./styles.js";

const colorProfile = document.querySelector(".color-one");
const $point = document.querySelector(".point");

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
let colorIndex = Math.floor(Math.random() * 9 + 1) - 1;

let selectedColor = colors[colorIndex];

colorProfile.style.backgroundColor = `${colors[colorIndex]}`;

$point.setAttribute("fill", `${colors[colorIndex]}`);

document.addEventListener("keydown", domSelectors);

function changeColor() {
  domSelectors();
  if (colorIndex === colors.length - 1) {
    colorIndex = 0;
    colorProfile.style.backgroundColor = `${colors[0]}`;
    $point.setAttribute("fill", `${colors[0]}`);
  } else {
    colorIndex += 1;
    colorProfile.style.backgroundColor = `${colors[colorIndex]}`;
    $point.setAttribute("fill", `${colors[colorIndex]}`);
  }
  selectedColor = colors[colorIndex];
}

colorProfile.addEventListener("click", changeColor);

const btnJoin = document.querySelector(".btnJoin");
const btnCreate = document.querySelector(".btnCreate");

const $userName = document.getElementById("username");
const $joinRoomName = document.getElementById("joinRoomName");
const $joinRoomCode = document.getElementById("joinRoomCode");
const $createRoomName = document.getElementById("createRoomName");
const $createRoomCode = document.getElementById("createRoomCode");

const inputs = [
  $userName,
  $joinRoomName,
  $joinRoomCode,
  $createRoomName,
  $createRoomCode,
];

function setCharLimit(input) {
  const maxLength = 8;

  if (input.value.length > maxLength) {
    input.value = input.value.substring(0, maxLength);
  }
}

function clearSpaces(value) {
  let newValue;
  newValue = value.replace(/[ ]{2,}/gi, " ");
  newValue = value.replace(/(^\s*)|(\s*$)/gi, "");
  newValue = value.replace(/\n /, "\n");
  return newValue;
}

inputs.forEach((input) => {
  input.addEventListener("keyup", () => {
    setCharLimit(input);
    input.value = input.value.replace(/[^\w\s]/gi, "");
    input.value = clearSpaces(input.value);
  });
});

const labelJoin = document.querySelector(".labelJoin");
const dropDownJoin = document.querySelector(".dropDownJoin");
const joinInputs = document.querySelectorAll(".joinInput");

const labelCreate = document.querySelector(".labelCreate");
const dropDownCreate = document.querySelector(".dropDownCreate");
const createInputs = document.querySelectorAll(".createInput");

const drop = [labelJoin, dropDownJoin, labelCreate, dropDownCreate];

let join = "close";
let create = "close";

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

function joinFunction() {
  if (join === "open") {
    clearJoin();
    join = "close";
    dropDownJoin.style.transform = "rotate(360deg)";
  } else {
    addJoin();
    join = "open";
    dropDownJoin.style.transform = "rotate(180deg)";

    if (create === "open") {
      clearCreate();
      create = "close";
      dropDownCreate.style.transform = "rotate(360deg)";
    }
  }
}

function createFunction() {
  if (create === "open") {
    clearCreate();
    create = "close";
    dropDownCreate.style.transform = "rotate(360deg)";
  } else {
    addCreate();
    create = "open";
    dropDownCreate.style.transform = "rotate(180deg)";

    if (join === "open") {
      clearJoin();
      join = "close";
      dropDownJoin.style.transform = "rotate(360deg)";
    }
  }
}

drop.forEach((element) => {
  element.addEventListener("click", () => {
    domSelectors();

    const elementData = element.getAttribute("data-type");

    if (elementData === "join") {
      joinFunction();
    } else {
      createFunction();
    }
  });
});

function resetInputs() {
  $userName.disabled = false;
  $joinRoomName.disabled = false;
  $joinRoomCode.disabled = false;
  $createRoomName.disabled = false;
  $createRoomCode.disabled = false;

  $userName.value = "";
  $joinRoomName.value = "";
  $joinRoomCode.value = "";
  $createRoomName.value = "";
  $createRoomCode.value = "";
}

let alert = "close";

function removeAlert() {
  if (alert === "open") {
    alert = "close";
    document.querySelector(".alertBlock").remove();
    document.querySelector(".alertDiv").remove();
  }
}

function alertSquare(status) {
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
  alertBtun.addEventListener("click", () => {
    if (alert === "open") {
      removeAlert();
    }
  });
  document.addEventListener("keyup", (e) => {
    if (e.keyCode === 13 || e.keyCode === 9) {
      if (alert === "open") {
        removeAlert();
      }
    }
  });
  alertDiv.appendChild(alertBtun);

  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alert = "open";
  }, 500);
}

function blockInputs() {
  $userName.disabled = true;
  $joinRoomName.disabled = true;
  $joinRoomCode.disabled = true;
  $createRoomName.disabled = true;
  $createRoomCode.disabled = true;
}

async function sendJoinData({
  inputType,
  joinRoomName,
  joinRoomCode,
  createRoomName,
  createRoomCode,
}) {
  const dataJoin = {
    inputType,
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

  if (json.status === "Room Found") {
    document.RoomForm.submit();
    sessionStorage.setItem("userColor", `${selectedColor}`);
    sessionStorage.setItem("userName", `${$userName.value}`);
    sessionStorage.setItem("userNumber", -1);
    sessionStorage.setItem("room", `${$joinRoomName.value}`);
    sessionStorage.setItem("code", `${$joinRoomCode.value}`);
  } else if (json.status === "No Room Found") {
    alertSquare(json.status);
    btnJoin.removeAttribute("disabled");
    resetInputs();
  } else if (json.status === "Room Created") {
    document.RoomForm.submit();
    sessionStorage.setItem("userColor", `${selectedColor}`);
    sessionStorage.setItem("userName", `${$userName.value}`);
    sessionStorage.setItem("userNumber", 0);
    sessionStorage.setItem("room", `${$createRoomName.value}`);
    sessionStorage.setItem("code", `${$createRoomCode.value}`);
  } else if (json.status === "Room Already Created") {
    alertSquare(json.status);
    resetInputs();
    btnCreate.removeAttribute("disabled");
  } else if (json.status === "No data") {
    alertSquare(json.status);
    resetInputs();
    btnCreate.removeAttribute("disabled");
  }
}

function sendJoin() {
  if (
    $userName.value === "" ||
    $joinRoomName.value === "" ||
    $joinRoomCode.value === ""
  ) {
    alertSquare("Empty Fields");
  } else {
    btnJoin.setAttribute("disabled", "disabled");
    blockInputs();

    sendJoinData({
      inputType: "join",
      joinRoomName: `${$joinRoomName.value}`,
      joinRoomCode: `${$joinRoomCode.value}`,
    });
  }
}

function sendCreate() {
  if (
    $userName.value === "" ||
    $createRoomName.value === "" ||
    $createRoomCode.value === ""
  ) {
    alertSquare("Empty Fields");
  } else {
    btnCreate.setAttribute("disabled", "disabled");
    blockInputs();

    sendJoinData({
      inputType: "create",
      createRoomName: `${$createRoomName.value}`,
      createRoomCode: `${$createRoomCode.value}`,
    });
  }
}

btnJoin.addEventListener("click", sendJoin);

btnCreate.addEventListener("click", sendCreate);

document.addEventListener("keydown", (e) => {
  if (e.keyCode === 13 || e.keyCode === 9) {
    e.preventDefault();

    if ($userName.value.length === 0) {
      $userName.focus();
    } else if (
      join === "close" &&
      $createRoomName.value.length === 0 &&
      $createRoomCode.value.length === 0
    ) {
      joinFunction();
    } else if (
      $joinRoomName.value.length > 0 &&
      $joinRoomCode.value.length === 0
    ) {
      $joinRoomCode.focus();
    } else if ($joinRoomCode.value.length > 0) {
      sendJoinData({
        inputType: "join",
        joinRoomName: `${$joinRoomName.value}`,
        joinRoomCode: `${$joinRoomCode.value}`,
      });
    } else if (
      create === "close" &&
      join === "open" &&
      $joinRoomName.value.length === 0 &&
      $joinRoomCode.value.length === 0
    ) {
      createFunction();
    } else if (
      $createRoomName.value.length > 0 &&
      $createRoomCode.value.length === 0
    ) {
      $createRoomCode.focus();
    } else if ($createRoomCode.value.length > 0) {
      sendJoinData({
        inputType: "create",
        createRoomName: `${$createRoomName.value}`,
        createRoomCode: `${$createRoomCode.value}`,
      });
    }
  }
});
