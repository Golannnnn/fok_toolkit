import { getLocalStorage, setLocalStorage } from "~/utils/storage";
import PubSub from "./pubsub";
import actions from "./actions";
import { state, types } from "./state";

const { ITEMS_CHANGE } = actions;

const MAX_ITEMS = 25000;

export const STORAGE_KEY = "mentions";

/**
 * Represents a Store that manages the state and operations for a collection of items.
 * @extends PubSub
 */
export class Store extends PubSub {
  /**
   * Creates an instance of Store.
   */
  constructor() {
    super();
    this.state = new Proxy(state, {
      set: (obj, prop, value) => {
        obj[prop] = value;
        obj.itemsForType = this.getItemsForType();
        obj.totalPages = this.getTotalPages();
        obj.itemsForPage = this.getItemsForPage();
        return true;
      },
    });
    // initialize the state
    this.fetchItems();
  }

  /**
   * Fetches the array of items from local storage, reverses the array and updates the state.
   * @returns {Promise<void>} A promise that resolves when the items are fetched and the state is updated.
   */
  async fetchItems() {
    const items = await getLocalStorage(STORAGE_KEY);
    const sorted = items.sort((a, b) => b.id - a.id);
    this.state.items = sorted;
    this.publish(ITEMS_CHANGE);
  }

  /**
   * Appends items to the beginning of the state's items array.
   * @param {Array} items - The items to be appended.
   */
  appendItems(items) {
    const sorted = [...items, ...this.state.items].sort((a, b) => b.id - a.id);
    this.state.items = sorted;
    this.publish(ITEMS_CHANGE);
  }

  /**
   * Imports items into the store.
   * @param {Array} items - The items to import.
   * @returns {Promise<void>} - A promise that resolves when the import is complete.
   */
  async importItems(items) {
    if (items.length >= MAX_ITEMS) {
      alert("Je kan tot 25.000 mentions importeren.");
      return;
    }

    if (!this.areItemsValid(items)) {
      alert("De geïmporteerde mentions zijn niet in geldig formaat.");
      return;
    }

    if (!state.items) {
      this.state.items = items;
      await setLocalStorage(STORAGE_KEY, items);
      this.publish(ITEMS_CHANGE);
      return;
    }

    const newItems = items.filter(
      (item) => !this.state.items.some((si) => si.id === item.id)
    );

    if (!newItems.length) {
      alert("Geen nieuwe mentions om te importeren.");
      return;
    }

    if (newItems.length + this.state.items.length >= MAX_ITEMS) {
      alert(
        `Je kan maar 25.000 mentions hebben. De mentions die je al hebt + de geïmporteerde mentions = ${
          newItems.length + this.state.items.length
        }.`
      );
      return;
    }

    this.appendItems(newItems);
    await setLocalStorage(STORAGE_KEY, [...newItems, ...this.state.items]);
  }

  /**
   * Checks if all items in the array have the required properties.
   * @param {Array} items - The array of items to validate.
   * @returns {boolean} - True if all items have the required properties, false otherwise.
   */
  areItemsValid(items) {
    const props = ["date", "user", "type", "topic", "id", "href"];
    return items.every((item) => props.every((prop) => item[prop]));
  }

  /**
   * Handles the change in storage by adding new items to the state.
   * @param {Object} changes - The changes in storage.
   */
  handleStorageChange(changes) {
    const newItems = changes[STORAGE_KEY].newValue;

    if (!newItems || newItems.length <= this.state.items.length) {
      return;
    }

    const addedItems = newItems.filter(
      (item) => !this.state.items.some((si) => si.id === item.id)
    );

    if (!addedItems.length) {
      return;
    }

    this.appendItems(addedItems);
  }

  /**
   * Deletes the items with the specified id from the state and local storage.
   * If no id is provided, all items are deleted.
   * @param {string|null} id - The id of the item to delete. If null, all items are deleted.
   * @returns {Promise<void>} A promise that resolves when the items are deleted from the state and local storage.
   */
  async deleteItems(id = null) {
    let filtered = [];
    if (id) {
      filtered = this.state.items.filter((item) => item.id !== id);
    }
    this.state.items = filtered;
    await setLocalStorage(STORAGE_KEY, filtered);

    await this.handleEmptyPageAndPublish();
  }

  /**
   * Deletes the specified number of last items from the state and updates the local storage.
   * @param {number} amount - The number of items to delete.
   * @returns {Promise<void>} - A promise that resolves when the items are deleted and the local storage is updated.
   */
  async deleteLastItems(amount) {
    if (!amount) {
      return;
    }

    const remainingItems = this.state.items.slice(
      0,
      this.state.items.length - amount
    );
    this.state.items = remainingItems;
    await setLocalStorage(STORAGE_KEY, this.state.items);

    await this.handleEmptyPageAndPublish();
  }

  /**
   * Handles empty page and triggers the publish event.
   * If there are no items for the current page and there are more pages available,
   * it changes the page to the previous one and returns.
   * Otherwise, it triggers the publish event.
   * @returns {Promise<void>} A promise that resolves when the publish event is triggered.
   */
  async handleEmptyPageAndPublish() {
    if (this.state.itemsForPage.length === 0 && this.state.totalPages > 0) {
      this.changePage(this.state.page - 1);
      return;
    }
    this.publish(ITEMS_CHANGE);
  }

  /**
   * Changes the current page of items in the state.
   * @param {number} page - The page number to set.
   */
  changePage(page) {
    this.state.page = page;
    this.publish(ITEMS_CHANGE);
  }

  /**
   * Calculates the total number of pages based on the number of items per page in the state.
   * @returns {number} The total number of pages.
   */
  getTotalPages() {
    const items = this.itemsToRender();
    return Math.ceil(items.length / this.state.perPage);
  }

  /**
   * Retrieves the items for the current page from the state.
   * @returns {Array} An array of items for the current page.
   */
  getItemsForPage() {
    const start = (this.state.page - 1) * this.state.perPage;
    const end = start + this.state.perPage;
    const items = this.itemsToRender();
    return items.slice(start, end);
  }

  /**
   * Retrieves items based on the specified type.
   * If the type is set to 'ALL', returns all items.
   * Otherwise, returns items filtered by the specified type.
   * @returns {Array} The filtered items.
   */
  getItemsForType() {
    if (this.state.type === types.ALL) {
      return this.state.items;
    }
    return this.state.items.filter((item) => item.type === this.state.type);
  }

  /**
   * Changes the type of the state and resets the page number.
   * @param {string} type - The new type to set.
   * @returns {void}
   */
  changeType(type) {
    this.state.type = type;
    this.state.page = 1;
    this.publish(ITEMS_CHANGE);
  }

  /**
   * Returns the items to render based on the current state.
   * If the state type is "ALL", it returns all items.
   * Otherwise, it returns the items for the specific type.
   * @returns {Array} The items to render.
   */
  itemsToRender() {
    return this.state.type === types.ALL
      ? this.state.items
      : this.state.itemsForType;
  }
}
