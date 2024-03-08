import { debounce } from "./debounce";
import { setUniqueItemsToStorage } from "./setUniqueItemsToStorage";

/**
 * Callback function for the MutationObserver.
 * It retrieves the jGrowl element from the document and processes its children.
 * If there are message wrappers, it sets the unique items to storage.
 */
function mutationCallback() {
  const jGrowl = document.getElementById("jGrowl");
  if (!jGrowl) {
    return;
  }

  const children = jGrowl?.children;
  if (!children?.length) {
    return;
  }

  const messageWrappers = jGrowl.querySelectorAll(".jGrowl-message");
  if (!messageWrappers?.length) {
    return;
  }

  setUniqueItemsToStorage(messageWrappers);
}

const debouncedMutationCallback = debounce(mutationCallback, 500);

export const observer = new MutationObserver(debouncedMutationCallback);

export const config = {
  childList: true,
  subtree: true,
};
