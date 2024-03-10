
const { scrapeOverviewPage } = require("./src/scrape/scrapeOverviewPage");
const { scrapePage } = require("./src/scrape/scrapePage");


async function main() {
  console.log("Starting main scraping function...");
  let allDetails = [];

  const maxPageNumber = 1; // Define maxPageNumber max is 30

  for (let i = 0; i <= maxPageNumber; i++) {
    const pageLinks = await scrapeOverviewPage(i);
    for (const link of pageLinks) {
      const details = await scrapePage(link);
      if (details) {
        allDetails.push(details);
      }
    }
  }

  allDetails = allDetails.filter((detail) => !("Kaufpreis" in detail));

  // Save to JSON and PostgreSQL database
  await saveToJsonAndDatabase(allDetails, "details.json");

  // Convert JSON data to CSV and save to file
  const csvData = jsonToCsv(allDetails);
  saveDataToFile(csvData, "details.csv");

  console.log("Main function completed.");
}

main();

module.exports = { main };