const MAX_ITEMS_FOR_ALERT = 24500;

/**
 * Handles the display of a max items alert based on the length of items.
 * If the items length exceeds a certain threshold, the alert is displayed with the item count.
 * Otherwise, the alert is hidden.
 *
 * @param {number} itemsLength - The length of the items.
 * @param {HTMLElement} alertMessage - The alert message element.
 */
export function handleMaxItemsAlert(itemsLength, alertMessage) {
  if (itemsLength > MAX_ITEMS_FOR_ALERT) {
    const alertAmount = document.getElementById("alert-amount");
    const progressBar = document.getElementById("alert-progress");
    alertMessage.style.display = "block";
    progressBar.value = itemsLength;
    alertAmount.textContent = `${itemsLength}`;
  } else {
    alertMessage.style.display = "none";
  }
}
