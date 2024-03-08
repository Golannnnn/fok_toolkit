let activeButton = document.querySelector(".active-tab");

/**
 * Switches the active tab based on the event target.
 * @param {Event} e - The event object.
 */
export function switchActiveTab(e) {
  if (activeButton) {
    activeButton.classList.remove("active-tab");
  }

  e.target.classList.add("active-tab");

  activeButton = e.target;
}
