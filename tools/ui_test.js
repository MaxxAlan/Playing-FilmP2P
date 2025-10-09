const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
  const outputDir = path.resolve(__dirname, 'output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const logs = [];

  page.on('console', msg => {
    const text = msg.text();
    logs.push({type: msg.type(), text});
  });

  page.on('pageerror', err => {
    logs.push({type: 'pageerror', text: err.message});
  });

  try {
    // Open index
    await page.goto('http://127.0.0.1:5500/index.html', { waitUntil: 'networkidle2', timeout: 60000 });
    await page.screenshot({ path: path.join(outputDir, 'index.png'), fullPage: true });

    // Search for a movie using search input
    await page.type('#search-input', 'Interstellar');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outputDir, 'index_search.png') });

    // Click first watch button if present
    const watchBtn = await page.$('.watch-btn');
    if (watchBtn) {
      await watchBtn.click();
      await page.waitForTimeout(1000);
    }

    // Navigate to movie page for id=2
    await page.goto('http://127.0.0.1:5500/movie.html?id=2', { waitUntil: 'networkidle2', timeout: 60000 });
    await page.screenshot({ path: path.join(outputDir, 'movie.png'), fullPage: true });

    // Try toggling fullscreen button if exists
    const fsBtn = await page.$('#fullscreen-btn');
    if (fsBtn) {
      await fsBtn.click();
      await page.waitForTimeout(500);
    }

    // Save logs
    fs.writeFileSync(path.join(outputDir, 'console.json'), JSON.stringify(logs, null, 2));
    console.log('UI test finished, output in tools/output');

  } catch (err) {
    console.error('UI test error:', err.message);
    fs.writeFileSync(path.join(outputDir, 'error.txt'), err.stack || err.message);
  } finally {
    await browser.close();
  }
})();
