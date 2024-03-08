import browser from "webextension-polyfill";

/**
 * Retrieves an item from the local storage.
 * @param {string} item - The name of the item to retrieve.
 * @returns {Promise<Array>} - A promise that resolves to the retrieved item or an empty array if an error occurs.
 */
async function getLocalStorage(item) {
  try {
    const localStorage = await browser.storage.local.get(item);
    return localStorage[item] || [];
  } catch (error) {
    console.error("Error getting local storage:", error);
    return [];
  }
}

/**
 * Sets a value in the local storage.
 *
 * @param {string} item - The key of the item to be stored.
 * @param {any} value - The value to be stored.
 * @returns {Promise<void>} - A promise that resolves when the value is successfully stored.
 */
async function setLocalStorage(item, value) {
  try {
    await browser.storage.local.set({ [item]: value });
  } catch (error) {
    // if QuotaExceededError is thrown, it means the storage is full, display a message to the user
    if (error.name === "QuotaExceededError") {
      console.error("Storage is full");
      alert(
        "De lokale opslag is vol. Verwijder mentions om ruimte vrij te maken."
      );
    } else {
      console.error("Error setting local storage:", error);
    }
  }
}

/**
 * Removes an item from local storage.
 * @param {string} item - The item to be removed.
 * @returns {Promise<void>} - A promise that resolves when the item is removed successfully.
 */
async function removeLocalStorage(item) {
  try {
    await browser.storage.local.remove(item);
  } catch (error) {
    console.error("Error removing local storage:", error);
  }
}

export { getLocalStorage, setLocalStorage, removeLocalStorage };
