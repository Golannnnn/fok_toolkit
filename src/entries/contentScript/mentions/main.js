import browser from "webextension-polyfill";

// TODO: think about combining all content scripts into one, so I dont duplicate event listeners and mutation observers

(function () {
  if (window.hasMentionsRun) {
    return;
  }
  window.hasMentionsRun = true;

  const doc = document.body || document || window;

  createNavbarButton();
  getAllMentionsOnInit();

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
    const container = document.querySelector("#jGrowl");
    if (!container) return;
    const messageWrapper = container.querySelectorAll(".jGrowl-message");
    if (!messageWrapper?.length) return;
    const formattedMentions = getFormattedMentions(messageWrapper);
    setUniqueMentionsToLocalStorage(formattedMentions);
  }

  function getFormattedMentions(wrapper) {
    let formattedMentions = [];
    wrapper.forEach((message) => {
      const id = message.children[0].dataset.id;
      const link = message.querySelector(".quotedPostLink");
      const href = link.href;
      const regex = /<[^>]*>/g;
      const text = message.innerHTML.replace(regex, "");
      const mention = { id, href, text };
      formattedMentions.unshift(mention);
    });
    return formattedMentions;
  }

  async function setUniqueMentionsToLocalStorage(formattedMentions) {
    const mentionsLocal = await browser.storage.local.get("mentions");
    const mentionsLocalList = mentionsLocal.mentions;
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
          mentionsLocalList.unshift(mention);
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
        console.log("messageWrapper", messageWrapper);
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
