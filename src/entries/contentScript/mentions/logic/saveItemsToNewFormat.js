import { STORAGE_KEY } from "~/store/store";
import { getLocalStorage, setLocalStorage } from "~/utils/storage";
import { parseItem } from "./parseItem";

/**
 * Converts and saves items in a new format to local storage.
 */
export async function saveItemsToNewFormat() {
  const storage = await getLocalStorage(STORAGE_KEY);

  if (
    !storage?.length ||
    !storage[0]?.text ||
    !storage[storage.length - 1]?.text
  ) {
    return;
  }

  const newItems = storage.map((item) => parseItem(item));

  await setLocalStorage(STORAGE_KEY, newItems);
}
