const regex =
  /(\d{2}-\d{2}-\d{4} @ \d{2}:\d{2}:\d{2})\s*([^\s]+)\s*heeft.*(gequote|geliket|genoemd)\s*in(?:\s*topic)?\s*"(.*?)"/;

function getItemType(type) {
  switch (type) {
    case "gequote":
      return "Quote";
    case "geliket":
      return "Like";
    case "genoemd":
      return "Mention";
    default:
      return "Unknown";
  }
}

/**
 * Parses the given text and extracts relevant information.
 * @param {string} text - The text to parse.
 * @returns {Object|null} - An object containing the parsed information, or null if no matches were found.
 */
export function parseItem(item) {
  const matches = item.text.match(regex);
  if (!matches) {
    return null;
  }
  const [, date, user, type, topic] = matches;
  const itemType = getItemType(type);
  const formattedTopic = topic.replaceAll(/amp;/g, "");
  return {
    date,
    user,
    type: itemType,
    topic: formattedTopic,
    id: item.id,
    href: item.href,
  };
}
