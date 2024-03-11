function filterImageUrls(imageUrls) {
  // Define your criteria for filtering image URLs
  return imageUrls.filter(url => url !== undefined);
}

function filterLinks(links) {
  const unwantedLink = "https://www.livit.ch/themes/custom/wingsuit/dist/app-drupal/images/logo.svg";
  return links.filter(link => link !== unwantedLink);
}


module.exports = { filterImageUrls, filterLinks };