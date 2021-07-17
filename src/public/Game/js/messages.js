import { emitChatMessage } from "./index.js";

export function eraseChatContent() {
  const texts = document.querySelectorAll(".text");

  texts.forEach((text) => {
    text.remove();
  });
}

// Message submit
const chatForm = document.querySelector("#chat-form");

const $msgInput = document.querySelector(".msg-input");

$msgInput.addEventListener("keyup", function () {
  setCharLimit($msgInput);
});
function setCharLimit(input) {
  let maxLength = 25;

  if (input.value.length > maxLength) {
    input.value = input.value.substring(0, maxLength);
  }
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  const msg = clearSpaces(e.target.elements.msg.value);

  // Emit message to server
  emitChatMessage(msg);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function clearSpaces(value) {
  (value = value.replace(/[ ]{2,}/gi, " ")),
    (value = value.replace(/(^\s*)|(\s*$)/gi, "")),
    (value = value.replace(/\n /, "\n"));
  return value;
}

const messageInput = document.querySelector(".msg-input");
messageInput.setAttribute("disabled", "disabled");
messageInput.disabled = false;

const messageBtun = document.querySelector(".btn");
messageBtun.setAttribute("disabled", "disabled");
messageBtun.disabled = false;

// Output message to DOM
export function outputMessage(message, userColor) {
  const $chatMessages = document.querySelector(".chatMessages");

  const rgb = hexToRgb(userColor);

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

  const text = document.createElement("p");
  text.className = "text";
  text.innerText = `${message}`;
  text.style.borderLeft =
    `0.5em solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)` ||
    "0.5em solid rgba(0, 0, 0, 0.5)";

  $chatMessages.appendChild(text);

  // Scroll down
  $chatMessages.scrollTop = $chatMessages.scrollHeight;
}

export function outputMessageWord(userName, seconds) {
  if (seconds === 15) {
    const $chatMessages = document.querySelector(".chatMessages");

    const text = document.createElement("p");
    text.className = "text textSecondsWord";
    text.innerText = `${userName} choosing word. ${seconds}`;

    $chatMessages.appendChild(text);
    $chatMessages.scrollTop = $chatMessages.scrollHeight;
  } else {
    const $textSecondsWord =
      document.querySelector(".textSecondsWord") || document.createElement("p");
    $textSecondsWord.className = "text textSecondsWord";
    $textSecondsWord.innerText = `${userName} choosing word. ${seconds}`;
  }
}

export function disableInputChat() {
  messageInput.value = "";
  messageInput.disabled = true;
  messageBtun.disabled = true;
}
