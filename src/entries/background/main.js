import browser from "webextension-polyfill";

(function () {
  // button in the header that opens the options page
  browser.runtime.onMessage.addListener((request) => {
    if (request === "showOptions") {
      browser.runtime.openOptionsPage();
    }
  });

  // v3 uses action instead of browserAction
  const clickAction =
    browser.browserAction?.onClicked || browser.action.onClicked;

  // button in the browser action that opens the options page
  clickAction.addListener(() => {
    browser.runtime.openOptionsPage();
  });
})();
