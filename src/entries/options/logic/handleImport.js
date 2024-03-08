/**
 * Handles the import of a file.
 *
 * @param {Event} e - The event object.
 * @param {Object} store - The store object.
 */
export function handleImport(e, store) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = async function () {
    const items = JSON.parse(reader.result);

    if (!items.length) {
      return;
    }

    store.importItems(items);
  };

  reader.readAsText(file);
}
