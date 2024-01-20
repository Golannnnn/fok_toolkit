import "./style.css";
import browser from "webextension-polyfill";

(async function () {
  const mentionsLocal = await browser.storage.local.get("mentions");
  const mentionsLocalList = mentionsLocal.mentions;
  if (!mentionsLocalList) return;

  const tbody = document.querySelector("tbody");

  // TODO: sort by date
  // TODO: add pagination

  mentionsLocalList.forEach((mention) => {
    const tr = document.createElement("tr");
    const dateTd = document.createElement("td");
    const textTd = document.createElement("td");
    const deleteTd = document.createElement("td");
    const button = document.createElement("button");
    const a = document.createElement("a");

    const regex = /(\d{2}-\d{2}-\d{4})\s@\s(\d{2}:\d{2}:\d{2})/g;
    const dateAndTime = mention.text.match(regex)?.[0];
    const text = mention.text.replace(regex, "");
    const formattedText = text.replace(/amp;/g, "");

    dateTd.innerText = dateAndTime;
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
    const mentionsLocal = await browser.storage.local.get("mentions");
    const mentionsLocalList = mentionsLocal.mentions;
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
