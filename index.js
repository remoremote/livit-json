const { scrapeOverviewPage } = require("./src/scrape/scrapeOverviewPage");
const { scrapePage } = require("./src/scrape/scrapePage");
const { saveToJson } = require("./src/database/saveToJson");
const { saveDataToFile } = require("./src/utils/fileHelpers");
const { filterImageUrls } = require("./src/utils/parseHelpers"); 


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

  // Filter links before saving
  // For demonstration, reusing filterImageUrls, but you may need to create a similar function for links
  const filteredLinks = filterImageUrls(allLinks); // Adjust function to filter links based on your criteria
  // Save filtered links to JSON
  await saveToJson(filteredLinks, "links.json"); // Saving the filtered links instead of all links
  
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

function jsonToCsv(jsonData) {
  if (!jsonData.length) return ''; // No data, return empty CSV.
  const headers = Object.keys(jsonData[0]);
  const csvRows = jsonData.map(row =>
    headers.map(fieldName => JSON.stringify(row[fieldName], null, 2)).join(',')
  );
  return [headers.join(','), ...csvRows].join('\n');
}

module.exports = { main };