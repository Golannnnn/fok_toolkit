import "sortable-tablesort/sortable.min.css";
import "sortable-tablesort/sortable.min.js";
import "./style.css";
import Scroll from "./Scroll";
import setStyles from "./setStyles";
import initMentions from "./mentions";

(async function () {
  const isAndroid = navigator.userAgent.includes("Android");

  if (!isAndroid) {
    // sets the font and the background image
    await setStyles();
  }

  // initializes the mentions table
  initMentions();

  // initializes the scroll
  if (!isAndroid) {
    const scroll = new Scroll();
    scroll.init();
  }
})();
