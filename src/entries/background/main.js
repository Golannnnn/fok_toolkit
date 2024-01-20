import browser from "webextension-polyfill";

(function () {
  browser.runtime.onMessage.addListener((request) => {
    if (request === "showOptions") {
      browser.runtime.openOptionsPage();
    }
  });
})();
