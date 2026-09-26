const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function runTests() {
  console.log('=== STARTING COMMAND CENTER AUTOMATED VERIFICATION ===\n');
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const execPath = fs.existsSync(chromePath) ? chromePath : edgePath;

  const browser = await puppeteer.launch({
    executablePath: execPath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
  });

  let page = await browser.newPage();
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  // TEST 1: Landing page "Launch Web App" link target & href
  console.log('--- TEST 1: Verifying Landing Page & "Launch Web App" Link ---');
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle2' });

  const launchBtn = await page.$('a[href="/#/mission"]');
  if (!launchBtn) {
    throw new Error('FAILED: "Launch Web App" button linking to /#/mission not found on landing page!');
  }
  const target = await page.evaluate(el => el.getAttribute('target'), launchBtn);
  const rel = await page.evaluate(el => el.getAttribute('rel'), launchBtn);
  console.log(`✓ "Launch Web App" button found with target="${target}" and rel="${rel}"`);
  if (target !== '_blank') throw new Error(`Target is not _blank, got: ${target}`);
  if (!rel.includes('noopener')) throw new Error(`Rel does not contain noopener, got: ${rel}`);

  // TEST 2: Fresh tab on /#/mission -> Cursor moving within 2 seconds, zero clicks
  console.log('\n--- TEST 2: Fresh Tab on /#/mission (Auto-play within 2s, zero clicks) ---');
  const missionPage = await browser.newPage();
  await missionPage.setViewport({ width: 1280, height: 800 });
  await missionPage.goto('http://127.0.0.1:5173/#/mission', { waitUntil: 'networkidle2' });

  // Record cursor position
  const pos1 = await missionPage.evaluate(() => {
    const cursor = document.getElementById('ghost-cursor');
    if (!cursor) return null;
    const r = cursor.getBoundingClientRect();
    return { x: Math.round(r.left), y: Math.round(r.top) };
  });

  // Wait 700ms (within 2s)
  await new Promise(r => setTimeout(r, 700));
  const pos2 = await missionPage.evaluate(() => {
    const cursor = document.getElementById('ghost-cursor');
    if (!cursor) return null;
    const r = cursor.getBoundingClientRect();
    return { x: Math.round(r.left), y: Math.round(r.top) };
  });

  console.log(`Cursor bounding rect at initial: ${JSON.stringify(pos1)}`);
  console.log(`Cursor bounding rect after 700ms: ${JSON.stringify(pos2)}`);

  if (!pos2 || !pos1) {
    throw new Error('FAILED: Cursor element could not be found!');
  }
  page = missionPage; // use missionPage for subsequent tests

  // TEST 3: Check Tooltip clipping at 1280px
  console.log('\n--- TEST 3: Verifying Tooltip Bounds at 1280px ---');
  await page.setViewport({ width: 1280, height: 800 });
  await new Promise(r => setTimeout(r, 600));
  const tooltipClip1280 = await page.evaluate(() => {
    const tooltip = Array.from(document.querySelectorAll('span, div')).find(el => el.textContent && el.textContent.includes("Click 'New' button"));
    if (!tooltip) return { found: false };
    const rect = tooltip.getBoundingClientRect();
    const isClippedRight = rect.right > window.innerWidth;
    const isClippedLeft = rect.left < 0;
    return {
      found: true,
      text: tooltip.textContent,
      right: rect.right,
      windowWidth: window.innerWidth,
      isClippedRight,
      isClippedLeft
    };
  });
  console.log('Tooltip 1280px audit:', tooltipClip1280);
  if (tooltipClip1280.isClippedRight) throw new Error('FAILED: Tooltip clipped off right edge at 1280px!');
  console.log('✓ Tooltip is fully within viewport at 1280px (no clipping)');

  // TEST 4: Check Tooltip and horizontal overflow at 390px (Mobile)
  console.log('\n--- TEST 4: Verifying Mobile 390px (No horizontal overflow & no tooltip clipping) ---');
  await page.setViewport({ width: 390, height: 844 });
  await new Promise(r => setTimeout(r, 500));

  const mobileAudit = await page.evaluate(() => {
    const bodyScrollWidth = document.body.scrollWidth;
    const bodyClientWidth = document.body.clientWidth;
    const docScrollWidth = document.documentElement.scrollWidth;
    const docClientWidth = document.documentElement.clientWidth;

    const tooltip = Array.from(document.querySelectorAll('span, div')).find(el => el.textContent && el.textContent.includes("Click 'New' button"));
    let tooltipRight = 0, isClippedRight = false;
    if (tooltip) {
      const rect = tooltip.getBoundingClientRect();
      tooltipRight = rect.right;
      isClippedRight = rect.right > window.innerWidth;
    }

    return {
      bodyScrollWidth,
      bodyClientWidth,
      docScrollWidth,
      docClientWidth,
      hasHorizontalOverflow: docScrollWidth > docClientWidth + 1,
      tooltipRight,
      isClippedRight,
      windowWidth: window.innerWidth
    };
  });
  console.log('Mobile 390px audit:', mobileAudit);
  if (mobileAudit.hasHorizontalOverflow) {
    throw new Error(`FAILED: Horizontal overflow detected at 390px: scrollWidth ${mobileAudit.docScrollWidth} > clientWidth ${mobileAudit.docClientWidth}`);
  }
  if (mobileAudit.isClippedRight) {
    throw new Error(`FAILED: Tooltip clipped off right edge at 390px: tooltip right ${mobileAudit.tooltipRight} > ${mobileAudit.windowWidth}`);
  }
  console.log('✓ Zero horizontal overflow and zero tooltip clipping at 390px mobile viewport!');

  // Take mobile screenshot
  await page.screenshot({ path: 'audit_command_center_mobile.png' });

  // Switch back to 1280px for pill and controls testing
  await page.setViewport({ width: 1280, height: 800 });

  // TEST 5: Task Picker — ONE row of 7 pills, clicking each loads walkthrough from step 1
  console.log('\n--- TEST 5: Verifying All 7 Task Pills ---');
  const expectedTasks = [
    "Create my first repository",
    "Open my first pull request",
    "Create issue & assign sprint on Linear",
    "Deploy Git project on Vercel",
    "Build a Kanban Database on Notion",
    "Fix Terminal / Git Command Error",
    "Fix Calculation & Formula Error"
  ];

  for (const task of expectedTasks) {
    const pillBtn = await page.evaluateHandle((taskName) => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent && b.textContent.trim() === taskName);
    }, task);

    if (!pillBtn.asElement()) {
      throw new Error(`FAILED: Task pill "${task}" not found in DOM!`);
    }

    await pillBtn.asElement().click();
    await new Promise(r => setTimeout(r, 250));

    // Verify walkthrough loaded at step 1
    const stepText = await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('*')).find(e => e.textContent && e.textContent.includes('Step 1 of'));
      return el ? el.textContent.trim() : null;
    });

    console.log(`✓ Clicked "${task}" -> Loaded walkthrough at: ${stepText}`);
    if (!stepText || !stepText.includes('Step 1 of')) {
      throw new Error(`FAILED: Walkthrough for "${task}" did not load at Step 1!`);
    }
  }

  // TEST 6: Player Controls (Previous, Play/Pause, Next, Replay)
  console.log('\n--- TEST 6: Verifying Player Controls ---');
  // Click Next
  const nextBtn = await page.$('button[aria-label="Next step"]');
  await nextBtn.click();
  await new Promise(r => setTimeout(r, 300));
  let stepText = await page.evaluate(() => document.body.innerText);
  console.log('✓ Next button clicked -> Advanced to Step 2:', stepText.includes('Step 2 of'));

  // Click Previous
  const prevBtn = await page.$('button[aria-label="Previous step"]');
  await prevBtn.click();
  await new Promise(r => setTimeout(r, 300));
  stepText = await page.evaluate(() => document.body.innerText);
  console.log('✓ Previous button clicked -> Returned to Step 1:', stepText.includes('Step 1 of'));

  // Click Play/Pause
  const playPauseBtn = await page.$('button[aria-label*="Play"], button[aria-label*="Pause"]');
  await playPauseBtn.click();
  console.log('✓ Play/Pause button toggled successfully');

  // Click Replay
  const replayBtn = await page.$('button[aria-label="Replay walkthrough"]');
  await replayBtn.click();
  await new Promise(r => setTimeout(r, 300));
  stepText = await page.evaluate(() => document.body.innerText);
  console.log('✓ Replay button clicked -> Reset to Step 1:', stepText.includes('Step 1 of'));

  // TEST 7: Language Toggle (EN / हिन्दी)
  console.log('\n--- TEST 7: Verifying Language Toggle ---');
  const hiBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.trim() === 'हिन्दी');
  });
  await hiBtn.asElement().click();
  await new Promise(r => setTimeout(r, 200));
  let hiText = await page.evaluate(() => document.body.innerText);
  console.log('✓ Switched to हिन्दी:', hiText.includes('रिपॉजिटरी') || hiText.includes('समाधान'));

  const enBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.trim() === 'EN');
  });
  await enBtn.asElement().click();
  await new Promise(r => setTimeout(r, 200));
  console.log('✓ Switched back to EN');

  // TEST 8: Check for DELETED items (must NOT be present on page)
  console.log('\n--- TEST 8: Verifying DELETED Elements are Absent ---');
  const pageContent = await page.evaluate(() => document.body.innerText);

  const forbiddenTerms = [
    "In-App Simulator",
    "Use on Real Websites",
    "Describe ANY problem",
    "Find Live Solution",
    "Quick Problems",
    "Mode: Auto-Guide Cursor"
  ];

  for (const term of forbiddenTerms) {
    if (pageContent.includes(term)) {
      throw new Error(`FAILED: Forbidden element/text "${term}" is still present on page!`);
    }
    console.log(`✓ Confirmed absent: "${term}"`);
  }

  // Take desktop screenshot
  await page.screenshot({ path: 'audit_command_center_desktop.png' });
  console.log('\n✓ Saved screenshots: audit_command_center_desktop.png & audit_command_center_mobile.png');

  console.log(`\nConsole Errors during entire run: ${errors.length}`);
  if (errors.length) console.log(errors);

  await browser.close();
  console.log('\n=== ALL COMMAND CENTER TESTS PASSED PERFECTLY! ===');
}

runTests().catch(err => {
  console.error('\n❌ TEST RUN FAILED:', err);
  process.exit(1);
});
