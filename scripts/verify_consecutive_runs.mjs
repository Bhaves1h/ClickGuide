import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';
import assert from 'assert';

const PORT = 8891;
const EXTENSION_PATH = path.resolve('extension');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const HTML_GITHUB_MODERN = `
<!DOCTYPE html>
<html>
<head><title>Create a new repository</title></head>
<body style="padding: 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0d1117; color: #fff;">
  <h2>Create a new repository</h2>
  <p style="color: #8b949e;">A repository contains all project files, including the revision history.</p>

  <form action="/repositories" method="post" style="max-width: 700px; margin-top: 24px;">
    <!-- General Section -->
    <div style="border: 1px solid #30363d; border-radius: 6px; padding: 20px; margin-bottom: 24px; background: #161b22;">
      <h3 style="margin-top: 0;">General</h3>
      
      <div style="margin-top: 16px;">
        <label style="font-weight: 600; display: block; margin-bottom: 6px;">Owner *</label>
        <button type="button" aria-label="Owner" style="padding: 6px 12px; background: #21262d; color: white; border: 1px solid #30363d; border-radius: 6px;">octocat</button>
      </div>

      <div style="margin-top: 16px;">
        <label style="font-weight: 600; display: block; margin-bottom: 6px;">Repository name *</label>
        <input id="repository_name" data-testid="repository-name-input" name="repository[name]" aria-label="Repository name" type="text" placeholder="e.g. my-awesome-project" style="width: 100%; padding: 8px 12px; background: #0d1117; color: white; border: 1px solid #30363d; border-radius: 6px;" />
      </div>

      <div style="margin-top: 16px;">
        <label style="font-weight: 600; display: block; margin-bottom: 6px;">Description</label>
        <input id="repository_description" name="repository[description]" aria-label="Description" placeholder="Description" type="text" style="width: 100%; padding: 8px 12px; background: #0d1117; color: white; border: 1px solid #30363d; border-radius: 6px;" />
      </div>
    </div>

    <!-- Configuration Section -->
    <div style="border: 1px solid #30363d; border-radius: 6px; padding: 20px; margin-bottom: 24px; background: #161b22;">
      <h3 style="margin-top: 0;">Configuration</h3>

      <div style="margin-top: 16px;">
        <label style="font-weight: 600; display: block; margin-bottom: 6px;">Choose visibility *</label>
        <button id="repository_visibility" data-testid="choose-visibility-dropdown" aria-label="Choose visibility" type="button" style="padding: 8px 16px; background: #21262d; color: white; border: 1px solid #30363d; border-radius: 6px; display: flex; align-items: center; gap: 8px;">
          <span>🌐 Public</span>
          <span style="color: #8b949e;">(Anyone on the internet can see this repository)</span>
        </button>
      </div>

      <div style="margin-top: 20px; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <label style="font-weight: 600; display: block;">Add README</label>
          <span style="font-size: 13px; color: #8b949e;">This is where you can write a long description for your project.</span>
        </div>
        <button id="repository_auto_init" role="switch" aria-label="Add README" data-testid="readme-toggle-switch" type="button" style="padding: 6px 14px; background: #238636; color: white; border: none; border-radius: 20px;">
          ON
        </button>
      </div>

      <div style="margin-top: 16px;">
        <label style="font-weight: 600; display: block; margin-bottom: 6px;">Add .gitignore</label>
        <button type="button" aria-label="Add .gitignore" style="padding: 6px 12px; background: #21262d; color: white; border: 1px solid #30363d; border-radius: 6px;">None</button>
      </div>

      <div style="margin-top: 16px;">
        <label style="font-weight: 600; display: block; margin-bottom: 6px;">Add license</label>
        <button type="button" aria-label="Add license" style="padding: 6px 12px; background: #21262d; color: white; border: 1px solid #30363d; border-radius: 6px;">None</button>
      </div>
    </div>

    <!-- Create Repository Button -->
    <div style="margin-top: 24px;">
      <button id="create-repo-btn" data-testid="create-repository-button" type="submit" class="btn-primary" style="padding: 10px 24px; background: #238636; color: white; border: none; border-radius: 6px; font-weight: 600; font-size: 14px; cursor: pointer;">
        Create repository
      </button>
    </div>
  </form>
</body>
</html>
`;

// Start mock server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(HTML_GITHUB_MODERN);
});

await new Promise((r) => server.listen(PORT, '127.0.0.1', r));

const screenshotsDir = path.resolve('scratch_screenshots');
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

let browser;
try {
  browser = await puppeteer.launch({
    headless: 'new',
    executablePath: EDGE_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  async function injectScripts() {
    const flowsCode = fs.readFileSync(path.join(EXTENSION_PATH, 'flows.js'), 'utf-8');
    const contentCode = fs.readFileSync(path.join(EXTENSION_PATH, 'content/content.js'), 'utf-8');
    const cssCode = fs.readFileSync(path.join(EXTENSION_PATH, 'content/overlay.css'), 'utf-8');
    await page.addStyleTag({ content: cssCode });
    await page.evaluate(flowsCode);
    await page.evaluate(contentCode);
  }

  console.log('=== RUNNING THREE CONSECUTIVE CLEAN RUNS ===\n');

  for (let run = 1; run <= 3; run++) {
    console.log(`--- RUN ${run} START ---`);
    await page.goto(`http://127.0.0.1:${PORT}/github.com/new`);
    await injectScripts();

    // 1. Start Flow
    await page.evaluate(() => {
      window.ClickGuidePlayer.startFlow('create-repo', 'en');
    });

    // Step 1: Repo name
    let h1 = await page.$('input#repository_name.clickguide-highlight-target');
    assert.ok(h1, `Run ${run} Step 1: Repo name field highlighted`);
    let title1 = await page.$eval('#clickguide-step-title', (el) => el.textContent);
    console.log(`  ✓ Run ${run} Step 1: ${title1}`);
    if (run === 1) await page.screenshot({ path: path.join(screenshotsDir, 'run1_step1.png') });

    // Step 2: Description
    await page.evaluate(() => window.ClickGuidePlayer.nextStep());
    let h2 = await page.$('input#repository_description.clickguide-highlight-target');
    assert.ok(h2, `Run ${run} Step 2: Description field highlighted`);
    let title2 = await page.$eval('#clickguide-step-title', (el) => el.textContent);
    console.log(`  ✓ Run ${run} Step 2: ${title2}`);
    if (run === 1) await page.screenshot({ path: path.join(screenshotsDir, 'run1_step2.png') });

    // Step 3: Choose visibility dropdown
    await page.evaluate(() => window.ClickGuidePlayer.nextStep());
    let h3 = await page.$('button#repository_visibility.clickguide-highlight-target');
    assert.ok(h3, `Run ${run} Step 3: Visibility dropdown highlighted`);
    let title3 = await page.$eval('#clickguide-step-title', (el) => el.textContent);
    console.log(`  ✓ Run ${run} Step 3: ${title3} (Action: Choose Public here)`);
    if (run === 1) await page.screenshot({ path: path.join(screenshotsDir, 'run1_step3.png') });

    // Step 4: Add README toggle
    await page.evaluate(() => window.ClickGuidePlayer.nextStep());
    let h4 = await page.$('button#repository_auto_init.clickguide-highlight-target');
    assert.ok(h4, `Run ${run} Step 4: README toggle highlighted`);
    let title4 = await page.$eval('#clickguide-step-title', (el) => el.textContent);
    console.log(`  ✓ Run ${run} Step 4: ${title4}`);
    if (run === 1) await page.screenshot({ path: path.join(screenshotsDir, 'run1_step4.png') });

    // Step 5: Create repository button
    await page.evaluate(() => window.ClickGuidePlayer.nextStep());
    let h5 = await page.$('button#create-repo-btn.clickguide-highlight-target');
    assert.ok(h5, `Run ${run} Step 5: Create button highlighted`);
    let title5 = await page.$eval('#clickguide-step-title', (el) => el.textContent);
    console.log(`  ✓ Run ${run} Step 5: ${title5}`);
    if (run === 1) await page.screenshot({ path: path.join(screenshotsDir, 'run1_step5.png') });

    // Verify zero fallback modals
    let fallback = await page.$('#clickguide-fallback-card');
    assert.strictEqual(fallback, null, `Run ${run}: Zero fallback cards`);

    // Finish guide without clicking real button
    await page.evaluate(() => window.ClickGuidePlayer.nextStep());
    let activeOverlay = await page.$('#clickguide-guidance-box');
    assert.strictEqual(activeOverlay, null, `Run ${run}: Guidance completed cleanly and removed`);

    console.log(`--- RUN ${run} COMPLETE: CLEAN ---\n`);
  }

  assert.strictEqual(consoleErrors.length, 0, `Expected 0 console errors, got ${consoleErrors.length}`);
  console.log('ALL 3 CONSECUTIVE RUNS PASSED CLEANLY WITH ZERO FALLBACKS AND ZERO CONSOLE ERRORS!');

} finally {
  if (browser) await browser.close();
  server.close();
}
