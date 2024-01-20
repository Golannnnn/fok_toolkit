import browser from "webextension-polyfill";

(function () {
  if (window.hasBlockerRun) {
    return;
  }
  window.hasBlockerRun = true;

  const doc = document.body || document || window;
  let posts = document.querySelectorAll("[data-member]");

  init();

  doc.addEventListener("click", (e) => {
    if (e.target.classList.contains("blocker__post__btn--hide")) {
      hidePost(e);
    }

    if (e.target.classList.contains("blocker__post__btn--block")) {
      blockUser(e);
    }

    if (
      e.target.classList.contains(
        "blocker__navbar__overview__list__row__button"
      )
    ) {
      unBlockUser(e);
    }
  });

  function createNavbarButton() {
    const navbar = document.querySelector(".topbarbody");
    const navbarDmEl = navbar.children[10];
    const buttonContainer = document.createElement("div");
    const buttonText = document.createElement("a");
    const overviewContainer = document.createElement("div");
    const overviewTitle = document.createElement("p");
    const list = document.createElement("ul");

    buttonContainer.classList.add("topbarbutton", "blocker__navbar__button");
    overviewContainer.classList.add("blocker__navbar__overview", "fpTracker");
    overviewTitle.classList.add("blocker__navbar__overview__title");
    list.classList.add("blocker__navbar__overview__list");

    buttonText.textContent = "blocker";
    overviewTitle.textContent = "Geblokkeerde gebruikers";

    overviewContainer.appendChild(overviewTitle);
    overviewContainer.appendChild(list);

    buttonContainer.appendChild(buttonText);
    buttonContainer.appendChild(overviewContainer);

    navbar.insertBefore(buttonContainer, navbarDmEl);
  }

  function createPostButtons(el) {
    const blockEl = document.createElement("span");
    const hideEl = document.createElement("span");

    blockEl.classList.add("blocker__post__btn--block");
    hideEl.classList.add("blocker__post__btn--hide");

    blockEl.textContent = "blokkeer";
    hideEl.textContent = "verberg";

    blockEl.title = "blokkeer gebruiker";
    hideEl.title = "verberg dit bericht";

    el.prepend(blockEl);
    el.prepend(hideEl);
  }

  function hidePost(e) {
    const postHeader = e.target.parentElement.parentElement.parentElement;
    const postContent = postHeader.nextElementSibling;
    const isPostHidden = postContent.style.display === "none";
    postContent.style.display = isPostHidden ? "block" : "none";
    e.target.textContent = isPostHidden ? "verberg" : "toon";
  }

  async function addUserNameToLocalStorage(blockedUsers, userName) {
    blockedUsers.push(userName);
    await browser.storage.local.set({ blockedUsers });
  }

  async function getUsersFromLocalStorage() {
    const localData = await browser.storage.local.get("blockedUsers");
    return localData?.blockedUsers ?? [];
  }

  async function blockUser(e) {
    const post = e.target.closest("[data-member]");
    const userName = post.dataset.member;
    const blockedUsers = await getUsersFromLocalStorage();
    if (blockedUsers.includes(userName)) {
      alert("Deze gebruiker is al geblokkeerd, laad de pagina opnieuw.");
      return;
    }
    addUserNameToLocalStorage(blockedUsers, userName);
    performStyleOnUserPosts({ userName, display: "none" });
    hideQuotesOfBlockedUsers(userName);
    addUserToNavbarList(userName);
  }

  function addUserToNavbarList(userName) {
    const list = document.querySelector(".blocker__navbar__overview__list");
    const row = document.createElement("li");
    const text = document.createElement("span");
    const unBlockButton = document.createElement("button");

    row.classList.add("blocker__navbar__overview__list__row");
    text.classList.add("blocker__navbar__overview__list__row__text");

    text.textContent = userName;
    unBlockButton.textContent = "deblokkeer";
    unBlockButton.classList.add("blocker__navbar__overview__list__row__button");

    row.appendChild(text);
    row.appendChild(unBlockButton);

    list.appendChild(row);
  }

  async function unBlockUser(e) {
    const userName = e.target.previousSibling.textContent;
    performStyleOnUserPosts({ userName, display: "block" });
    showQuotesOfUnblockedUsers(userName);

    // this is the name on the navbar overview list
    e.target.parentElement.remove();

    const blockedUsers = await getUsersFromLocalStorage();
    const filteredBlockedUsers = blockedUsers.filter(
      (user) => user !== userName
    );

    await browser.storage.local.set({ blockedUsers: filteredBlockedUsers });
  }

  function performStyleOnUserPosts({ userName, display }) {
    posts.forEach((post) => {
      if (post.dataset.member === userName) {
        post.style.display = display;
      }
    });
  }

  function showQuotesOfUnblockedUsers(userName) {
    const quotes = document.querySelectorAll(".quote");
    quotes.forEach((quote) => {
      if (!quote.classList.contains("blocker__quote")) {
        return;
      }
      // b is the element that contains the username
      const hiddenQuote = quote?.previousElementSibling;
      const b = hiddenQuote.children?.[1];
      const userNameInQuote = b.children?.[1]?.textContent;
      if (userNameInQuote === userName) {
        hiddenQuote.style.display = "block";
        quote.remove();
      }
    });
  }

  function hideQuotesOfBlockedUsers(userName) {
    const quotes = document.querySelectorAll(".quote");
    quotes.forEach((quote) => {
      if (quote.classList.contains("blocker__quote")) {
        return;
      }
      // b is the element that contains the username
      const b = quote.children?.[1];
      if (b) {
        const userNameInQuote = b.children[1].textContent;
        if (userNameInQuote === userName) {
          const parent = quote.parentElement;
          const div = document.createElement("div");
          div.textContent = `${userNameInQuote} is geblokkeerd`;
          div.classList.add("quote", "blocker__quote");
          parent.append(div);
          quote.style.display = "none";
        }
      }
      // TODO: add logic to change split quotes of blocked users
    });
  }

  async function blockIncomingPosts(el) {
    const userName = el.dataset.member;
    console.log("userName posted: ", userName);
    const blockedUsers = await getUsersFromLocalStorage();
    if (blockedUsers.includes(userName)) {
      el.style.display = "none";
    } else {
      blockIncomingQuotes(el, userName);
    }
  }

  async function blockIncomingQuotes(el, userName) {
    const quote = el.querySelector(".quote");
    if (quote) {
      const b = quote.children[1];
      const userNameInQuote = b.children[1].textContent;
      if (userNameInQuote === userName) {
        const parent = quote.parentElement;
        const div = document.createElement("div");
        div.textContent = `${userNameInQuote} is geblokkeerd`;
        div.classList.add("quote", "blocker__quote");
        parent.append(div);
        quote.style.display = "none";
      }
    }
  }

  async function init() {
    createNavbarButton();
    document.querySelectorAll(".editquote").forEach((el) => {
      createPostButtons(el);
    });
    const blockedUsers = await getUsersFromLocalStorage();
    if (blockedUsers.length) {
      blockedUsers.forEach((userName) => {
        performStyleOnUserPosts({ userName, display: "none" });
        hideQuotesOfBlockedUsers(userName);
        addUserToNavbarList(userName);
      });
    }
  }

  const mutationCallback = (records, observer) => {
    if (!document.body.classList.contains("listmessages")) {
      observer.disconnect();
    }

    for (const record of records) {
      if (record.type === "childList" && record.target.id === "pageWrapper") {
        posts = document.querySelectorAll("[data-member]");
        const post = record.addedNodes[0];
        if (post) {
          const header = post.querySelector(".editquote");
          createPostButtons(header);
          blockIncomingPosts(post);
        }
      }
    }
  };

  const observer = new MutationObserver(mutationCallback);
  const config = { attributes: true, childList: true, subtree: true };
  observer.observe(doc, config);
})();
