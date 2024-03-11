const { fetchHTML } = require("../utils/fetchData");
const { scrapeImages } = require("./imageScrape");
const { toMarkdown } = require("../utils/parseHelpers");

// Define baseUrl at the top so it can be used for making sure image URLs are absolute
const baseUrl = "https://www.livit.ch";

async function scrapePage(link) {
  // Ensure the link is correctly formatted, avoiding duplication of baseUrl
  let correctedLink = link;
  if (!link.startsWith(baseUrl)) {
    correctedLink = baseUrl + link;
  } else if (link.startsWith(baseUrl + baseUrl)) {
    correctedLink = link.replace(baseUrl + baseUrl, baseUrl);
  }

  const $ = await fetchHTML(correctedLink);
  if (!$) return null;

  // Extract the title
  const title = $("h1:first-of-type").text().replace(/\s+/g, " ").trim();

  // Use scrapeImages from imageScrape.js to fetch images
  const imageCountContainer = $(".fslightbox-slide-number-container").text();
  const totalImages = imageCountContainer
    ? parseInt(imageCountContainer.split("/")[1], 10)
    : 0;
  const images = await scrapeImages(correctedLink, totalImages);

  // Extract key-value pairs
  const keyValuePairs = {};
  $(".w-full.flex.items-center").each((i, elem) => {
    const key = $(elem).find(".flex.items-center.flex-1").text().trim();
    const value = $(elem).find(".text-sm").text().trim();
    if (key && value) {
      keyValuePairs[key] = value;
    }
  });

  // Extract description and check for email
  let descriptionHtml = $("div.lg\\:prose-lg.rich-text.section-block").html();

  // Check if the descriptionHtml is too short and try an alternative selector if necessary
  if (!descriptionHtml || descriptionHtml.length < 100) { // Arbitrary threshold of 100 characters
    descriptionHtml = $("div#alternative-description-selector").html(); // Replace #alternative-description-selector with the actual selector that targets the full description, if there is one
  }

  const descriptionMarkdown = descriptionHtml
    ? toMarkdown(descriptionHtml)
    : "";
  const emailMatch = descriptionMarkdown.match(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/,
  );
  const systemEmail = emailMatch ? emailMatch[0] : "";

  // Combine all details
  const details = {
    title,
    images,
    ...keyValuePairs,
    description: descriptionMarkdown,
    systemEmail,
  };

  return details;
}

module.exports = { scrapePage };