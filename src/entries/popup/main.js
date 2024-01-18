import browser from "webextension-polyfill";
import "./style.css";

const form = document.querySelector("form");
const input = document.querySelector(".api-key__input");
const msg = document.querySelector(".api-key__msg");

const savedMsg = "API key opgeslagen!\nNu kan je afbeeldingen uploaden.";

browser.storage.local
  .get(["blocker", "scroller", "uploader", "apiKey"])
  .then((res) => {
    input.value = res?.apiKey ?? "";
    msg.style.display = res?.apiKey ? "block" : "none";
    msg.innerText = savedMsg;
  });

form.addEventListener("submit", (e) => {
  e.preventDefault();
  browser.storage.local.set({ apiKey: input.value }).then(() => {
    msg.style.display = "block";
    msg.innerText = savedMsg;
  });
});
