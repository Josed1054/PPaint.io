const $smileSad = document.querySelectorAll(".smileSad");

const $pathC = document.querySelectorAll(".pathC");

const $pathFace = document.querySelectorAll(".eyes");

const $pathAbstract = document.querySelectorAll(".abstract");

const $drip1 = document.querySelector(".drip1");
const $drip2 = document.querySelector(".drip2");

function setCssProps(element, variable) {
  if (variable === "rotate") {
    document.querySelector(
      `.${element}`
    ).style.transform = `rotate(${Math.floor(Math.random() * 360)}deg)`;
  } else if (variable === "top") {
    document.querySelector(`.${element}`).style.top = `${Math.floor(
      Math.random() * 20
    )}%`;
  } else if (variable === "bottom") {
    document.querySelector(`.${element}`).style.bottom = `${Math.floor(
      Math.random() * 20
    )}%`;
  } else if (variable === "left") {
    document.querySelector(`.${element}`).style.left = `${Math.floor(
      Math.random() * 20
    )}%`;
  } else if (variable === "right") {
    document.querySelector(`.${element}`).style.right = `${Math.floor(
      Math.random() * 20
    )}%`;
  } else if (variable === "scale") {
    const scales = [0.5, 0.6, 0.8, 0.9, 1, 1.1];

    document.querySelector(`.${element}`).style.transform = `scale(${
      scales[Math.floor(Math.random() * 6 + 1 - 1)]
    })`;
  }
}

const colors2 = [
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

export function domSelectors() {
  const variableSmileSad = ["rotate", "top", "left", "scale"];
  const variableTool = ["rotate", "bottom", "right", "scale"];
  const variableFace = ["rotate", "bottom", "left", "scale"];
  const variablePaint = ["rotate", "top", "right", "scale"];

  setCssProps(
    "smileSadFace",
    variableSmileSad[Math.floor(Math.random() * 4 + 1 - 1)]
  );
  setCssProps("paintTool", variableTool[Math.floor(Math.random() * 4 + 1 - 1)]);
  setCssProps("svgFace", variableFace[Math.floor(Math.random() * 4 + 1 - 1)]);
  setCssProps(
    "abstractPaint",
    variablePaint[Math.floor(Math.random() * 4 + 1 - 1)]
  );

  $smileSad.forEach((sms) => {
    sms.setAttribute(
      "fill",
      `${colors2[Math.floor(Math.random() * 9 + 1 - 1)]}`
    );
  });

  $drip1.setAttribute(
    "fill",
    `${colors2[Math.floor(Math.random() * 9 + 1 - 1)]}`
  );
  $drip2.setAttribute(
    "fill",
    `${colors2[Math.floor(Math.random() * 9 + 1 - 1)]}`
  );

  $pathC.forEach((path) => {
    path.setAttribute(
      "fill",
      `${colors2[Math.floor(Math.random() * 9 + 1 - 1)]}`
    );
  });

  $pathFace.forEach((eye) => {
    eye.setAttribute(
      "fill",
      `${colors2[Math.floor(Math.random() * 9 + 1 - 1)]}`
    );
  });

  $pathAbstract.forEach((abs) => {
    abs.setAttribute(
      "fill",
      `${colors2[Math.floor(Math.random() * 9 + 1 - 1)]}`
    );
  });
}

domSelectors();
