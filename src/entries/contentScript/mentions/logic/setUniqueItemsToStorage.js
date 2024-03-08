import { getLocalStorage, setLocalStorage } from "~/utils/storage";
import { STORAGE_KEY } from "~/store/store";
import { formatItem } from "./formatItem";
import { parseItem } from "./parseItem";

/**
 * Sets unique items from a nodeList to storage.
 *
 * @param {NodeList} nodeList - The nodeList containing the items to be set to storage.
 * @returns {Promise<void>} - A promise that resolves when the items are set to storage.
 */
export async function setUniqueItemsToStorage(nodeList) {
  // convert the nodeList to an array of elements and format them to get the relevant information
  const arrayOfElements = Array.from(nodeList);
  const formattedItems = arrayOfElements.map((item) => {
    return formatItem(item);
  });

  const storage = await getLocalStorage(STORAGE_KEY);

  // if there are no items in storage we can just set the new items
  if (!storage.length) {
    const parsedItems = formattedItems.map((item) => {
      return parseItem(item);
    });
    await setLocalStorage(STORAGE_KEY, parsedItems);
    return;
  }

  // if there are items in storage we need to get only the new items
  const newItems = storage.filter((item) => {
    return !storage.some((storageItem) => {
      return storageItem.id === item.id;
    });
  });

  const parsedItems = newItems.map((item) => {
    return parseItem(item);
  });

  if (!parsedItems.length) {
    return;
  }

  const combinedItems = [...storage, ...parsedItems];

  // so we don't exceed the storage limit
  while (combinedItems.length >= 25000) {
    combinedItems.shift();
  }

  await setLocalStorage(STORAGE_KEY, combinedItems);
}
