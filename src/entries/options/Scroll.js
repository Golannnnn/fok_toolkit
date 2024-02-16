import browser from "webextension-polyfill";

class Scroll {
  #scrollDownIcon = document.querySelector(".scroll__icon__down");
  #scrollUpIcon = document.querySelector(".scroll__icon__up");

  #setIconsSrc = () => {
    this.#scrollDownIcon.setAttribute(
      "src",
      browser.runtime.getURL("images/arrow-down.svg")
    );
    this.#scrollUpIcon.setAttribute(
      "src",
      browser.runtime.getURL("images/arrow-up.svg")
    );
  };

  updateIconsDisplay = () => {
    if (window.innerWidth < 1050) {
      this.#scrollDownIcon.style.display = "none";
      this.#scrollUpIcon.style.display = "none";
    } else {
      this.#scrollDownIcon.style.display = "block";
      this.#scrollUpIcon.style.display = "block";
    }
  };

  addEventListeners = () => {
    window.addEventListener("resize", () => this.updateIconsDisplay());
    this.#scrollDownIcon.addEventListener("click", () =>
      window.scrollTo(0, document.body.scrollHeight)
    );
    this.#scrollUpIcon.addEventListener("click", () => window.scrollTo(0, 0));
  };

  init = () => {
    this.#setIconsSrc();
    this.updateIconsDisplay();
    this.addEventListeners();
  };
}

export default Scroll;
