import browser from "webextension-polyfill";

const scrollUpEl = document.querySelector(".scroll__icon__up");
const scrollDownEl = document.querySelector(".scroll__icon__down");

const scrollUpIcon = browser.runtime.getURL("images/arrow-up.svg");
const scrollDownIcon = browser.runtime.getURL("images/arrow-down.svg");

scrollUpEl.setAttribute("src", scrollUpIcon);
scrollDownEl.setAttribute("src", scrollDownIcon);

function scrollDisplay(style) {
  scrollUpEl.style.display = style;
  scrollDownEl.style.display = style;
}

function updateIconsDisplay() {
  if (window.innerWidth < 1150) {
    scrollDisplay("none");
  } else {
    scrollDisplay("block");
  }
}

function onClickScrollDown() {
  window.scrollTo(0, document.body.scrollHeight);
}

function onClickScrollUp() {
  window.scrollTo(0, 0);
}

export function addScrollEventListeners() {
  window.addEventListener("resize", updateIconsDisplay);
  scrollDownEl.addEventListener("click", onClickScrollDown);
  scrollUpEl.addEventListener("click", onClickScrollUp);

  if (window.innerWidth < 1150) {
    scrollDisplay("none");
  }
}
