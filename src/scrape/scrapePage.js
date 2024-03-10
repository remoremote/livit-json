const { fetchHTML } = require("../utils/fetchData");

// Define baseUrl at the top so it can be used for making sure image URLs are absolute
const baseUrl = "https://www.livit.ch";

async function scrapePage(link) {
  // Correcting the URL if it's duplicated
  const correctedLink = link.startsWith(baseUrl + baseUrl) ? link.replace(baseUrl, '') : link;

  const $ = await fetchHTML(correctedLink);
  if (!$) return null;

  // Extract the title
  const title = $("h1:first-of-type").text().replace(/\s+/g, " ").trim();

  // Extract images from lightbox, ensure absolute URLs
  const images = [];
  $(".fslightbox-container .fslightbox-source").each((i, elem) => {
    let imageUrl = $(elem).attr("src");
    if (imageUrl) {
      // Ensure imageUrl is an absolute URL
      if (!imageUrl.startsWith('http')) {
        imageUrl = baseUrl + imageUrl;
      }
      if (!images.includes(imageUrl)) {
        images.push(imageUrl);
      }
    }
  });

  // Extract key-value pairs
  const keyValuePairs = {};
  $(".w-full.flex.items-center").each((i, elem) => {
    const key = $(elem).find(".flex.items-center.flex-1").text().trim();
    const value = $(elem).find(".text-sm").text().trim();
    if (key && value) {
      keyValuePairs[key] = value;
    }
  });

  // Assume toMarkdown function exists or is imported correctly
  // Extract description and check for email
  const descriptionHtml = $("p.rich-text.section-block").html(); // Assume toMarkdown function exists or is imported
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
