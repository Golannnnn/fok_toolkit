import browser from "webextension-polyfill";
import navBtn from "./components/navButton";
import { saveItemsToNewFormat } from "./logic/saveItemsToNewFormat";
import { config, observer } from "./logic/mutationObserver";

(function () {
  if (window.hasMentionsRun) {
    return;
  }
  window.hasMentionsRun = true;

  // button in the header that opens the options page
  navBtn.addEventListener("click", () => {
    browser.runtime.sendMessage("showOptions");
  });

  // for users with old items still in storage
  saveItemsToNewFormat();

  // mutation observer to watch for new alerts
  observer.observe(document, config);
})();
