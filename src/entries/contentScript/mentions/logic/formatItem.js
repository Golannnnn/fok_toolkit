/**
 * Formats an item by extracting relevant information.
 * @param {HTMLElement} item - The item to be formatted.
 * @returns {Object|null} - The formatted item object containing id, href, and text, or null if the item is invalid.
 */
export function formatItem(item) {
  const id = item.children[0].dataset.id;

  const link = item.querySelector(".quotedPostLink");
  if (!link) {
    return null;
  }

  const href = link.href;
  const text = item.textContent;
  const formattedItem = { id, href, text };
  return formattedItem;
}
