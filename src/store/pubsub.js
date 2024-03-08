/**
 * PubSub class for managing event subscriptions and publishing.
 */
export default class PubSub {
  constructor() {
    this.events = {};
  }

  /**
   * Subscribe to an event.
   * @param {string} event - The event name.
   * @param {Function} callback - The callback function to be executed when the event is published.
   */
  subscribe(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  /**
   * Publish an event.
   * @param {string} event - The event name.
   * @param {*} data - The data to be passed to the event subscribers.
   * @returns {Array} - An array of results returned by the event subscribers.
   */
  publish(event, data) {
    if (!this.events[event]) {
      return [];
    }
    return this.events[event].map((callback) => callback(data));
  }
}
