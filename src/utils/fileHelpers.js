const fs = require("fs");

function saveDataToFile(data, filename) {
  try {
    fs.writeFileSync(filename, data);
    console.log(`${filename} has been saved.`);
  } catch (error) {
    console.error(`Error saving data to ${filename}:`, error);
  }
}

module.exports = { saveDataToFile };