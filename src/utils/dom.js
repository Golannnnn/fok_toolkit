/**
 * Creates a new DOM element with the specified tag and properties.
 * @param {string} tag - The tag name of the element to create.
 * @param {Object} props - The properties to set on the element.
 * @returns {HTMLElement} The newly created DOM element.
 */
export function createElement(tag, props) {
  const element = document.createElement(tag);
  if (props) {
    Object.entries(props).forEach(([prop, value]) => {
      if (prop == "ClassName") {
        element.classList.add(value);
        return;
      }

      if (prop == "classes" && Array.isArray(value)) {
        element.classList.add(...value);
        return;
      }

      element[prop] = value;
    });
  }
  return element;
}
