import { sendLocCanvas, emitCanvasPainted } from "./index.js";
import { NewElement } from "./createElements.js";

const canvas = document.querySelector("#canvasPlayer");
const context = canvas.getContext("2d");

let strokesWidthEmit = 3;
let strokesColorEmit = "black";
let canvasAction;

context.lineWidth = 3;

let usingBrush = false;

let colorSet = "black";
let lineWidth = 3;

class Location {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const mousedown = new Location(0, 0);
let loc = new Location(0, 0);

let clientTouchX;
let clientTouchY;

canvas.width = 500;
canvas.height = 400;

const canvasWidth = 500;
const canvasHeight = 400;

//

const $divCanvasContainer = document.querySelector(".canvasContainer");
const $canvasPlayer = document.querySelector("#canvasPlayer");

export function setCanvasSize() {
  const divWidth = $divCanvasContainer.clientWidth / 1.2;
  const divHeight = $divCanvasContainer.clientHeight / 1.3;

  const xScale = divWidth / 500;
  const yScale = divHeight / 400;

  $canvasPlayer.style.transform = `scale(${xScale}, ${yScale})`;
}
setTimeout(setCanvasSize, 500);

function createTools() {
  const widthsArray = [3, 6, 9, 12];

  const strokesWidthsCls = new NewElement(
    "strokesWidths",
    "div",
    ".toolsContainer"
  );
  strokesWidthsCls.addElement();

  const strokeTextCls = new NewElement(
    "StrokeP",
    "p",
    ".strokesWidths",
    "Stroke:"
  );
  strokeTextCls.addElementAndInnerText();

  const toolsCls = new NewElement("tools", "div", ".strokesWidths");
  toolsCls.addElement();

  widthsArray.forEach((width) => {
    const strokeWidth = document.createElement("div");
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
  const colorsArray = [
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
  const colorsCls = new NewElement("colors", "div", ".toolsContainer");
  colorsCls.addElement();

  const colorsTextCls = new NewElement("ColorsP", "p", ".colors", "Colors:");
  colorsTextCls.addElementAndInnerText();

  const colorsDivCls = new NewElement("colorsDiv", "div", ".colors");
  colorsDivCls.addElement();

  const newCanvasIconCls = new NewElement(
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
    const colorDiv = document.createElement("div");
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
  const canvasSizeData = canvas.getBoundingClientRect();
  return {
    x: (x - canvasSizeData.left) * (canvas.width / canvasSizeData.width),
    y: (y - canvasSizeData.top) * (canvas.height / canvasSizeData.height),
  };
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

function ReactToMouseUp(e) {
  canvas.style.cursor = "default";
  loc = GetMousePosition(e.clientX, e.clientY);
  usingBrush = false;
  context.beginPath();

  canvasAction = "canvasUp";

  sendLocCanvas(canvasAction, loc, strokesColorEmit, strokesWidthEmit);
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

function ReactToTouchUp(e) {
  loc = GetMousePosition(e.clientX, e.clientY);
  usingBrush = false;
  context.beginPath();

  canvasAction = "canvasUp";

  sendLocCanvas(canvasAction, loc, strokesColorEmit, strokesWidthEmit);

  e.preventDefault(e);
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

  canvas.addEventListener("mouseout", () => {
    usingBrush = false;
    context.beginPath();

    canvasAction = "canvasUp";

    sendLocCanvas(canvasAction, loc, strokesColorEmit, strokesWidthEmit);
  });

  // Eventslisteners Touch

  canvas.addEventListener("touchstart", ReactToTouchDown);

  canvas.addEventListener("touchmove", ReactToTouchMove);

  canvas.addEventListener("touchend", ReactToTouchUp);

  // Touch Events
}

// Project what others users paint

export function drawMovementMove(
  locDraw,
  strokesColorEmitDraw,
  strokesWidthEmitDraw
) {
  context.strokeStyle = strokesColorEmitDraw;
  context.lineWidth = strokesWidthEmitDraw;

  context.lineCap = "round";

  context.lineTo(locDraw.x, locDraw.y);
  context.stroke();
  context.beginPath();
  context.moveTo(locDraw.x, locDraw.y);
}

export function drawMovementDown(
  locDraw,
  strokesColorEmitDraw,
  strokesWidthEmitDraw
) {
  context.strokeStyle = strokesColorEmitDraw;
  context.lineWidth = strokesWidthEmitDraw;

  mousedown.x = locDraw.x;
  mousedown.y = locDraw.y;

  usingBrush = true;

  drawMovementMove(locDraw, strokesColorEmitDraw, strokesWidthEmitDraw);
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

  const canvasPainted = canvas.toDataURL();
  emitCanvasPainted(canvasPainted);
}
