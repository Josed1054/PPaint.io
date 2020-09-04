import { drawing, eraseCanvas, removeCanvasEvLi } from "./canvas.js";
import {
  emit15secWord,
  emitChoosendWord,
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

const mesageInput = document.querySelector(".msg-input");
const messageBtun = document.querySelector(".btn");

const $toolsContainer = document.querySelector(".toolsContainer");

const secretWord = document.createElement("p");
secretWord.className = "secretWord";
$toolsContainer.appendChild(secretWord);

export function setP(backSlash) {
  secretWord.innerText = `Word: ${backSlash}`;
}

let secondsP = document.createElement("p");
secondsP.className = "timerWords";
$toolsContainer.appendChild(secondsP);

export function oneTime60SecFunc(seconds) {
  document.querySelector(".timerWords").innerText = `${seconds}`;
}

export function chooseWords(word1, word2, word3) {
  let wordsArray = [word1, word2, word3];

  const wordsContainer = document.querySelector("#chooseWords");
  wordsContainer.classList.remove("uselessWordContainer");
  wordsContainer.className = "chooseWords";

  // Timer = 15 sec
  const timeWords = document.createElement("div");
  timeWords.className = "timerWords";
  wordsContainer.appendChild(timeWords);

  let seconds = 15;

  function timer() {
    if (seconds >= 0) {
      timeWords.innerText = `${seconds}`;
      emit15secWord(seconds);
      seconds -= 1;
      if (seconds == -1) {
        const wordArray = wordsArray[Math.floor(Math.random() * 3 + 1) - 1];
        clearInterval(timer15Word);
        playingGame(wordArray);
      }
    } else {
      clearInterval(timer15Word);
      const wordArray = wordsArray[Math.floor(Math.random() * 3 + 1) - 1];
      playingGame(wordArray);
    }
  }

  const timer15Word = setInterval(timer, 1000);
  // Timer = 15 sec

  const chooseWordsHeader = document.createElement("p");
  chooseWordsHeader.className = "chooseWordsHeader";
  chooseWordsHeader.innerText = "Choose the Word that you gonna draw";

  wordsContainer.appendChild(chooseWordsHeader);

  const words = document.createElement("div");
  words.className = "words";

  let wordNum = 1;

  wordsArray.forEach((wordArray) => {
    let paragraph = document.createElement("p");
    paragraph.className = `wordNum${wordNum}`;
    paragraph.innerText = `${wordArray}`;
    paragraph.setAttribute("data-word", wordArray);

    paragraph.addEventListener("click", () => {
      clearInterval(timer15Word);
      playingGame(wordArray);
    });

    words.appendChild(paragraph);
    wordNum++;
  });

  wordsContainer.appendChild(words);
}

function playingGame(wordArray) {
  // Erase Chat
  emitEraseChat();
  mesageInput.value = "";
  mesageInput.disabled = true;
  messageBtun.disabled = true;

  sec90Timer();
  secBackSlash(wordArray);

  // Get rid of the words chooser

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

let sec90Interval;
let secSlashInterval;

function sec90Timer() {
  sec90Interval = setInterval(timer, 1000);

  // Timer = 15 sec
  let seconds = 5;

  function timer() {
    if (seconds >= 0) {
      secondsP.innerText = `${seconds}`;
      emit60sec(seconds);
      seconds -= 1;
      if (seconds == -1) {
        clearInterval(sec90Interval);
        ratePaint();
      }
    } else {
      clearInterval(sec90Interval);
      ratePaint();
    }
  }
}

function secBackSlash(wordArray) {
  secSlashInterval = setInterval(changeBackSlash, 20000);
  let wordLength = wordArray.length;

  let varLength = wordArray.length - 1;

  let backSlash = "_ ".repeat(wordLength);
  backSlash = backSlash.replace(/(^\s*)|(\s*$)/gi, "");
  backSlash = backSlash.replace(/[ ]{2,}/gi, " ");
  backSlash = backSlash.replace(/\n /, "\n");

  emitChoosendWord(wordArray);
  emitSecretChart(backSlash);

  let previousIndex;

  function changeBackSlash() {
    let wordLengthDiv3 = wordLength / 3;
    let ramdomIndex = Math.floor(Math.random() * wordLength);
    let ramdomChar = wordArray[ramdomIndex];

    if (varLength > wordLengthDiv3) {
      if (previousIndex !== ramdomIndex) {
        previousIndex = ramdomIndex;

        let res = backSlash.split(" ");
        res.splice(ramdomIndex, 1, `${ramdomChar}`);
        backSlash = res.toString();
        backSlash = backSlash.replace(/,/gi, " ");

        emitSecretChart(backSlash);

        varLength--;
      } else if (previousIndex == ramdomIndex) {
        changeBackSlash();
      }
    } else {
      clearInterval(secSlashInterval);
    }
  }
}

export function ratePaint() {
  removeCanvasEvLi();

  clearInterval(sec90Interval);
  clearInterval(secSlashInterval);
  document.querySelector(".strokesWidths").remove();
  document.querySelector(".colors").remove();

  emitEraseChat();

  // Rate the paint

  // Timer = 15 sec
  let seconds = 5;

  function timer() {
    if (seconds >= 0) {
      emit15secRate(seconds);
      seconds -= 1;
      if (seconds == -1) {
        clearInterval(timer);
        send10sec();
      }
    } else {
      clearInterval(timer);
    }
  }
  setInterval(timer, 1000);

  function send10sec() {
    // Timer = 10 sec
    let seconds2 = 5;

    function timer10sec() {
      if (seconds2 >= 0) {
        emit10secMatch(seconds2);
        seconds2 -= 1;
        if (seconds2 == -1) {
          clearInterval(timer10sec);
        }
      } else {
        clearInterval(timer10sec);
      }
    }

    setInterval(timer10sec, 1000);
  }
}

let rate = 1;

const $rateContainer = document.querySelector(".uselessRateContainer");

const word = document.createElement("p");
word.className = "wordPainted";
$rateContainer.appendChild(word);

export function rateCanvas(canvasPainted, wordPainted) {
  eraseCanvas();
  secretWord.innerText = "Word:";

  mesageInput.disabled = false;
  messageBtun.disabled = false;

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

function fillStar(starValue) {
  let fiveStars = [1, 2, 3, 4, 5];

  let spliced = fiveStars.splice(0, starValue);

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

let secondsP2 = document.createElement("p");
secondsP2.className = "secondsP";
const constRateContainer =
  document.querySelector(".rateContainer") ||
  document.querySelector(".uselessRateContainer");
constRateContainer.appendChild(secondsP2);

export function rateContainer(seconds) {
  secondsP2.innerText = `${seconds}`;
}

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
  let secondsP = document.querySelector(".secondsP");
  let seconds = secondsP.lastChild.data;

  function timer() {
    if (seconds >= 0) {
      emit15secNewRate(seconds);
      seconds -= 1;
      if (seconds == -1) {
        clearInterval(timer);
        send10sec();
      }
    } else {
      clearInterval(timer);
    }
  }
  setInterval(timer, 1000);

  function send10sec() {
    // Timer = 15 sec
    let seconds2 = 10;

    function timer10sec() {
      if (seconds2 >= 0) {
        emit10secNewMatch(seconds2);
        seconds2 -= 1;
        if (seconds2 == -1) {
          clearInterval(timer10sec);
        }
      } else {
        clearInterval(timer10sec);
      }
    }

    setInterval(timer10sec, 1000);
  }
}

export function continueCounting10sec() {
  let secondsP = document.querySelector(".secondsP");
  let seconds = secondsP.lastChild.data;

  // Timer = 10 sec
  function timer10sec() {
    if (seconds >= 0) {
      emit10secNewMatch(seconds);
      seconds -= 1;
      if (seconds == -1) {
        clearInterval(timer10sec);
      }
    } else {
      clearInterval(timer10sec);
    }
  }

  setInterval(timer10sec, 1000);
}

export function usersResume(
  numbers,
  users,
  colors,
  points,
  userNumber,
  userColor
) {
  const canvasPaint = document.querySelector(".canvasPaint");
  canvasPaint.style.opacity = "0";
  canvasPaint.style.pointerEvents = "none";

  document.querySelector("#chooseWords").remove();
  document.querySelector(".uselessRateBlock").remove();

  const wallBlock = document.createElement("div");
  wallBlock.className = "wallBlock";
  document.body.appendChild(wallBlock);
  const usersDiv = document.createElement("div");
  usersDiv.className = "usersDiv";
  document.body.appendChild(usersDiv);
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

  const theBestUsers = usersArray.slice(0, 3);
  let position = 1;
  theBestUsers.forEach((user) => {
    const term = setTerm(position);
    function setTerm(resultObject) {
      if (resultObject == 1) return "st";
      else if (resultObject == 2) return "nd";
      else if (resultObject == 3) return "rd";
    }

    const userAllAtribiutes = document.createElement("p");
    userAllAtribiutes.className = `Number${position}`;
    userAllAtribiutes.style.color = `${user.color}`;
    userAllAtribiutes.innerText = `${position}${term}.- User:${user.user}, Points:${user.points}`;
    usersDiv.appendChild(userAllAtribiutes);

    return position++;
  });

  const yourPlace = search(userNumber, usersArray);
  function search(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].number == nameKey) {
        return Number(i + 1);
      }
    }
  }
  const term2 = setTerm2(yourPlace);
  function setTerm2(resultObject) {
    let numArray = resultObject.toString();
    let term = Number(numArray[numArray.length - 1]);
    if (term == 1) {
      return "st";
    } else if (term == 2) {
      return "nd";
    } else if (term == 3) {
      return "rd";
    } else if (term >= 4 || term == 0) {
      return "th";
    }
  }
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

function nextPage() {
  const usersDiv = document.querySelector(".usersDiv");
  usersDiv.style.opacity = "0";
  usersDiv.style.pointerEvents = "none";

  const canvasDivs = document.querySelector(".canvasDivs");
  canvasDivs.style.zIndex = "150";
  canvasDivs.style.pointerEvents = "auto";
}

export function paintsResume(canvas, users, colors, points, words) {
  let canvasArray = [];
  for (let index = 0; index <= words.length - 1; index++) {
    let canvasInfo = {};
    canvasInfo["canvas"] = canvas[index];
    canvasInfo["user"] = users[index];
    canvasInfo["color"] = colors[index];
    canvasInfo["points"] = points[index];
    canvasInfo["word"] = words[index];
    canvasArray.push(canvasInfo);
  }

  canvasArray.sort(function (a, b) {
    return b.points - a.points;
  });

  const theBestCanvas = canvasArray.slice(0, 3);

  const canvasDivs = document.createElement("div");
  canvasDivs.className = "canvasDivs";
  document.body.appendChild(canvasDivs);

  let position = 1;

  theBestCanvas.forEach((canvas) => {
    const canvasDiv = document.createElement("div");
    canvasDiv.className = `canvasDiv cNumber${position}`;
    canvasDiv.setAttribute = `${position}`;

    const paintCreator = document.createElement("p");
    paintCreator.className = "paintCreator";
    paintCreator.style.color = `${canvas.color}`;
    paintCreator.innerText = `Player= ${canvas.user}, Word= ${canvas.word}`;
    canvasDiv.appendChild(paintCreator);

    const paint = document.createElement("img");
    paint.className = "paint";
    paint.src = `${canvas.canvas}`;
    canvasDiv.appendChild(paint);

    const paintRate = document.createElement("p");
    paintRate.className = `${position}`;
    paintRate.innerText = `Paint Rate = ${canvas.points}/5`;
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
      paintText.style.color = `${canvas.color}`;
      paintText.innerText = `Player= ${canvas.user}, Word= ${canvas.word}`;
      paintDiv.appendChild(paintText);

      const paintPaint = document.createElement("img");
      paintPaint.className = `paint${paintRate.className}`;
      paintPaint.src = `${canvas.canvas}`;
      paintDiv.appendChild(paintPaint);

      const paintRate2 = document.createElement("p");
      paintRate2.innerText = `Paint Rate = ${canvas.points}/5`;
      paintDiv.appendChild(paintRate2);

      const paintExit = document.createElement("p");
      paintExit.className = "paintExit";
      paintExit.innerText = "X";
      paintExit.addEventListener("click", removePaintPlate);
      paintDiv.appendChild(paintExit);
    });

    return position++;
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
