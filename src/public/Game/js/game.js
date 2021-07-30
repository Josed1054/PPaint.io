import { drawing, eraseCanvas, removeCanvasEvLi } from "./canvas.js";
import {
  emit15secWord,
  emitChosenWord,
  emitEraseChat,
  emitSecretChart,
  emit60sec,
  emit15secRate,
  emitCanvasRate,
  emit10secMatch,
  emit15secNewRate,
  emit10secNewMatch,
  emitPlayAgain,
} from "./index.js";

const messageInput = document.querySelector(".msg-input");
const messageBtun = document.querySelector(".btn");

const $toolsContainer = document.querySelector(".toolsContainer");

const secretWord = document.createElement("p");
secretWord.className = "secretWord";
$toolsContainer.appendChild(secretWord);

export function setP(backSlash) {
  secretWord.innerText = `Word: ${backSlash}`;
}

const secondsP = document.createElement("p");
secondsP.className = "timerWords";
$toolsContainer.appendChild(secondsP);

export function oneTime60SecFunc(seconds) {
  document.querySelector(".timerWords").innerText = `${seconds}`;
}

let sec90Interval;
let secSlashInterval;

const previousIndex = [];

export function ratePaint() {
  removeCanvasEvLi();

  clearInterval(sec90Interval);
  clearInterval(secSlashInterval);
  previousIndex.length = 0;

  document.querySelector(".strokesWidths").remove();
  document.querySelector(".colors").remove();

  emitEraseChat();

  function send10sec() {
    // Timer = 10 sec
    let seconds2 = 10;

    function timer10sec() {
      if (seconds2 >= 0) {
        emit10secMatch(seconds2);
        seconds2 -= 1;
        if (seconds2 === -1) {
          clearInterval(timer10sec);
        }
      } else {
        clearInterval(timer10sec);
      }
    }

    setInterval(timer10sec, 1000);
  }

  // Timer = 15 sec
  let seconds = 15;

  function timer() {
    if (seconds >= 0) {
      emit15secRate(seconds);
      seconds -= 1;
      if (seconds === -1) {
        clearInterval(timer);
        send10sec();
      }
    } else {
      clearInterval(timer);
    }
  }
  setInterval(timer, 1000);
}

function sec90Timer() {
  // Timer = 15 sec
  let seconds = 90;

  function timer() {
    if (seconds >= 0) {
      secondsP.innerText = `${seconds}`;
      emit60sec(seconds);
      seconds -= 1;
      if (seconds === -1) {
        clearInterval(sec90Interval);
        ratePaint();
      }
    } else {
      clearInterval(sec90Interval);
      ratePaint();
    }
  }

  sec90Interval = setInterval(timer, 1000);
}

function secBackSlash(wordArray) {
  let varLength = wordArray.length - 1;
  const wordLength = wordArray.length;

  let backSlash = "_ ".repeat(wordLength);
  backSlash = backSlash.replace(/(^\s*)|(\s*$)/gi, "");
  backSlash = backSlash.replace(/[ ]{2,}/gi, " ");
  backSlash = backSlash.replace(/\n /, "\n");

  function changeBackSlash() {
    const wordLengthDiv3 = wordLength / 3;
    const randomIndex = Math.floor(Math.random() * wordLength);
    const randomChar = wordArray[randomIndex];

    if (varLength > wordLengthDiv3) {
      if (previousIndex.length === 0) {
        previousIndex.push(randomIndex);

        const res = backSlash.split(" ");
        res.splice(randomIndex, 1, `${randomChar}`);
        backSlash = res.toString();
        backSlash = backSlash.replace(/,/gi, " ");

        emitSecretChart(backSlash);

        varLength -= 1;
      } else {
        previousIndex.forEach((index) => {
          if (index === randomIndex) {
            changeBackSlash();
          } else {
            previousIndex.push(randomIndex);
            const res = backSlash.split(" ");
            res.splice(randomIndex, 1, `${randomChar}`);
            backSlash = res.toString();
            backSlash = backSlash.replace(/,/gi, " ");

            emitSecretChart(backSlash);

            varLength -= 1;
          }
        });
      }
    } else {
      clearInterval(secSlashInterval);
      previousIndex.length = 0;
    }
  }

  secSlashInterval = setInterval(changeBackSlash, 15000);

  emitChosenWord(wordArray);
  emitSecretChart(backSlash);
}

function playingGame(wordArray) {
  // Erase Chat
  emitEraseChat();
  messageInput.value = "";
  messageInput.disabled = true;
  messageBtun.disabled = true;

  sec90Timer();
  secBackSlash(wordArray);

  // Get rid of the words chooser

  // !! I need to remove the Word Container not just change the class
  const wordsContainer = document.querySelector("#chooseWords");
  wordsContainer.classList.remove("chooseWords");
  wordsContainer.classList.add("uselessWordContainer");

  document.querySelector(".timerWords").remove();
  document.querySelector(".chooseWordsHeader").remove();
  document.querySelector(".words").remove();

  // Get rid of the words chooser

  // Word

  secretWord.innerText = `Word: ${wordArray}`;

  // Word

  drawing();
}

export function chooseWords(word1, word2, word3, usersWaiting) {
  let seconds;

  function setWordsToUser() {
    const wordsArray = [word1, word2, word3];

    const wordsContainer = document.querySelector("#chooseWords");

    const timeWords = document.createElement("div");
    timeWords.className = "timerWords";
    wordsContainer.appendChild(timeWords);

    // eslint-disable-next-line no-use-before-define
    const timer15Word = setInterval(timer, 1000);

    function timer() {
      if (seconds >= 0) {
        timeWords.innerText = `${seconds}`;
        emit15secWord(seconds);
        seconds -= 1;
        if (seconds === -1) {
          const wordArray = wordsArray[Math.floor(Math.random() * 3 + 1) - 1];
          clearInterval(timer15Word);
          playingGame(wordArray, seconds);
        }
      } else {
        clearInterval(timer15Word);
        const wordArray = wordsArray[Math.floor(Math.random() * 3 + 1) - 1];
        playingGame(wordArray, seconds);
      }
    }

    // Timer = 15 sec
    // !! I need to change this to make the server do this
    wordsContainer.classList.remove("uselessWordContainer");
    wordsContainer.className = "chooseWords";

    const chooseWordsHeader = document.createElement("p");
    chooseWordsHeader.className = "chooseWordsHeader";
    chooseWordsHeader.innerText = "Choose the Word that you gonna draw";

    wordsContainer.appendChild(chooseWordsHeader);

    const words = document.createElement("div");
    words.className = "words";

    wordsArray.forEach((wordArray, wordNum) => {
      const paragraph = document.createElement("p");
      paragraph.className = `wordNum${wordNum + 1}`;
      paragraph.innerText = `${wordArray}`;
      paragraph.setAttribute("data-word", wordArray);

      paragraph.addEventListener("click", () => {
        clearInterval(timer15Word);
        playingGame(wordArray, seconds);
      });

      words.appendChild(paragraph);
    });

    wordsContainer.appendChild(words);
  }

  if (usersWaiting === 15) {
    seconds = 8;
    setWordsToUser(seconds);
  } else if (usersWaiting >= 9) {
    seconds = 10;
    setWordsToUser(seconds);
  } else {
    seconds = 15;
    setWordsToUser(seconds);
  }
}

let rate = 1;

// !! I need to change this
const $rateContainer = document.querySelector(".uselessRateContainer");

const word = document.createElement("p");
word.className = "wordPainted";
$rateContainer.appendChild(word);

function fillStar(starValue) {
  const fiveStars = [1, 2, 3, 4, 5];

  const spliced = fiveStars.splice(0, starValue);

  spliced.forEach((splice) => {
    const starSelected = document.querySelector(`.star${splice}`);
    starSelected.setAttribute("fill", "gold");
  });

  fiveStars.forEach((uslss) => {
    const starUnselected = document.querySelector(`.star${uslss}`);
    starUnselected.setAttribute("fill", "none");
  });

  rate = spliced[spliced.length - 1];
}

export function rateCanvas(canvasPainted, wordPainted) {
  eraseCanvas();
  secretWord.innerText = "Word:";

  messageInput.disabled = false;
  messageBtun.disabled = false;

  // !! I need to change this
  const rateBlock = document.querySelector(".uselessRateBlock");
  rateBlock.className = "rateBlock";

  $rateContainer.className = "rateContainer";

  const stars = document.querySelector(".uselessStarsContainer");
  stars.className = "starsContainer";
  stars.className = "uselessStarsContainer";
  stars.className = "starsContainer";

  const rateImg = document.createElement("img");
  rateImg.className = "rateImg";
  rateImg.src = `${canvasPainted}`;

  $rateContainer.appendChild(rateImg);

  word.innerText = `Word: ${wordPainted}`;

  const rateStars = document.querySelectorAll(".star");

  rateStars.forEach((star) => {
    const starValue = star.getAttribute("data-star-num");
    star.style.cursor = "pointer";
    star.addEventListener("click", function () {
      fillStar(starValue);
    });
  });
}

// !! I need to change this
const secondsP2 = document.createElement("p");
secondsP2.className = "secondsP";
const constRateContainer =
  document.querySelector(".rateContainer") ||
  document.querySelector(".uselessRateContainer");
constRateContainer.appendChild(secondsP2);

export function rateContainer(seconds) {
  secondsP2.innerText = `${seconds}`;
}

// !! I need to change this
export function sendRate() {
  document.querySelector(".starsContainer").className = "uselessStarsContainer";

  emitCanvasRate(rate);
}

const rateText = document.createElement("p");
rateText.className = "rate";
$rateContainer.appendChild(rateText);

export function canvasRate(sumedPoints) {
  rateText.innerText = `Rate = ${sumedPoints}`;
  rateText.style.background = "#eeeeee";
}

export function continueCounting15sec() {
  const secondsPS = document.querySelector(".secondsP");
  let seconds = secondsPS.lastChild.data;

  function send10sec() {
    // Timer = 15 sec
    let seconds2 = 10;

    function timer10sec() {
      if (seconds2 >= 0) {
        emit10secNewMatch(seconds2);
        seconds2 -= 1;
        if (seconds2 === -1) {
          clearInterval(timer10sec);
        }
      } else {
        clearInterval(timer10sec);
      }
    }

    setInterval(timer10sec, 1000);
  }

  function timer() {
    if (seconds >= 0) {
      emit15secNewRate(seconds);
      seconds -= 1;
      if (seconds === -1) {
        clearInterval(timer);
        send10sec();
      }
    } else {
      clearInterval(timer);
    }
  }
  setInterval(timer, 1000);
}

export function continueCounting10sec() {
  const secondsPS = document.querySelector(".secondsP");
  let seconds = secondsPS.lastChild.data;

  // Timer = 10 sec
  function timer10sec() {
    if (seconds >= 0) {
      emit10secNewMatch(seconds);
      seconds -= 1;
      if (seconds === -1) {
        clearInterval(timer10sec);
      }
    } else {
      clearInterval(timer10sec);
    }
  }

  setInterval(timer10sec, 1000);
}

function nextPage() {
  const usersDiv = document.querySelector(".usersDiv");
  usersDiv.style.opacity = "0";
  usersDiv.style.pointerEvents = "none";

  const canvasDivs = document.querySelector(".canvasDivs");
  canvasDivs.style.zIndex = "150";
  canvasDivs.style.pointerEvents = "auto";
}

export function usersResume(
  numbers,
  users,
  colors,
  points,
  userNumber,
  userColor
) {
  const wallBlock = document.createElement("div");
  wallBlock.className = "wallBlock";
  document.body.appendChild(wallBlock);
  const usersDiv = document.createElement("div");
  usersDiv.className = "usersDiv";
  document.body.appendChild(usersDiv);
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

  const theBestUsers = usersArray.slice(0, 3);
  theBestUsers.forEach((user, position) => {
    const SET_POSITION = {
      1: "st",
      2: "nd",
      3: "rd",
    };

    const term = SET_POSITION[position + 1];

    const userAllAtribiutes = document.createElement("p");
    userAllAtribiutes.className = `Number${position + 1}`;
    userAllAtribiutes.style.color = `${user.color}`;
    userAllAtribiutes.innerText = `${position + 1}${term}.- User:${
      user.user
    }, Points:${user.points}`;
    usersDiv.appendChild(userAllAtribiutes);
  });

  function search(nameKey, myArray) {
    for (let i = 0; i < myArray.length; i += 1) {
      if (myArray[i].number === nameKey) {
        return Number(i + 1);
      }
    }
  }
  const yourPlace = search(userNumber, usersArray);

  function setTerm2(resultObject) {
    const numArray = resultObject.toString();
    const pos = Number(numArray[numArray.length - 1]);

    const SET_POSITION = {
      1: "st",
      2: "nd",
      3: "rd",
    };

    const newPos = SET_POSITION[pos] ? SET_POSITION[pos] : "th";
    return newPos;
  }
  const term2 = setTerm2(yourPlace);

  const textYourPlace = document.createElement("p");
  textYourPlace.className = "textYourPlace";
  textYourPlace.style.color = `${userColor}`;
  textYourPlace.innerText = `Your Place: ${yourPlace}${term2}`;
  usersDiv.appendChild(textYourPlace);

  const nextButn = document.createElement("input");
  nextButn.type = "button";
  nextButn.value = "Next";
  nextButn.onclick = nextPage;
  usersDiv.appendChild(nextButn);
}

function removePaintPlate() {
  document.querySelector(".paintPlate").remove();
  document.querySelector(".paintDiv").remove();
}

function previousPage() {
  const usersDiv = document.querySelector(".usersDiv");
  usersDiv.style.opacity = "1";
  usersDiv.style.pointerEvents = "auto";

  const canvasDivs = document.querySelector(".canvasDivs");
  canvasDivs.style.zIndex = "50";
  canvasDivs.style.pointerEvents = "none";
}

function playAgain() {
  document.querySelector(".lastHomeButn").remove();
  document.querySelector(".playAgainButn").remove();

  emitPlayAgain();
}

export function paintsResume(canvas, users, colors, points, words) {
  const canvasArray = [];
  for (let index = 0; index <= words.length - 1; index += 1) {
    const canvasInfo = {};
    canvasInfo.canvas = canvas[index];
    canvasInfo.user = users[index];
    canvasInfo.color = colors[index];
    canvasInfo.points = points[index];
    canvasInfo.word = words[index];
    canvasArray.push(canvasInfo);
  }

  canvasArray.sort(function (a, b) {
    return b.points - a.points;
  });

  const theBestCanvas = canvasArray.slice(0, 3);

  const canvasDivs = document.createElement("div");
  canvasDivs.className = "canvasDivs";
  document.body.appendChild(canvasDivs);

  theBestCanvas.forEach((canva, position) => {
    const canvasDiv = document.createElement("div");
    canvasDiv.className = `canvasDiv cNumber${position + 1}`;
    canvasDiv.setAttribute = `${position + 1}`;

    const paintCreator = document.createElement("p");
    paintCreator.className = "paintCreator";
    paintCreator.style.color = `${canva.color}`;
    paintCreator.innerText = `Player= ${canva.user}, Word= ${canva.word}`;
    canvasDiv.appendChild(paintCreator);

    const paint = document.createElement("img");
    paint.className = "paint";
    paint.src = `${canva.canvas}`;
    canvasDiv.appendChild(paint);

    const paintRate = document.createElement("p");
    paintRate.className = `${position + 1}`;
    paintRate.innerText = `Paint Rate = ${canva.points}/5`;
    canvasDiv.appendChild(paintRate);

    canvasDivs.appendChild(canvasDiv);

    canvasDiv.addEventListener("click", () => {
      const paintPlate = document.createElement("div");
      paintPlate.className = "paintPlate";
      paintPlate.addEventListener("click", removePaintPlate);
      document.body.appendChild(paintPlate);

      const paintDiv = document.createElement("div");
      paintDiv.className = "paintDiv";
      document.body.appendChild(paintDiv);

      const paintText = document.createElement("p");
      paintText.style.color = `${canva.color}`;
      paintText.innerText = `Player= ${canva.user}, Word= ${canva.word}`;
      paintDiv.appendChild(paintText);

      const paintPaint = document.createElement("img");
      paintPaint.className = `paint${paintRate.className}`;
      paintPaint.src = `${canva.canvas}`;
      paintDiv.appendChild(paintPaint);

      const paintRate2 = document.createElement("p");
      paintRate2.innerText = `Paint Rate = ${canva.points}/5`;
      paintDiv.appendChild(paintRate2);

      const paintExit = document.createElement("p");
      paintExit.className = "paintExit";
      paintExit.innerText = "X";
      paintExit.addEventListener("click", removePaintPlate);
      paintDiv.appendChild(paintExit);
    });
  });

  const previousButn = document.createElement("input");
  previousButn.type = "button";
  previousButn.value = "Previous";
  previousButn.onclick = previousPage;
  canvasDivs.appendChild(previousButn);

  const playAgainButn = document.createElement("input");
  playAgainButn.type = "button";
  playAgainButn.value = "Play Again";
  playAgainButn.onclick = playAgain;
  playAgainButn.className = "playAgainButn";
  canvasDivs.appendChild(playAgainButn);

  const homeBtun = document.createElement("a");
  homeBtun.href = "./";
  homeBtun.innerText = "Home";
  homeBtun.className = "lastHomeButn";
  canvasDivs.appendChild(homeBtun);
}
