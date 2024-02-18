import browser from "webextension-polyfill";
import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
} from "../../utils/storage.js";
import {
  calculatePages,
  sliceMentionsForPage,
  renderPagination,
  setActiveClass,
} from "./pagination.js";

const state = {
  mentions: [],
  currentPage: 1,
  itemsPerPage: 200,
};

const regex =
  /(\d{2}-\d{2}-\d{4} @ \d{2}:\d{2}:\d{2})\s*([^\s]+)\s*heeft.*(gequote|geliket|genoemd)\s*in(?:\s*topic)?\s*"(.*?)"/;

const dateColumn = document.getElementById("date-column");

const importBtn = document.getElementById("import-btn");
const exportBtn = document.getElementById("export-btn");

async function initMentions() {
  const mentionsFromLocalStorage = await getLocalStorage("mentions");
  state.mentions = setMentions(mentionsFromLocalStorage);

  const slicedMentionsForPage = sliceMentionsForPage(
    state.mentions,
    state.currentPage,
    state.itemsPerPage
  );
  populateTable(slicedMentionsForPage);

  // because the table is sorting by asc date, click twice to sort by desc date
  if (state.mentions.length) {
    dateColumn.click();
    dateColumn.click();
  }

  // create pagination links based on how many pages we need
  const paginationContainer = document.getElementById("pagination");
  const pageCount = calculatePages(state.mentions, state.itemsPerPage);
  renderPagination(paginationContainer, pageCount);

  const deleteAllMentionsBtn = document.getElementById("del-all-mentions-btn");
  deleteAllMentionsBtn.addEventListener("click", async () =>
    deleteAllMentions(state.mentions)
  );

  paginationContainer.addEventListener("click", handlePageClick);

  const table = document.querySelector("table");
  table.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("mentions__button__delete")) {
      return;
    }
    await deleteMention(e);
    handleEmptyPage();
  });

  exportBtn.addEventListener("click", async () => {
    await handleExportBtnClick();
  });
  importBtn.addEventListener("change", async (e) => {
    await handleImportBtnChange(e);
  });

  let timeoutId = null;
  const debouncedLogStorageChange = (changes, area) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      logStorageChange(changes, area);
    }, 1000);
  };

  browser.storage.onChanged.addListener(debouncedLogStorageChange);
}

async function handleImportBtnChange(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = async function () {
    const mentions = JSON.parse(reader.result);
    const mentionsFromLocalStorage = await getLocalStorage("mentions");
    const newMentions = mentions.filter(
      (m) => !mentionsFromLocalStorage.some((sm) => sm.id === m.id)
    );

    if (newMentions.length) {
      const updatedMentions = [...mentionsFromLocalStorage, ...newMentions];
      await setLocalStorage("mentions", updatedMentions);
      location.reload();
    }
  };

  reader.readAsText(file);
}

async function handleExportBtnClick() {
  const mentionsFromLocalStorage = await getLocalStorage("mentions");
  const blob = new Blob([JSON.stringify(mentionsFromLocalStorage)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mentions.json";
  a.click();
  URL.revokeObjectURL(url);
}

function logStorageChange(changes, area) {
  if (area !== "local" || !changes.mentions) {
    return;
  }

  const newMentionsFromStorage = changes.mentions.newValue;
  if (
    !newMentionsFromStorage ||
    newMentionsFromStorage.length <= state.mentions.length
  ) {
    return;
  }

  // filter out the mentions that are already in the state
  const newMentions = newMentionsFromStorage.filter(
    (m) => !state.mentions.some((sm) => sm.id === m.id)
  );

  if (!newMentions.length) {
    return;
  }

  state.mentions.unshift(...newMentions);

  // only if on first page, add mention to dom
  if (state.currentPage != 1) {
    return;
  }

  prependMentionsToTable(newMentions);
  // because the table is sorting by asc date, click twice to sort by desc date
  dateColumn.click();
  dateColumn.click();
}

async function deleteMention(e) {
  console.log("deleteMention___________");

  // get mentions from local storage, filter the one to delete, and set the new array to local storage
  const mentionToDelete = e.target;
  const mentionsFromLocalStorage = await getLocalStorage("mentions");
  const remainingMentions = mentionsFromLocalStorage.filter(
    (m) => m.id !== mentionToDelete.dataset.id
  );
  await setLocalStorage("mentions", remainingMentions);

  state.mentions = setMentions(remainingMentions);
  // remove the mention from the table
  mentionToDelete.parentElement.parentElement.remove();
  console.log("deleteMention end___________");
}

// handles the case when the last mention is deleted from the page
function handleEmptyPage() {
  console.log("handleEmptyPage_______");
  const renderedMentions = document.querySelectorAll(".mention");
  // if there are mentions left, nothing to do
  if (renderedMentions?.length) {
    return;
  }

  console.log("handleEmptyPage after there are no mentions_______");

  // +1 because state.currentPage is not yet updated
  const pageCount = calculatePages(state.mentions, state.itemsPerPage) + 1;
  let links = document.getElementById("pagination").childNodes;

  // for last page
  if (state.currentPage == pageCount && pageCount > 1) {
    links[links.length - 1].remove();
    links = document.getElementById("pagination").childNodes;
    state.currentPage--;
    setActiveClass(links[links.length - 1]);
    // for first page if there are more pages
  } else if (state.currentPage == 1 && pageCount > 1) {
    links[0].remove();
    links = document.getElementById("pagination").childNodes;
    setActiveClass(links[0]);
    // for middle pages
  } else if (state.currentPage < pageCount && state.currentPage > 1) {
    links[state.currentPage].remove();
  }

  links.forEach((link, i) => {
    link.id = i + 1;
    link.innerText = i + 1;
  });

  if (!state.mentions.length) {
    return;
  }

  const slicedMentionsForPage = sliceMentionsForPage(
    state.mentions,
    state.currentPage,
    state.itemsPerPage
  );

  populateTable(slicedMentionsForPage);
  // because the table is sorting by asc date, click twice to sort by desc date
  dateColumn.click();
  dateColumn.click();
}

function handlePageClick(e) {
  if (e.target.tagName !== "A" || e.target.id === state.currentPage) {
    return;
  }

  state.currentPage = e.target.id;
  setActiveClass(e.target);

  if (!state.mentions?.length) {
    return;
  }

  const slicedMentionsForPage = sliceMentionsForPage(
    state.mentions,
    state.currentPage,
    state.itemsPerPage
  );
  populateTable(slicedMentionsForPage);
  // because the table is sorting by asc date, click twice to sort by desc date
  dateColumn.click();
  dateColumn.click();
}

async function deleteAllMentions(mentions) {
  if (!mentions?.length) {
    const alertMessage = "Je hebt geen mentions om te verwijderen";
    alert(alertMessage);
    return;
  }

  const confirmMessage =
    "Weet je zeker dat je al je mentions wilt verwijderen? Je kunt deze actie niet ongedaan maken.";
  if (confirm(confirmMessage)) {
    await removeLocalStorage("mentions");
    state.mentions = [];

    const tbody = document.querySelector("tbody");
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    const paginationContainer = document.getElementById("pagination");
    paginationContainer.textContent = "";
  }
}

function parseMention(text) {
  const matches = text.match(regex);
  if (!matches) {
    return null;
  }
  const [, date, user, type, topic] = matches;
  const mentionType = getMentionType(type);
  const formattedTopic = topic.replaceAll(/amp;/g, "");
  return { date, user, type: mentionType, topic: formattedTopic };
}

function getMentionType(type) {
  switch (type) {
    case "gequote":
      return "Quote";
    case "geliket":
      return "Like";
    case "genoemd":
      return "Mention";
    default:
      return "Unknown";
  }
}

function createTableRow() {
  const tr = document.createElement("tr");
  const dateTd = document.createElement("td");
  const userTd = document.createElement("td");
  const typeId = document.createElement("td");
  const topicId = document.createElement("td");
  const deleteTd = document.createElement("td");
  const button = document.createElement("button");
  const a = document.createElement("a");
  return { tr, dateTd, userTd, typeId, topicId, deleteTd, button, a };
}

function prependMentionsToTable(mentions) {
  const tbody = document.querySelector("tbody");

  for (let i = 0; i < mentions.length; i++) {
    const mention = mentions[i];

    const { tr, dateTd, userTd, typeId, topicId, deleteTd, button, a } =
      createTableRow();

    const parsedMention = parseMention(mention.text);
    if (!parsedMention) {
      continue;
    }
    const { date, user, type, topic } = parsedMention;

    dateTd.innerText = date;
    userTd.innerText = user;
    typeId.innerText = type;
    a.href = mention.href;
    a.target = "_blank";
    a.innerText = topic;
    a.title = "open topic in nieuw tabblad";
    button.innerText = "X";
    button.classList.add("mentions__button__delete");
    button.dataset.id = mention.id;
    button.title = "verwijder mention";
    tr.className = "mention";

    topicId.append(a);
    deleteTd.append(button);
    tr.append(dateTd, userTd, typeId, topicId, deleteTd);
    tbody.prepend(tr);
  }
}

function populateTable(mentions) {
  if (!mentions?.length) {
    return;
  }

  const tbody = document.querySelector("tbody");
  tbody.textContent = "";

  for (let i = 0; i < mentions.length; i++) {
    const mention = mentions[i];

    const { tr, dateTd, userTd, typeId, topicId, deleteTd, button, a } =
      createTableRow();

    const parsedMention = parseMention(mention.text);
    if (!parsedMention) {
      continue;
    }
    const { date, user, type, topic } = parsedMention;

    dateTd.innerText = date;
    userTd.innerText = user;
    typeId.innerText = type;
    a.href = mention.href;
    a.target = "_blank";
    a.innerText = topic;
    a.title = "open topic in nieuw tabblad";
    button.innerText = "X";
    button.classList.add("mentions__button__delete");
    button.dataset.id = mention.id;
    button.title = "verwijder mention";
    tr.className = "mention";

    topicId.append(a);
    deleteTd.append(button);
    tr.append(dateTd, userTd, typeId, topicId, deleteTd);
    tbody.append(tr);
  }
}

function setMentions(mentions) {
  if (!mentions?.length) {
    return [];
  }
  const sortedMentions = [...mentions].sort((a, b) => b.id - a.id);
  return sortedMentions;
}

export default initMentions;
