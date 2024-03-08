/**
 * Debounces a callback function.
 *
 * @param {Function} callback - The callback function to be debounced.
 * @param {number} delay - The delay in milliseconds before invoking the callback.
 * @returns {Function} - The debounced function.
 */
export function debounce(callback, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}
