import * as header from "./header";

const playSwitcher = document.querySelector(".play-btn-circle");
const card = document.querySelectorAll(".card");
const cardContainer = document.querySelectorAll(".card__flip");

const startGameBtn = document.createElement("div");
const finishGame = document.createElement("div");
const startGameBtnWrapper = document.createElement("div");
const finishGameWrapper = document.createElement("div");
const resultWrapper = document.createElement("div");
const resultText = document.createElement("div");
const resultPic = document.createElement("div");

let soundSrc = [];
const words = [];
let correctAnswerCount = 0;
let wrongAnswerCount = 0;

startGameBtn.className = "startGameBtn";
finishGame.className = "finish__game";
startGameBtnWrapper.className = "popup__overlay";
finishGameWrapper.className = "popup__overlay-finish";
resultWrapper.className = "result__wrapper";
resultPic.className = "result__wrapper-pic";
resultText.className = "result__wrapper-text";

document.body.append(startGameBtnWrapper);
document.body.append(finishGameWrapper);
startGameBtnWrapper.append(startGameBtn);
finishGameWrapper.append(finishGame);
finishGame.append(resultWrapper);
resultWrapper.append(resultText);
resultWrapper.append(resultPic);

header.playBtnWrapper.addEventListener("click", () => {
  if (header.playSwCircle.classList.contains("active")) {
    header.playSwCircle.classList.remove("active");
    header.playSwCircle.classList.remove("start");
    header.playSwCircle.textContent = "Train";
  } else {
    header.playSwCircle.classList.add("active");
    header.playSwCircle.textContent = "Play";
  }
});

function removeClass() {
  startGameBtnWrapper.classList.remove("active");
  startGameBtn.classList.remove("active");

  card.forEach((item) => {
    item.classList.remove("play");
    item.classList.add("training");
    item.classList.remove("wrong-blur");
    item.classList.remove("correct-blur");
    cardContainer.forEach((el) => {
      el.classList.remove("resize__heigth");
    });
  });
}

header.playBtnWrapper.addEventListener("click", () => {
  if (playSwitcher.classList.contains("active")) {
    startGameBtnWrapper.classList.add("active");
    startGameBtn.classList.add("active");
    startGameBtn.textContent = "Start";

    card.forEach((item) => {
      item.classList.remove("training");
      item.classList.add("play");
      cardContainer.forEach((el) => {
        el.classList.add("resize__heigth");
      });
    });
  } else {
    startGameBtn.classList.remove("start");
    removeClass();
  }
});

function playSound(source) {
  const audio = new Audio();
  audio.preload = "auto";
  audio.src = source;
  audio.play();
}

cardContainer.forEach((item) => {
  item.addEventListener("click", (e) => {
    if (!playSwitcher.classList.contains("active") &&
      !e.target.classList.contains("reverse") &&
      !item.classList.contains("transform")) {
      soundSrc = item.getAttribute("audioSrc");
      playSound(soundSrc);
    }
  });
});

function getContent(){
  cardContainer.forEach((item) => {
    if (item.parentNode.parentNode.classList.contains("show")) {
      const dataForPlay = [];
      dataForPlay.push(item);
      dataForPlay.forEach((el) => {
        soundSrc.push(el.getAttribute("audioSrc"));
        words.push(el.getAttribute("data"));
      });
    }
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startGameSwitcher() {
  const starsWrapper = document.createElement("div");
  starsWrapper.className = "stars__wrapper";
  header.modeWrapper.prepend(starsWrapper);

  if (playSwitcher.classList.contains("active")) {
    startGameBtnWrapper.classList.add("active");
    startGameBtn.classList.add("active");
  }

  startGameBtn.addEventListener("click", () => {

    if (playSwitcher.classList.contains("active") &&
      startGameBtn.classList.contains("active") &&
      !startGameBtn.classList.contains("start")) {
      startGameBtn.classList.add("start");
      startGameBtn.textContent = "STOP";

      if (startGameBtn.classList.contains("start")) {
        getContent();
        shuffleArray(soundSrc);
        setTimeout(playSound, 300, soundSrc[0]);
        let count = 0;

        card.forEach((item) => {
          item.addEventListener("click", function (e) {
            const firstSound = soundSrc[0].slice(17, -4);
            const sound = soundSrc[count].slice(17, -4);
            const starElemWrapper = document.createElement("div");
            starElemWrapper.className = "star__elem-wrapper";
            starsWrapper.append(starElemWrapper);
            const data = e.target.previousSibling.parentNode.parentNode.getAttribute("data");

            if (data === sound || data === firstSound) {
              correctAnswerCount++;
              playSound("assets/img/audio/correct-answer.mp3");
              starElemWrapper.style.background = "url('assets/img/Orange_star.svg') center center/cover no-repeat";
              item.classList.add("correct-blur");
            } else {
              wrongAnswerCount++;
              playSound("assets/img/audio/bad-answer.mp3");
              starElemWrapper.style.background = "url('assets/img/Gray_star.svg') center center/cover no-repeat";
              item.classList.add("wrong-blur");
            }
            count++;
            if (count < soundSrc.length) {
              setTimeout(playSound, 1000, soundSrc[count]);
            } else {
              startGameBtn.classList.remove("start");
              playSwitcher.classList.remove("active");
              removeClass();
              finishGame.classList.add("active");
              finishGameWrapper.classList.add("active");
              resultText.textContent = `Your result: ${correctAnswerCount} right answers & ${wrongAnswerCount} wrong answers`;
              if (wrongAnswerCount > 0) {
                resultPic.style.background = "url('assets/img/you-lose.jpg') center center/cover no-repeat";
              } else {
                resultPic.style.background = "url('assets/img/you-win.jpg') center center/cover no-repeat";
              }
            }
          });
        });
      }
    } else {
      header.playSwCircle.classList.remove("start");
      startGameBtn.classList.remove("start");
      playSwitcher.classList.remove("active");
      removeClass();
    }
  });
}

startGameSwitcher();

function deleteElem(block) {
  block.forEach((item) => {
    item.parentNode.removeChild(item);
  });
}

document.body.addEventListener("click", function (e) {
  if (e.target === finishGameWrapper) {
    finishGameWrapper.classList.remove("active");
    finishGame.classList.remove("active");
    const starsElement = document.querySelectorAll(".star__elem-wrapper");
    deleteElem(starsElement);
  }
});
