import browser from "webextension-polyfill";

(function () {
  if (window.hasMentionsRun) {
    return;
  }
  window.hasMentionsRun = true;

  const editorButtonsLeft =
    document.querySelector(".editorbuttons").children[2];
  const linkIcon = document.querySelector(".fa-link");
  const input = document.createElement("input");
  const icon = document.createElement("icon");

  input.classList.add("uploader__input");
  icon.classList.add("fa", "fa-upload", "uploader__icon");

  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");

  icon.append(input);
  editorButtonsLeft.insertBefore(icon, linkIcon);

  input.addEventListener("change", async () => {
    if (!input.files[0]) {
      return;
    }

    const apiKey = await getApiKey();

    if (!apiKey) {
      alert("Geen API key gevonden. Voeg eerst een API key toe.");
      return;
    }

    const formData = new FormData();
    formData.append("image", input.files[0]);
    formData.append("key", apiKey);

    uploadImage(formData);
  });

  async function uploadImage(formData) {
    try {
      input.classList.add("fetching");
      icon.classList.add("fetching");
      const config = {
        method: "POST",
        body: formData,
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
      };
      const response = await fetch("https://api.imgbb.com/1/upload", config);
      const json = await response.json();
      const url = json.data.url;
      const img = `[img]${url}[/img]`;
      const textarea = document.querySelector("textarea");
      textarea.value += img;
      input.value = "";
    } catch (err) {
      console.log(err);
      alert(
        "Er is iets misgegaan. Probeer het opnieuw, check je api key, bekijk de console log error of neem contact op met de maker van deze extensie."
      );
    } finally {
      input.classList.remove("fetching");
      icon.classList.remove("fetching");
    }
  }

  async function getApiKey() {
    const res = await browser.storage.local.get("apiKey");
    return res?.apiKey;
  }
})();
