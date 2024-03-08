import browser from "webextension-polyfill";

const scrollUpEl = document.querySelector(".scroll__icon__up");
const scrollDownEl = document.querySelector(".scroll__icon__down");

const scrollUpIcon = browser.runtime.getURL("images/arrow-up.svg");
const scrollDownIcon = browser.runtime.getURL("images/arrow-down.svg");

scrollUpEl.setAttribute("src", scrollUpIcon);
scrollDownEl.setAttribute("src", scrollDownIcon);

function onClickScrollDown() {
  window.scrollTo(0, document.body.scrollHeight);
}

function onClickScrollUp() {
  window.scrollTo(0, 0);
}

export function addScrollEventListeners() {
  scrollDownEl.addEventListener("click", onClickScrollDown);
  scrollUpEl.addEventListener("click", onClickScrollUp);
}
