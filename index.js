const { scrapeOverviewPage } = require("./src/scrape/scrapeOverviewPage");
const { scrapePage } = require("./src/scrape/scrapePage");
const { saveToJson } = require("./src/database/saveToJson");

async function main() {
  console.log("Starting main scraping function...");
  let allDetails = [];
  let allLinks = []; // Store all links fetched

  const maxPageNumber = 1; // Define maxPageNumber max is 30

  for (let i = 0; i <= maxPageNumber; i++) {
    const pageLinks = await scrapeOverviewPage(i);
    allLinks = allLinks.concat(pageLinks); // Collect all links
    for (const link of pageLinks) {
      const details = await scrapePage(link);
      if (details) {
        allDetails.push(details);
      }
    }
  }

  allDetails = allDetails.filter((detail) => !("Kaufpreis" in detail));

  // Save links to JSON
  await saveToJson(allLinks, "links.json"); // Saving the fetched links

  // Save to JSON and PostgreSQL database
  await saveToJson(allDetails, "details.json");

  // Convert JSON data to CSV and save to file
  const csvData = jsonToCsv(allDetails);
  saveDataToFile(csvData, "details.csv");

  console.log("Main function completed.");
}

main();

module.exports = { main };