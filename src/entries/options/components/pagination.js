import { createElement } from "~/utils/dom";

/**
 * Represents a Pagination component.
 */
export default class Pagination {
  /**
   * Creates an instance of Pagination.
   * @memberof Pagination
   */
  constructor(container) {
    this.container = container || document.getElementById("pagination");
    this.prevTotalPages = 0;
  }

  /**
   * Sets the active class for the specified element and removes active classes from other elements.
   * @param {HTMLElement} element - The element to set as active.
   * @memberof Pagination
   */
  setActiveClass(element) {
    this.removeActiveClasses();
    element.classList.add("active");
  }

  /**
   * Removes the active class from the currently active child element.
   * @memberof Pagination
   */
  removeActiveClasses() {
    const activeChild = this.container.querySelector(".active");
    if (activeChild) {
      activeChild.classList.remove("active");
    }
  }

  /**
   * Renders the pagination with the specified number of total pages.
   * @param {number} totalPages - The total number of pages.
   * @param {number} currentPage - The current page number.
   * @memberof Pagination
   */
  render(totalPages, currentPage) {
    this.container.textContent = "";

    for (let i = 1; i <= totalPages; i++) {
      const a = this.createPaginationElement(i, currentPage);
      this.container.append(a);
    }

    this.prevTotalPages = totalPages;
  }

  /**
   * Updates the pagination component with the given total number of pages and current page.
   * If the total number of pages has changed, it re-renders the component.
   * If the total number of pages is the same, it checks if the current page is active and updates it if necessary.
   *
   * @param {number} totalPages - The total number of pages.
   * @param {number} currentPage - The current page.
   */
  update(totalPages, currentPage) {
    if (totalPages !== this.prevTotalPages) {
      this.render(totalPages, currentPage);
    } else if (totalPages > 0) {
      const selectedPage = this.container.childNodes[currentPage - 1];
      if (!selectedPage.classList.contains("active")) {
        this.setActiveClass(selectedPage);
      }
    }
  }

  /**
   * Creates a pagination element with the specified page number.
   * @param {number} pageNumber - The page number.
   * @param {number} currentPage - The current page number.
   * @returns {HTMLElement} The created pagination element.
   * @memberof Pagination
   */
  createPaginationElement(pageNumber, currentPage) {
    const a = createElement("a", {
      id: pageNumber,
      innerText: pageNumber,
      href: "#",
      title: `ga naar pagina ${pageNumber}`,
      ...(pageNumber == currentPage ? { className: "active" } : {}),
    });
    return a;
  }
}
