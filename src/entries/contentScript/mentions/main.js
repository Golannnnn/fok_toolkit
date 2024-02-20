import browser from "webextension-polyfill";

(function () {
  if (window.hasMentionsRun) {
    return;
  }
  window.hasMentionsRun = true;

  const doc = document.body || document || window;

  let mentionBtn;

  if (navigator.userAgent.includes("Android")) {
    createNavbarButtonAndroid();
    mentionBtn = document.querySelector(".mentions__navbar__button_android");
  } else {
    createNavbarButton();
    mentionBtn = document.querySelector(".mentions__navbar__button");
  }

  mentionBtn.addEventListener("click", function () {
    browser.runtime.sendMessage("showOptions");
  });

  function createNavbarButtonAndroid() {
    const menu = document.getElementById("fok");
    if (!menu) return;
    const ul = menu.children[1];
    if (!ul) return;
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = "mentions";
    a.classList.add("mentions__navbar__button_android");
    li.appendChild(a);
    ul.appendChild(li);
  }

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

  function getFormattedMentions(wrapper) {
    let formattedMentions = [];
    for (const message of wrapper) {
      const id = message.children[0].dataset.id;
      const link = message.querySelector(".quotedPostLink");
      if (!link) continue;
      const href = link.href;
      const text = message.textContent;
      const mention = { id, href, text };
      console.log(id);
      formattedMentions.push(mention);
    }
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

  const mutationCallback = () => {
    const jGrowl = document.getElementById("jGrowl");
    if (!jGrowl) return;
    const children = jGrowl.children;
    if (!children?.length) return;
    const messageWrappers = jGrowl.querySelectorAll(".jGrowl-message");
    if (!messageWrappers?.length) return;
    const formattedMentions = getFormattedMentions(messageWrappers);
    setUniqueMentionsToLocalStorage(formattedMentions);
  };

  const observer = new MutationObserver(mutationCallback);
  const config = {
    childList: true,
    subtree: true,
  };
  observer.observe(doc, config);
})();
