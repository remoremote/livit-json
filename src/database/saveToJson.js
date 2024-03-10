const fs = require("fs");

async function saveToJson(data, filename) {
  // Save to JSON file
  try {
    let processedData = data;
    if (filename !== "links.json") {
      processedData = data.map((item, index) => ({
        id: index + 1,
        ...item,
      }));
    }
    fs.writeFileSync(filename, JSON.stringify(processedData, null, 2));
    console.log(`Data saved to ${filename}`);
  } catch (error) {
    console.error("Error saving data to JSON file:", error);
  }
}

module.exports = { saveToJson };
