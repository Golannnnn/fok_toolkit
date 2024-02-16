import "sortable-tablesort/sortable.min.css";
import "sortable-tablesort/sortable.min.js";
import "./style.css";
import Scroll from "./Scroll";
import setStyles from "./setStyles";
import initMentions from "./mentions";

(async function () {
  // sets the font and the background image
  await setStyles();

  // initializes the mentions table
  initMentions();

  // initializes the scroll
  const scroll = new Scroll();
  scroll.init();
})();
