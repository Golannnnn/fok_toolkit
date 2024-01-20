import "./style.css";
import browser from "webextension-polyfill";

(async function () {
  const storage = await browser.storage.local.get("mentions");
  const mentionsLocalList = storage.mentions;
  if (!mentionsLocalList) return;

  const mentions = mentionsLocalList.sort((a, b) => a.date - b.date);

  const tbody = document.querySelector("tbody");

  // TODO: add pagination
  // CHECK: if we need to sort by date, because id might be enough to sort by. Newer mentions have higher id's...

  mentions.forEach((mention) => {
    const tr = document.createElement("tr");
    const dateTd = document.createElement("td");
    const textTd = document.createElement("td");
    const deleteTd = document.createElement("td");
    const button = document.createElement("button");
    const a = document.createElement("a");
    const date = new Date(mention.date);
    const dateFormatted = date.toLocaleString("nl-NL", {
      hour12: false,
    });
    const regex = /\d{2}-\d{2}-\d{4} @ \d{2}:\d{2}:\d{2}/;
    const textWithoutDate = mention.text.replace(regex, "");
    const formattedText = textWithoutDate.replaceAll(/amp;/g, "");

    dateTd.innerText = dateFormatted;
    a.href = mention.href;
    a.target = "_blank";
    a.innerText = formattedText;
    button.innerText = "Verwijderen";
    button.classList.add("mentions__button__delete");
    button.dataset.id = mention.id;

    textTd.appendChild(a);
    deleteTd.appendChild(button);
    tr.appendChild(dateTd);
    tr.appendChild(textTd);
    tr.appendChild(deleteTd);
    tbody.prepend(tr);
  });

  async function deleteMention(e) {
    const id = e.target.dataset.id;
    const storage = await browser.storage.local.get("mentions");
    const mentionsLocalList = storage.mentions;
    const newMentionsLocalList = mentionsLocalList.filter(
      (mention) => mention.id !== id
    );
    browser.storage.local.set({ mentions: newMentionsLocalList });
    e.target.parentElement.parentElement.remove();
  }

  tbody.addEventListener("click", (e) => {
    if (e.target.classList.contains("mentions__button__delete")) {
      deleteMention(e);
    }
  });
})();
