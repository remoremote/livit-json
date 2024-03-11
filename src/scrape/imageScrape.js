const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeImages(link, imageCount) {
  const images = [];

  try {
    const { data } = await axios.get(link);
    const $ = cheerio.load(data);

    // Since the specific class to click is not clear without interaction capabilities,
    // focusing on images directly accessible or indicated in the loaded HTML.
    $("img.fslightbox-source").each((index, element) => {
      if (images.length < imageCount) {
        let src = $(element).attr("src");
        // Ensure the src starts with http/https, otherwise prepend the base URL
        if (!src.startsWith("http")) {
          src = `https://www.livit.ch${src}`;
        }
        images.push(src);
      }
    });
  } catch (error) {
    console.error("Error scraping images:", error);
  }

  return images;
}

module.exports = { scrapeImages };