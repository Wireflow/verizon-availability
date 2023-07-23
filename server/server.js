const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/searchFios', async (req, res) => {
  const address = req.query.address;

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://broadbandnow.com/Verizon-Fios');

    // Emulate user interaction: enter the address and submit the form
    await page.type('.address-search-field__input', "4192 White Plains Rd, Bronx, NY 10466, USA");
    await page.click('.address-search__btn');

    // Wait for the search results to load
    await page.waitForSelector('.address-search-result__title');

    // Extract the Fios availability status
    const fiosAvailabilityElement = await page.$('.address-search-result__title');

    if (fiosAvailabilityElement) {
      const fiosAvailability = await fiosAvailabilityElement.evaluate((element) => element.textContent.trim());
      await browser.close();

      res.json({ fiosAvailability });
    } else {
      throw new Error('Fios availability element not found');
    }
  } catch (error) {
    console.error('Error scraping data:', error);
    res.status(500).json({ error: 'Error scraping data' });
  }
});

const PORT = 3004;

app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));