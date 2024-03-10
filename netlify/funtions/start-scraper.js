// netlify/functions/start-scraper.js
const { main } = require('../../index.js');

exports.handler = async function (event, context) {
  try {
    // Invoke the main function from your project's entry point
    await main();
    // Respond with a success message
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Scraper ran successfully." }),
    };
  } catch (error) {
    console.error("Error running scraper:", error);
    // Respond with an error message
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to run scraper." }),
    };
  }
};
