import { STORAGE_KEY } from "~/store/store";
import { getLocalStorage } from "~/utils/storage";

/**
 * Handles the export functionality by converting the local storage data to a JSON file and initiating the download.
 * @returns {Promise<void>} A promise that resolves when the export is completed.
 */
export async function handleExport() {
  const storage = await getLocalStorage(STORAGE_KEY);

  if (!storage?.length) {
    alert("Geen data om te exporteren.");
    return;
  }

  const blob = new Blob([JSON.stringify(storage)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mentions.json";
  a.click();

  URL.revokeObjectURL(url);
}
