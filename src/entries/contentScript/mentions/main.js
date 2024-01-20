import browser from "webextension-polyfill";

// TODO: think about combining all content scripts into one, so I dont duplicate event listeners and mutation observers

(function () {
  if (window.hasMentionsRun) {
    return;
  }
  window.hasMentionsRun = true;

  const doc = document.body || document || window;

  createNavbarButton();
  // why does chrome need a timeout here and not firefox???
  setTimeout(() => getAllMentionsOnInit(), 500);

  const mentionBtn = document.querySelector(".mentions__navbar__button");

  mentionBtn.addEventListener("click", function () {
    browser.runtime.sendMessage("showOptions");
  });

  function createNavbarButton() {
    const navbar = document.querySelector(".topbarbody");
    const navbarDmEl = navbar.children[10];
    const buttonContainer = document.createElement("div");
    const buttonText = document.createElement("a");
    buttonContainer.classList.add("topbarbutton", "mentions__navbar__button");
    buttonText.textContent = "mentions";
    buttonContainer.appendChild(buttonText);
    navbar.insertBefore(buttonContainer, navbarDmEl);
  }

  function getAllMentionsOnInit() {
    const messageWrapper = document.querySelectorAll(".jGrowl-message");
    if (!messageWrapper?.length) return;
    const formattedMentions = getFormattedMentions(messageWrapper);
    setUniqueMentionsToLocalStorage(formattedMentions);
  }

  // CHECK: if we need to sort by date, because id might be enough to sort by. Newer mentions have higher id's...

  function getFormattedMentions(wrapper) {
    let formattedMentions = [];
    wrapper.forEach((message) => {
      const id = message.children[0].dataset.id;
      const link = message.querySelector(".quotedPostLink");
      const href = link.href;
      const text = message.textContent;
      const regex = /\d{2}-\d{2}-\d{4} @ \d{2}:\d{2}:\d{2}/;
      const date = text.match(regex)?.[0];
      const dateObject = new Date(
        date.replace(
          /(\d{2})-(\d{2})-(\d{4}) @ (\d{2}):(\d{2}):(\d{2})/,
          "$3-$2-$1T$4:$5:$6"
        )
      ).getTime();
      const mention = { id, href, text, date: dateObject };
      formattedMentions.push(mention);
    });
    return formattedMentions;
  }

  async function setUniqueMentionsToLocalStorage(formattedMentions) {
    const storage = await browser.storage.local.get("mentions");
    const mentionsLocalList = storage.mentions;
    if (!mentionsLocalList) {
      browser.storage.local.set({ mentions: formattedMentions });
      return;
    } else {
      formattedMentions.forEach((mention) => {
        const id = mention.id;
        const idInLocal = mentionsLocalList.find(
          (mention) => mention.id === id
        );
        if (!idInLocal) {
          mentionsLocalList.push(mention);
        }
      });
      browser.storage.local.set({ mentions: mentionsLocalList });
    }
  }

  const mutationCallback = (records, observer) => {
    for (const record of records) {
      if (record.type === "childList" && record.target.id === "#jGrowl") {
        const messageWrapper =
          record.target.querySelectorAll(".jGrowl-message");
        if (!messageWrapper.length) return;
        const formattedMentions = getFormattedMentions(messageWrapper);
        setUniqueMentionsToLocalStorage(formattedMentions);
      }
    }
  };

  const observer = new MutationObserver(mutationCallback);
  const config = { attributes: true, childList: true, subtree: true };
  observer.observe(doc, config);
})();
