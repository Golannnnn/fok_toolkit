/**
 * Handles the click event of the delete all button.
 * If there are no items in the store, displays an alert message.
 * Otherwise, prompts the user for confirmation and deletes all items from the store.
 * @param {Object} store - The store object.
 */
export function handleDeleteAllBtn(store) {
  if (!store.state.items.length) {
    const alertMessage = "Je hebt geen mentions om te verwijderen";
    alert(alertMessage);
    return;
  }

  const confirmMessage =
    "Weet je zeker dat je al je mentions wilt verwijderen? Je kunt deze actie niet ongedaan maken.";
  if (confirm(confirmMessage)) {
    store.deleteItems();
  }
}
