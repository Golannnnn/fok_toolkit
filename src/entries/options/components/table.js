import { types } from "~/store/state";
import { createElement } from "~/utils/dom";

/**
 * Represents a table component.
 */
export default class Table {
  constructor() {
    this.tableContainer = document.getElementById("table-container");
    this.tableTemplate = document.getElementById("table-template");
    this.rowTemplate = document.getElementById("row-template");
  }

  /**
   * Renders the table with the given items and type.
   * @param {Array} items - The items to be rendered in the table.
   * @param {string} type - The type of the table.
   */
  render(items, type) {
    const table = this.createTable(type);
    this.tableContainer.textContent = "";
    this.tableContainer.append(table);

    const rows = this.createRows(items, type);
    const tbody = document.getElementById("tbody");
    tbody.append(...rows);
  }

  /**
   * Prepends the given items to the table of the specified type.
   *
   * @param {Array} items - The items to prepend to the table.
   * @param {string} type - The type of the table.
   */
  prepend(items, type) {
    const table = this.createTable(type);
    this.tableContainer.textContent = "";
    this.tableContainer.append(table);

    const tbody = document.getElementById("tbody");
    const rows = this.createRows(items, type);
    tbody.prepend(...rows);
  }

  /**
   * Creates rows based on the given items and type.
   * @param {Array} items - The items to create rows from.
   * @param {string} type - The type of rows to create.
   * @returns {Array} - The created rows.
   */
  createRows(items, type) {
    return items.map((item) => {
      return this.createRow(item, type);
    });
  }

  /**
   * Creates a table element based on the specified type.
   * @param {string} type - The type of the table.
   * @returns {Element} - The created table element.
   */
  createTable(type) {
    const clone = this.tableTemplate.content.cloneNode(true);

    let typeTh = clone.getElementById("type-column");

    if (!typeTh && type === types.ALL) {
      typeTh = createElement("th", {
        id: "type-column",
        textContent: "Type",
        title: "sorteer op mention type",
      });
      const userTh = clone.getElementById("user-column");
      userTh.after(typeTh);
    }

    if (typeTh && type !== types.ALL) {
      typeTh.remove();
    }

    return clone;
  }

  /**
   * Creates a table row element based on the provided item and tabType.
   * @param {Object} item - The item object containing the row data.
   * @param {string} tabType - The type of tab.
   * @returns {Node} - The cloned table row element.
   */
  createRow(item, tabType) {
    const { date, user, type, topic, id, href } = item;

    const clone = this.rowTemplate.content.cloneNode(true);

    const dateTd = clone.querySelector(".date-td");
    dateTd.innerText = date;

    const userTd = clone.querySelector(".user-td");
    userTd.innerText = user;

    let typeTd = clone.querySelector(".type-td");
    typeTd.innerText = type;

    if (!typeTd && tabType === types.ALL) {
      typeTd = createElement("td", {
        class: "type-td",
        innerText: type,
      });
      console.log(typeTd);
      userTd.after(typeTd);
    }

    if (typeTd && tabType !== types.ALL) {
      typeTd.remove();
    }

    const topicTdLink = clone.querySelector(".topic-td__link");
    topicTdLink.href = href;
    topicTdLink.innerText = topic;

    const deleteTdBttn = clone.querySelector(".mentions__button__delete");
    deleteTdBttn.dataset.id = id;

    return clone;
  }
}
