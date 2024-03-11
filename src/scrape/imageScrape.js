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
            const src = $(image).attr('src') || $(image).attr('data-src');
            let imageUrl = src;
            // Ignore specific image URL
            if (imageUrl && imageUrl === 'https://www.livit.ch/themes/custom/wingsuit/dist/app-drupal/images/logo.svg') {
                console.log('Ignoring logo image.');
                return;
            }
            if (imageUrl && !imageUrl.includes('maps.googleapis')) {
                // Ensure the imageUrl starts with http/https, otherwise prepend the base URL
                if (!imageUrl.startsWith('http')) {
                    imageUrl = `https://www.livit.ch${imageUrl}`;
                }
                images.push(imageUrl);
            }
        });
    } catch (error) {
        console.error("Error scraping images:", error);
    }

    return images;
}

module.exports = { scrapeImages };