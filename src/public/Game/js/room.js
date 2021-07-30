import { emitStarGame } from "./index.js";

const roomUsersList = document.querySelector(".roomUsersList");

export function innerCodeRoom(room, code) {
  // add the possibility to hide the room name and code
  const roomName = document.querySelector(".roomName");
  const roomCode = document.querySelector(".roomCode");

  const roomNameP = document.createElement("p");
  roomNameP.innerText = `Room: ${room}`;

  const roomCodeP = document.createElement("p");
  roomCodeP.innerText = `Code: ${code}`;

  roomName.appendChild(roomNameP);
  roomCode.appendChild(roomCodeP);
}

const $gameRound = document.querySelector(".gameRound");
const actualRound = document.createElement("p");
$gameRound.appendChild(actualRound);

export function innerGameRound(gameRound) {
  actualRound.innerText = `Round: ${gameRound}/3`;
}

// !! I need to fix this, the server needs to do this
// Add users to DOM
let oneTimeWait = false;
let twoTimeWait = false;

// !! I need to fix this, the server needs to do this

// !! I need to fix this, the server needs to do this

function startGameBtun() {
  emitStarGame();
}

let firstOutputUsers = false;

export function leaderDiv(usersWaiting) {
  const startBtun = document.createElement("div");
  startBtun.className = "startBtun";
  // !! I need to fix this, the server needs to do this

  startBtun.addEventListener("click", function () {
    startGameBtun();
  });

  const text = document.createElement("p");
  text.innerText = `Start Game. Players: ${usersWaiting}`;

  startBtun.appendChild(text);

  const elementToAppend =
    document.querySelector(".startBlock") ||
    document.querySelector(".canvasDivs");
  elementToAppend.appendChild(startBtun);
}

function eraseUsers() {
  if (firstOutputUsers === true) {
    while (roomUsersList.firstChild)
      roomUsersList.removeChild(roomUsersList.firstChild);
  }
}

// !! I need to fix this, the server needs to do this
export function playerDiv(leaderName) {
  const waitText = document.createElement("div");
  waitText.className = "waitBlock";

  const text = document.createElement("p");
  text.innerText = `Waiting for: ${leaderName} to start the game`;

  waitText.appendChild(text);

  const elementToAppend =
    document.querySelector(".startBlock") ||
    document.querySelector(".canvasDivs");
  elementToAppend.appendChild(waitText);
}

function search(nameKey, myArray, userNumber) {
  for (let i = 0; i < myArray.length; i += 1) {
    if (myArray[i].number === nameKey) {
      const myPlayer = document.querySelector(`.PlayerNumber${userNumber}`);
      myPlayer.style.background = "rgba(168,220,209,0.2)";
    }
  }
}

export function outputUsers(
  numbers,
  users,
  colors,
  points,
  leaderName,
  leaderNum,
  userNumber,
  usersWaiting
) {
  eraseUsers();

  const usersArray = [];
  for (let index = 0; index <= numbers.length - 1; index += 1) {
    const user = {};
    user.number = numbers[index];
    user.user = users[index];
    user.color = colors[index];
    user.points = points[index];

    usersArray.push(user);
  }

  usersArray.sort(function (a, b) {
    return b.points - a.points;
  });

  const widthWindow =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  // !! I need to fix this, the server needs to do this
  firstOutputUsers = true;
  // Check if Him is the leader
  function leader() {
    if (leaderNum !== undefined) {
      if (leaderNum === userNumber) {
        if (twoTimeWait === true) {
          const elimnStartBtuns = document.querySelectorAll(".startBtun");

          elimnStartBtuns.forEach((elimnStartBtun) => {
            elimnStartBtun.remove();
          });

          leaderDiv(usersWaiting);
        } else {
          leaderDiv(usersWaiting);

          return (twoTimeWait = true);
        }
      } else if (oneTimeWait === false) {
        playerDiv(leaderName);

        return (oneTimeWait = true);
      }
    }
  }

  leader();

  let position = 1;

  if (widthWindow < 800) {
    const usersArray3 = usersArray.slice(0, 3);

    usersArray3.forEach((user) => {
      function hexToRgb(hex) {
        // todo I need to do this function one not twice
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        const newHex = hex.replace(shorthandRegex, function (m, r, g, b) {
          return r + r + g + g + b + b;
        });

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(newHex);
        return result
          ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
            }
          : null;
      }

      const rgb = hexToRgb(user.color);

      const userAllAtribiutes = document.createElement("p");
      userAllAtribiutes.className = `Position${position} PlayerNumber${user.number}`;
      userAllAtribiutes.innerText = `${position}.- ${user.user} | ${user.points}`;
      userAllAtribiutes.style.borderLeft = `0.5em solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`;

      roomUsersList.appendChild(userAllAtribiutes);

      position += 1;
    });
  } else {
    usersArray.forEach((user) => {
      function hexToRgb(hex) {
        // todo I need to do this function one not twice
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        const newHex = hex.replace(shorthandRegex, function (r, g, b) {
          return r + r + g + g + b + b;
        });

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(newHex);
        return result
          ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
            }
          : null;
      }

      const rgb = hexToRgb(user.color);

      const userAllAtribiutes = document.createElement("p");
      userAllAtribiutes.setAttribute("number", `${user.number}`);
      userAllAtribiutes.className = `usersPlaying PlayerNumber${user.number}`;
      userAllAtribiutes.innerText = `${position}.- ${user.user} | ${user.points}`;
      userAllAtribiutes.style.borderLeft = `0.5em solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`;

      roomUsersList.appendChild(userAllAtribiutes);

      position += 1;
    });

    search(userNumber, usersArray, userNumber);
  }
}

export function newLeader() {
  const elimnWaitBlock = document.querySelector(".waitBlock");

  // !! I need to fix this, the server needs to do this
  elimnWaitBlock.remove();
}

export function setPainter(userNumberOfThePainter) {
  const widthWindow =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  // !! I need to fix this, the server needs to do this
  oneTimeWait = false;

  if (widthWindow > 800) {
    const usersInTheList = document.querySelectorAll(".usersPlaying");

    usersInTheList.forEach((user) => {
      const userNumber = user.getAttribute("number");

      if (userNumber === userNumberOfThePainter) {
        const pincelImg = document.createElement("img");
        pincelImg.className = "pincelImg";
        pincelImg.src = "/src/public/Game/pincel/pincel.png";
        user.appendChild(pincelImg);
      }
    });
  }
}
