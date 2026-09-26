const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head><title>Test Page</title></head>
        <body style="height: 2000px; padding: 20px; background: #0d1117; color: white;">
          <header>
            <a href="/new" class="btn-primary">New</a>
            <button aria-label="Fork this repo">Fork</button>
          </header>
          <main>
            <h1>Repository Overview</h1>
            <button id="calc-btn">Calculate Total</button>
            <pre><code>git push origin main</code></pre>
          </main>
        </body>
      </html>
    `);

    const js = fs.readFileSync('public/clickguide-anywhere.js', 'utf8');
    console.log('Injecting script first time...');
    await page.evaluate(js);

    await new Promise(r => setTimeout(r, 600));

    let state = await page.evaluate(() => {
      const hud = document.getElementById('cg-hud');
      const cur = document.getElementById('cg-cur');
      return {
        hudExists: !!hud,
        hudDisplay: hud ? getComputedStyle(hud).display : null,
        hudRect: hud ? hud.getBoundingClientRect() : null,
        hudText: hud ? hud.innerText : null,
        curExists: !!cur,
        curDisplay: cur ? getComputedStyle(cur).display : null,
        curRect: cur ? cur.getBoundingClientRect() : null,
        curStyles: cur ? { left: cur.style.left, top: cur.style.top } : null
      };
    });
    console.log('EVALUATED STATE (First run):', JSON.stringify(state, null, 2));

    await page.screenshot({ path: 'scripts/screenshot1.png' });

    // Now test clicking a problem chip: e.g. "Command Error"
    console.log('\nClicking Command Error chip...');
    const clicked = await page.evaluate(() => {
      const chips = Array.from(document.querySelectorAll('.cg-chip'));
      const cmdChip = chips.find(c => c.textContent.includes('Command Error'));
      if (cmdChip) {
        cmdChip.click();
        return true;
      }
      return false;
    });
    console.log('Command chip clicked:', clicked);

    await new Promise(r => setTimeout(r, 800));

    state = await page.evaluate(() => {
      const hud = document.getElementById('cg-hud');
      const cur = document.getElementById('cg-cur');
      return {
        hudText: hud ? hud.innerText : null,
        curStyles: cur ? { left: cur.style.left, top: cur.style.top } : null,
        curRect: cur ? cur.getBoundingClientRect() : null
      };
    });
    console.log('STATE AFTER CLICKING COMMAND ERROR:', JSON.stringify(state, null, 2));

    await browser.close();
    console.log('Test completed successfully!');
  } catch (err) {
    console.error('Test error:', err);
  }
})();
