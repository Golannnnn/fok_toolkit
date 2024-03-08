import { createElement } from "~/utils/dom";

const NAV_BTN_CLASS = "mentions__navbar__button";

let navBtn = document.querySelector(`.${NAV_BTN_CLASS}`);

const isAndroid = /Android/.test(navigator.userAgent);

if (!navBtn) {
  navBtn = isAndroid ? createNavbarBtnAndroid() : createNavbarBtn();
}

function createNavbarBtnAndroid() {
  const menu = document.getElementById("fok");
  if (!menu) {
    return;
  }

  const ul = menu.children[1];
  if (!ul) {
    return;
  }

  const li = createElement("li");
  const a = createElement("a", {
    textContent: "mentions",
    className: NAV_BTN_CLASS,
  });

  li.append(a);
  ul.append(li);

  return a;
}

function createNavbarBtn() {
  const navbar = document.querySelector(".topbarbody");
  if (!navbar) {
    return;
  }

  const navbarDmEl = navbar.children[10];
  if (!navbarDmEl) {
    return;
  }

  const buttonContainer = createElement("div", {
    classes: ["topbarbutton", NAV_BTN_CLASS],
  });
  const buttonText = createElement("a", {
    textContent: "mentions",
  });

  buttonContainer.append(buttonText);
  navbar.insertBefore(buttonContainer, navbarDmEl);

  return buttonContainer;
}

export default navBtn;
