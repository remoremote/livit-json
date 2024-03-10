const { fetchHTML } = require("../utils/fetchData");

async function scrapePage(link) {
const $ = await fetchHTML(link);
if (!$) return null;

  const details = {};
  return details;

}

module.exports = { scrapePage };