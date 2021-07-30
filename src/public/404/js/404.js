const $JaretoLogo = document.querySelector(".JaretoLogo");
const $rectBlue = document.querySelector(".rectBlue");
const $JaretoImagen = document.querySelector(".JaretoImagen");
const $rectsYellow = document.querySelectorAll(".rectYellow");
const $rectsGreen = document.querySelectorAll(".rectGreen");

let showJareto = 0;

let isAnimating = false;
let endOfAnimation = false;

function moveIn() {
  isAnimating = true;
  if (showJareto < 5) showJareto += 1;
  if (showJareto === 5) $JaretoImagen.style.opacity = "1";
  $rectBlue.style.transform = "translate(-10%, 15%)";
  $rectsYellow.forEach((yellow) => {
    yellow.style.transform = "translate(-35%, -10%)";
  });
  $rectsGreen.forEach((green) => {
    green.style.transform = "translate(10%, -10%)";
  });

  setTimeout(() => {
    endOfAnimation = true;
  }, 400);
}

function moveOut() {
  $rectBlue.style.transform = "translate(0, 0)";
  $JaretoImagen.setAttribute(
    "transform",
    "translate(0, 0) rotate(-180 401 750)"
  );
  $rectsYellow.forEach((yellow) => {
    yellow.style.transform = "translate(0, 0)";
  });
  $rectsGreen.forEach((green) => {
    green.style.transform = "translate(0, 0)";
  });
}

$JaretoLogo.addEventListener("mouseenter", () => {
  if (!isAnimating) moveIn();
});

$JaretoLogo.addEventListener("mouseleave", () => {
  if (endOfAnimation) {
    moveOut();
    setTimeout(() => {
      isAnimating = false;
      endOfAnimation = false;
    }, 400);
  }
});
