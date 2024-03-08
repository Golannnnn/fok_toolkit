export const types = {
  ALL: "all",
  LIKE: "Like",
  QUOTE: "Quote",
  MENTION: "Mention",
};

export const state = {
  items: [],
  page: 1,
  perPage: 500,
  totalPages: 1,
  itemsForPage: [],
  itemsForType: [],
  type: types.ALL,
};
