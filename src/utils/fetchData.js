const axios = require("axios");
const cheerio = require("cheerio");

async function fetchHTML(url) {
  console.log(`Fetching HTML for URL: ${url}`);
  try {
    const { data } = await axios.get(url);
    console.log(`Successfully fetched HTML for URL: ${url}`);
    return cheerio.load(data);
  } catch (error) {
    console.error(`Error fetching the HTML for URL: ${url}`, error);
    return null;
  }
}

module.exports = { fetchHTML };