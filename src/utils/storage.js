import browser from "webextension-polyfill";

async function getLocalStorage(item) {
  try {
    const localStorage = await browser.storage.local.get(item);
    return localStorage[item] || [];
  } catch (error) {
    console.error("Error getting local storage:", error);
    return [];
  }
}

async function setLocalStorage(item, value) {
  try {
    await browser.storage.local.set({ [item]: value });
  } catch (error) {
    console.error("Error setting local storage:", error);
  }
}

async function removeLocalStorage(item) {
  try {
    await browser.storage.local.remove(item);
  } catch (error) {
    console.error("Error removing local storage:", error);
  }
}

export { getLocalStorage, setLocalStorage, removeLocalStorage };
