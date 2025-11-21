const sanitizeHtmlLib = require("sanitize-html");

const allowedTags = sanitizeHtmlLib.defaults.allowedTags.concat([
  "img",
  "figure",
  "figcaption",
]);

const allowedAttributes = {
  ...sanitizeHtmlLib.defaults.allowedAttributes,
  img: ["src", "alt", "title", "width", "height"],
  a: ["href", "name", "target", "rel"],
};

module.exports = function sanitizeRichText(content = "") {
  return sanitizeHtmlLib(content, {
    allowedTags,
    allowedAttributes,
    allowedSchemes: ["http", "https", "mailto"],
  });
};

