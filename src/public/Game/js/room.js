import { emitStarGame } from "./index.js";

const roomUsersList = document.querySelector(".roomUsersList");

export function innerCodeRoom(room, code) {
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

// Add users to DOM
let oneTimeWait = false;
let twoTimeWait = false;

let firstOutputUsers = false;
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

  let usersArray = [];
  for (let index = 0; index <= numbers.length - 1; index++) {
    let user = {};
    user["number"] = numbers[index];
    user["user"] = users[index];
    user["color"] = colors[index];
    user["points"] = points[index];

    usersArray.push(user);
  }

  usersArray.sort(function (a, b) {
    return b.points - a.points;
  });

  const widhtWindow =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  firstOutputUsers = true;
  // Check if Him is the leader
  leader();
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

  let position = 1;

  if (widhtWindow < 800) {
    const usersArray3 = usersArray.slice(0, 3);

    usersArray3.forEach((user) => {
      const rgb = hexToRgb(user.color);

      function hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
          return r + r + g + g + b + b;
        });

        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
            }
          : null;
      }

      const userAllAtribiutes = document.createElement("p");
      userAllAtribiutes.className = `Position${position} PlayerNumber${user.number}`;
      userAllAtribiutes.innerText = `${position}.- ${user.user} | ${user.points}`;
      userAllAtribiutes.style.borderLeft = `0.5em solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`;

      roomUsersList.appendChild(userAllAtribiutes);

      position++;
    });
  } else {
    usersArray.forEach((user) => {
      const rgb = hexToRgb(user.color);

      function hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (r, g, b) {
          return r + r + g + g + b + b;
        });

        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
            }
          : null;
      }

      const userAllAtribiutes = document.createElement("p");
      userAllAtribiutes.setAttribute("number", `${user.number}`);
      userAllAtribiutes.className = `usersPlaying PlayerNumber${user.number}`;
      userAllAtribiutes.innerText = `${position}.- ${user.user} | ${user.points}`;
      userAllAtribiutes.style.borderLeft = `0.5em solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`;

      roomUsersList.appendChild(userAllAtribiutes);

      position++;
    });

    search(userNumber, usersArray);
    function search(nameKey, myArray) {
      for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].number == nameKey) {
          const myPlayer = document.querySelector(`.PlayerNumber${userNumber}`);
          myPlayer.style.background = "rgba(168,220,209,0.2)";
        }
      }
    }
  }
}

function eraseUsers() {
  if (firstOutputUsers == true) {
    while (roomUsersList.firstChild)
      roomUsersList.removeChild(roomUsersList.firstChild);
  }
}

export function newLeader(newLeaderNum, newLeaderName) {
  const elimnWaitBlock = document.querySelector(".waitBlock");

  elimnWaitBlock.remove();
}

export function leaderDiv(usersWaiting) {
  const startBtun = document.createElement("div");
  startBtun.className = "startBtun";

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

let oneTimeStartGame = false;
function startGameBtun() {
  if (oneTimeStartGame === false) {
    emitStarGame();
  }
}

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

export function setPainter(userNumberOfThePainter) {
  const widhtWindow =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  if (widhtWindow > 800) {
    const usersInTheList = document.querySelectorAll(".usersPlaying");

    usersInTheList.forEach((user) => {
      let userNumber = user.getAttribute("number");

      if (userNumber == userNumberOfThePainter) {
        const pincelImg = document.createElement("img");
        pincelImg.className = "pincelImg";
        pincelImg.src = "/src/public/Game/pincel/pincel.png";
        user.appendChild(pincelImg);
      }
    });
  }
}
