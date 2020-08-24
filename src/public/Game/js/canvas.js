import { sendLocCanvas, emitCanvasPainted } from "./index.js";
import { newElemnt } from "./createElements.js";

let oneTimeRezise = false;

const canvas = document.querySelector("#canvasPlayer");
const context = canvas.getContext("2d");
const canvasPaint = document.querySelector(".canvasPaint");

let canvasWidth;
let canvasHeight;

let strokesWidthEmit = 3;
let strokesColorEmit = "black";
let canvasAction;

context.lineWidth = 3;

let usingBrush = false;

let colorSet = "black";
let lineWidth = 3;

class MouseDownPos {
  constructor(x, y) {
    (this.x = x), (this.y = y);
  }
}

class Location {
  constructor(x, y) {
    (this.x = x), (this.y = y);
  }
}

let mousedown = new MouseDownPos(0, 0);
let loc = new Location(0, 0);

var clientTouchX, clientTouchY;

canvas.width = 500;
canvas.height = 400;

canvasWidth = 500;
canvasHeight = 400;

//

const $divCanvasContainer = document.querySelector(".canvasContainer");
const $canvasPlayer = document.querySelector("#canvasPlayer");

const widhtWindow =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

setCanvasSize();
export function setCanvasSize() {
  if (widhtWindow > 1000) {
    let divWidth =
      $divCanvasContainer.clientWidth - $divCanvasContainer.clientWidth / 9;
    let divHeight =
      $divCanvasContainer.clientHeight - $divCanvasContainer.clientHeight / 7;

    let xScale = divWidth / 500;
    let yScale = divHeight / 400;

    $canvasPlayer.style.transform = `scale(${xScale}, ${yScale})`;
  } else if (widhtWindow > 800) {
    let divWidth =
      $divCanvasContainer.clientWidth - $divCanvasContainer.clientWidth / 14;
    let divHeight =
      $divCanvasContainer.clientHeight - $divCanvasContainer.clientHeight / 12;

    let xScale = divWidth / 500;
    let yScale = divHeight / 400;

    $canvasPlayer.style.transform = `scale(${xScale}, ${yScale})`;
  } else if (widhtWindow > 500) {
    let divWidth =
      $divCanvasContainer.clientWidth - $divCanvasContainer.clientWidth / 18;
    let divHeight =
      $divCanvasContainer.clientHeight - $divCanvasContainer.clientHeight / 16;

    let xScale = divWidth / 500;
    let yScale = divHeight / 400;

    $canvasPlayer.style.transform = `scale(${xScale}, ${yScale})`;
  } else {
    let divWidth =
      $divCanvasContainer.clientWidth - $divCanvasContainer.clientWidth / 50;
    let divHeight =
      $divCanvasContainer.clientHeight - $divCanvasContainer.clientHeight / 15;

    let xScale = divWidth / 500;
    let yScale = divHeight / 400;

    $canvasPlayer.style.transform = `scale(${xScale}, ${yScale})`;
  }
}

export function drawing() {
  document.querySelector(".canvasPaint").style.zIndex = 100;
  colorSet = "black";
  lineWidth = 3;

  createTools();

  createColors();

  canvas.addEventListener("mousedown", ReactToMouseDown);

  canvas.addEventListener("mousemove", ReactToMouseMove);

  canvas.addEventListener("mouseup", ReactToMouseUp);

  canvas.addEventListener("mouseout", (e) => {
    usingBrush = false;
    context.beginPath();

    canvasAction = "canvasUp";

    sendLocCanvas(canvasAction, loc, strokesColorEmit, strokesWidthEmit);
  });

  //Eventslisteners Touch

  canvas.addEventListener("touchstart", ReactToTouchDown);

  canvas.addEventListener("touchmove", ReactToTouchMove);

  canvas.addEventListener("touchend", ReactToTouchUp);

  //Touch Events
}

function createTools() {
  // Create Tools
  let widthsArray = [3, 6, 9, 12];

  let strokesWidthsCls = new newElemnt(
    "strokesWidths",
    "div",
    ".toolsContainer"
  );
  strokesWidthsCls.addElement();

  let strokeTextCls = new newElemnt(
    "StorkeP",
    "p",
    ".strokesWidths",
    "Storke:"
  );
  strokeTextCls.addElementAndInnerText();

  let toolsCls = new newElemnt("tools", "div", ".strokesWidths");
  toolsCls.addElement();

  widthsArray.forEach((width) => {
    let strokeWidth = document.createElement("div");
    strokeWidth.className = `strokes stroke${width}`;
    strokeWidth.style.width = `${(1 / width) * 30 + width * 1.2}px`;
    strokeWidth.style.height = `${(1 / width) * 30 + width * 1.2}px`;
    strokeWidth.style.cursor = "pointer";

    strokeWidth.addEventListener("click", () => {
      lineWidth = width;
      document.querySelector(".strokeSelected").className = "strokes";
      strokeWidth.className = "strokes strokeSelected";
    });

    const tools = document.querySelector(".tools");
    tools.appendChild(strokeWidth);
  });

  document.querySelector(".stroke3").className = "strokes strokeSelected";
}

function createColors() {
  // Create Colors
  let colorsArray = [
    "white",
    "black",
    "red",
    "blue",
    "orange",
    "peru",
    "cyan",
    "yellow",
    "green",
  ];
  let colorsCls = new newElemnt("colors", "div", ".toolsContainer");
  colorsCls.addElement();

  let colorsTextCls = new newElemnt("ColorsP", "p", ".colors", "Colors:");
  colorsTextCls.addElementAndInnerText();

  let colorsDivCls = new newElemnt("colorsDiv", "div", ".colors");
  colorsDivCls.addElement();

  let newCanvasIconCls = new newElemnt(
    "eraseCanvas",
    "p",
    ".colorsDiv",
    "New +"
  );
  newCanvasIconCls.addElementAndInnerText();
  const newCanvasIcon = document.querySelector(".eraseCanvas");
  newCanvasIcon.style.margin = "0 5%";
  newCanvasIcon.style.cursor = "pointer";

  newCanvasIcon.addEventListener("click", () => {
    context.fillStyle = "rgb(255, 255, 255)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    canvasAction = "eraseCanvas";

    sendLocCanvas(canvasAction, loc, strokesColorEmit, strokesWidthEmit);
  });

  colorsArray.forEach((colorArray) => {
    let colorDiv = document.createElement("div");
    colorDiv.className = `buttonColors buttonColor${colorArray}`;
    colorDiv.style.background = `${colorArray}`;
    colorDiv.style.cursor = "pointer";

    colorDiv.addEventListener("click", () => {
      colorSet = colorArray;
      document.querySelector(".colorSelected").className = "buttonColors";
      colorDiv.className = "buttonColors colorSelected";
    });

    const colorsDiv = document.querySelector(".colorsDiv");
    colorsDiv.appendChild(colorDiv);
  });

  document.querySelector(".buttonColorblack").className =
    "buttonColors colorSelected";
}

function GetMousePosition(x, y) {
  // Get canvas size and position in web page
  let canvasSizeData = canvas.getBoundingClientRect();
  return {
    x: (x - canvasSizeData.left) * (canvas.width / canvasSizeData.width),
    y: (y - canvasSizeData.top) * (canvas.height / canvasSizeData.height),
  };
}

function ReactToMouseDown(e) {
  canvas.style.cursor = "crosshair";

  context.strokeStyle = colorSet;
  context.lineWidth = lineWidth;

  strokesColorEmit = colorSet;
  strokesWidthEmit = lineWidth;

  loc = GetMousePosition(e.clientX, e.clientY);
  mousedown.x = loc.x;
  mousedown.y = loc.y;
  usingBrush = true;
  ReactToMouseMove(e);

  canvasAction = "canvasDown";

  sendLocCanvas(canvasAction, loc, strokesColorEmit, strokesWidthEmit);
}

function ReactToMouseMove(e) {
  canvas.style.cursor = "crosshair";

  context.strokeStyle = colorSet;
  context.lineWidth = lineWidth;

  strokesColorEmit = colorSet;
  strokesWidthEmit = lineWidth;

  if (!usingBrush) return;
  context.lineCap = "round";
  loc = GetMousePosition(e.clientX, e.clientY);
  context.lineTo(loc.x, loc.y);
  context.stroke();
  context.beginPath();
  context.moveTo(loc.x, loc.y);

  canvasAction = "canvasMove";

  sendLocCanvas(canvasAction, loc, strokesColorEmit, strokesWidthEmit);
}

function ReactToMouseUp(e) {
  canvas.style.cursor = "default";
  loc = GetMousePosition(e.clientX, e.clientY);
  usingBrush = false;
  context.beginPath();

  canvasAction = "canvasUp";

  sendLocCanvas(canvasAction, loc, strokesColorEmit, strokesWidthEmit);
}

function ReactToTouchDown(e) {
  context.strokeStyle = colorSet;
  context.lineWidth = lineWidth;

  strokesColorEmit = colorSet;
  strokesWidthEmit = lineWidth;

  clientTouchX = e.touches[0].clientX;
  clientTouchY = e.touches[0].clientY;

  loc = GetMousePosition(clientTouchX, clientTouchY);
  // Store mouse position when clicked
  mousedown.x = loc.x;
  mousedown.y = loc.y;
  // Store that yes the mouse is being held down
  usingBrush = true;

  canvasAction = "canvasDown";

  sendLocCanvas(canvasAction, loc, strokesColorEmit, strokesWidthEmit);

  ReactToTouchMove(e);

  e.preventDefault(e);
}

function ReactToTouchMove(e) {
  if (!usingBrush) return;

  context.lineCap = "round";

  context.strokeStyle = colorSet;
  context.lineWidth = lineWidth;

  strokesColorEmit = colorSet;
  strokesWidthEmit = lineWidth;

  clientTouchX = e.touches[0].clientX;
  clientTouchY = e.touches[0].clientY;

  loc = GetMousePosition(clientTouchX, clientTouchY);

  context.lineTo(loc.x, loc.y);
  context.stroke();
  context.beginPath();
  context.moveTo(loc.x, loc.y);

  canvasAction = "canvasMove";

  sendLocCanvas(canvasAction, loc, strokesColorEmit, strokesWidthEmit);

  if (loc.x < 0 || loc.x > canvasWidth || loc.y < 0 || loc.y > canvasHeight) {
    usingBrush = false;

    context.beginPath();

    canvasAction = "canvasUp";

    sendLocCanvas(canvasAction, loc, strokesColorEmit, strokesWidthEmit);
  }

  e.preventDefault(e);
}

function ReactToTouchUp(e) {
  loc = GetMousePosition(e.clientX, e.clientY);
  usingBrush = false;
  context.beginPath();

  canvasAction = "canvasUp";

  sendLocCanvas(canvasAction, loc, strokesColorEmit, strokesWidthEmit);

  e.preventDefault(e);
}

// Proyect what others user paint

export function drawMoventDown(loc, strokesColorEmit, strokesWidthEmit) {
  context.strokeStyle = strokesColorEmit;
  context.lineWidth = strokesWidthEmit;

  mousedown.x = loc.x;
  mousedown.y = loc.y;

  usingBrush = true;

  drawMovementMove(loc, strokesColorEmit, strokesWidthEmit);
}

export function drawMovementMove(loc, strokesColorEmit, strokesWidthEmit) {
  context.strokeStyle = strokesColorEmit;
  context.lineWidth = strokesWidthEmit;

  context.lineCap = "round";

  context.lineTo(loc.x, loc.y);
  context.stroke();
  context.beginPath();
  context.moveTo(loc.x, loc.y);
}

export function drawMovementUp() {
  usingBrush = false;
  context.beginPath();
}

export function eraseCanvas() {
  context.fillStyle = "rgb(255, 255, 255)";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

export function removeCanvasEvLi() {
  canvas.removeEventListener("mousedown", ReactToMouseDown);
  canvas.removeEventListener("mousemove", ReactToMouseMove);
  canvas.removeEventListener("mouseup", ReactToMouseUp);
  canvas.removeEventListener("touchstart", ReactToTouchDown);
  canvas.removeEventListener("touchmove", ReactToTouchMove);
  canvas.removeEventListener("touchend", ReactToTouchUp);

  canvas.style.cursor = "default";

  let canvasPainted = canvas.toDataURL();
  emitCanvasPainted(canvasPainted);
}
