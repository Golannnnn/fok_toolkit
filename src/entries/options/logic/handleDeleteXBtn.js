/**
 * Handles the deletion of mentions based on user input.
 * If there are no mentions to delete, an alert is shown.
 * If the user enters an invalid amount or cancels the deletion, an alert is shown.
 * If the user confirms the deletion, the specified number of mentions are deleted.
 *
 * @param {Object} store - The store object containing the state and deleteLastItems method.
 */
export function handleDeleteXBtn(store) {
  if (!store.state.items.length) {
    const alertMessage = "Je hebt geen mentions om te verwijderen";
    alert(alertMessage);
    return;
  }

  const amount = prompt("Hoeveel laatste mentions wil je verwijderen?");

  const amountInt = parseInt(amount, 10);
  if (!amount || isNaN(amountInt)) {
    const alertMessage = "Voer een geldig getal in";
    alert(alertMessage);
    return;
  }

  if (amountInt >= store.state.items.length) {
    const confirmMessage = `Je hebt maar ${store.state.items.length} mentions. Weet je zeker dat je alle mentions wilt verwijderen?`;
    if (confirm(confirmMessage)) {
      store.deleteLastItems(store.state.items.length);
    }
    return;
  }

  const confirmMessage = `Weet je zeker dat je de laatste ${amount} mentions wilt verwijderen?`;
  if (confirm(confirmMessage)) {
    store.deleteLastItems(amountInt);
  }
}
