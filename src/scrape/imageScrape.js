const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeImages(link) {
    const images = [];
    try {
        const { data } = await axios.get(link);
        const $ = cheerio.load(data);
        const maxImages = parseInt($(".fslightbox-slide-number-container").text().split('/')[1], 10) || Infinity;
        $('img').each((index, image) => {
            if (images.length >= maxImages) return false; // Stop if maxImages reached
            let src = $(image).attr('src') || $(image).attr('data-src');
            if (src) {
                // Ensure the imageUrl starts with http/https, otherwise prepend the base URL
                if (!src.startsWith('http')) {
                    src = `https://www.livit.ch${src}`;
                }
                // Exclude specific URLs
                if (src !== "https://www.livit.ch/themes/custom/wingsuit/dist/app-drupal/images/logo.svg" && !src.includes("maps.googleapis.com")) {
                    images.push(src);
                }
            }
        });
    } catch (error) {
        console.error("Error scraping images:", error);
    }
    return images;
}



module.exports = { scrapeImages };