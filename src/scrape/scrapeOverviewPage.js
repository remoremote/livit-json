const { fetchHTML } = require("../utils/fetchData");

const baseUrl = "https://www.livit.ch";
const overviewPath = "/de/search/industrial";

async function scrapeOverviewPage(pageNumber) {
  const pageUrl = `${baseUrl}${overviewPath}?page=${pageNumber}`;
  const $ = await fetchHTML(pageUrl);
  if (!$) return [];

  const links = [];
  $("a.flex.justify-between.pb-4.flex-1").each((i, elem) => {
    const link = $(elem).attr("href");
    if (link) {
      links.push(baseUrl + link);
    }
  });

  return links;
}

module.exports = { scrapeOverviewPage };