const { fetchHTML } = require("../utils/fetchData");

const baseUrl = "https://www.livit.ch";

async function scrapeOverviewPage(pageNumber) {
  const pageUrl = `${baseUrl}?page=${pageNumber}`;
  const $ = await fetchHTML(pageUrl);
  if (!$) return [];

  const links = [];
  $(".gap-8.md\\:gap-5.lg\\:gap-7.grid.grid-3-equal_medium_2.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3 .flex.flex-col")
  .find("a.flex.justify-between.pb-4.flex-1").each((i, elem) => {
    const link = $(elem).attr("href");
    if (link) {
      links.push(baseUrl + link);
    }
  });

  return links;
}

module.exports = { scrapeOverviewPage };