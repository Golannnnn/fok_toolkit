import browser from "webextension-polyfill";

(function () {
  if (window.hasMentionsRun) {
    return;
  }
  window.hasMentionsRun = true;

  const pageWrapper = document.querySelector("#pageWrapper");
  const scrollDownIcon = document.createElement("img");
  const scrollUpIcon = document.createElement("img");

  scrollDownIcon.classList.add("scroll__icon", "scroll__icon__down");
  scrollUpIcon.classList.add("scroll__icon", "scroll__icon__up");

  scrollDownIcon.setAttribute(
    "src",
    browser.runtime.getURL("images/arrow-down.svg")
  );
  scrollUpIcon.setAttribute(
    "src",
    browser.runtime.getURL("images/arrow-up.svg")
  );

  pageWrapper.append(scrollDownIcon);
  pageWrapper.append(scrollUpIcon);

  if (window.innerWidth < 1050) {
    scrollDownIcon.style.display = "none";
    scrollUpIcon.style.display = "none";
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth < 1050) {
      scrollDownIcon.style.display = "none";
      scrollUpIcon.style.display = "none";
    } else {
      scrollDownIcon.style.display = "block";
      scrollUpIcon.style.display = "block";
    }
  });

  scrollDownIcon.addEventListener("click", () => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  scrollUpIcon.addEventListener("click", () => {
    window.scrollTo(0, 0);
  });
})();
