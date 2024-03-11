const TurndownService = require('turndown');
const { gfm } = require('turndown-plugin-gfm');
function filterImageUrls(imageUrls) {
  // Define your criteria for filtering image URLs
  return imageUrls.filter(url => url !== undefined);
}
function filterLinks(links) {
  const unwantedLink = "https://www.livit.ch/themes/custom/wingsuit/dist/app-drupal/images/logo.svg";
  return links.filter(link => link !== unwantedLink);
}
function toMarkdown(htmlString) {
  const turndownService = new TurndownService();
  turndownService.use(gfm); // Enables GitHub Flavored Markdown conversion (optional)
  const convertedMarkdown = turndownService.turndown(htmlString);
  return convertedMarkdown;
}
module.exports = { filterImageUrls, filterLinks, toMarkdown };