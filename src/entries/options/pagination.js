function calculatePages(mentions, itemsPerPage) {
  return Math.ceil(mentions.length / itemsPerPage);
}

// slices the mentions array to return only the mentions for the current page
function sliceMentionsForPage(array, currentPage, itemsPerPage) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return array.slice(startIndex, endIndex);
}

// create the pagination links and append them to the container
function renderPagination(element, pageCount) {
  for (let i = 0; i < pageCount; i++) {
    const a = document.createElement("a");
    if (i === 0) a.className = "active";
    a.id = i + 1;
    a.href = "#";
    a.innerText = i + 1;
    a.title = `ga naar pagina ${i + 1}`;
    element.append(a);
  }
}

// remove the active class from all children of the container and add it to the target element
function setActiveClass(element) {
  const paginationContainer = document.getElementById("pagination");
  const children = paginationContainer.childNodes;
  children.forEach((child) => child.classList.remove("active"));
  element.classList.add("active");
}

export {
  calculatePages,
  sliceMentionsForPage,
  renderPagination,
  setActiveClass,
};
