import browser from "webextension-polyfill";
import "../../lib/sortable.css";
import "../../lib/sortable";
import "./style.css";
import actions from "~/store/actions";
import { STORAGE_KEY, Store } from "~/store/store";
import Table from "./components/table";
import Pagination from "./components/pagination";
import { addScrollEventListeners } from "./components/scroll";
import { switchActiveTab } from "./logic/switchActiveTab";
import { handleDeleteXBtn } from "./logic/handleDeleteXBtn";
import { handleDeleteAllBtn } from "./logic/handleDeleteAllBtn";
import { handleMaxItemsAlert } from "./logic/handleMaxItemsAlert";
import { handleImport } from "./logic/handleImport";
import { handleExport } from "./logic/handleExport";

const { ITEMS_CHANGE } = actions;

const store = new Store();
const table = new Table();

const paginationContainer = document.getElementById("pagination");
const pagination = new Pagination(paginationContainer);

const alertMessage = document.getElementById("alert");

// pub/sub pattern to watch for changes in the store
store.subscribe(ITEMS_CHANGE, () => {
  table.render(store.state.itemsForPage, store.state.type);
  pagination.update(store.state.totalPages, store.state.page);
  handleMaxItemsAlert(store.state.items.length, alertMessage);
});

const tableContainer = document.getElementById("table-container");
tableContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("mentions__button__delete")) {
    store.deleteItems(e.target.dataset.id);
  }
});

paginationContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "A" && e.target.id !== store.state.page) {
    store.changePage(e.target.id);
  }
});

const tabsContainer = document.getElementById("tabs");
tabsContainer.addEventListener("click", (e) => {
  const dataType = e.target.dataset.type;

  if (e.target.tagName != "BUTTON" || dataType == store.state.type) {
    return;
  }

  switchActiveTab(e);
  store.changeType(dataType);
});

// delete last mentions button
const deleteXBtn = document.getElementById("del-x-mentions-btn");
deleteXBtn.addEventListener("click", () => handleDeleteXBtn(store));

// delete all mentions button
const deleteAllBtn = document.getElementById("del-all-mentions-btn");
deleteAllBtn.addEventListener("click", () => handleDeleteAllBtn(store));

const importBtn = document.getElementById("import-btn");
importBtn.addEventListener("change", (e) => handleImport(e, store));

const exportBtn = document.getElementById("export-btn");
exportBtn.addEventListener("click", async () => await handleExport());

// x button on the alert message to close it
alertMessage.addEventListener("click", (e) => {
  if (e.target.classList.contains("closebtn")) {
    alertMessage.style.display = "none";
  }
});

// for the scroll up and down buttons
addScrollEventListeners();

// when new items are added to storage, add them to the state
function onStorageChanged(changes, area) {
  if (area !== "local" || !changes[STORAGE_KEY]) {
    return;
  }
  store.handleStorageChange(changes);
}

// debouncing because this will be called multiple times in a short period, but I only want to handle it once
let timeoutId = null;
const debouncedOnStorageChanged = (changes, area) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    onStorageChanged(changes, area);
  }, 500);
};

browser.storage.onChanged.addListener(debouncedOnStorageChanged);
