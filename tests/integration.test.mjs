// ClickGuide Automated Integration Tests (Puppeteer Headless Chromium)
import http from 'http';
import path from 'path';
import fs from 'fs';
import puppeteer from 'puppeteer-core';
import assert from 'assert';

const PORT = 8899;
const EXTENSION_PATH = path.resolve('extension');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

let passedTests = 0;
let failedTests = 0;
let consoleErrors = [];

function it(description, fn) {
  return async () => {
    try {
      await fn();
      console.log(`  ✓ ${description}`);
      passedTests++;
    } catch (err) {
      console.error(`  ✗ ${description}`);
      console.error(`    ${err.message}`);
      failedTests++;
    }
  };
}

// 1. Mock HTML Fixtures
const HTML_GITHUB_NEW = `
<!DOCTYPE html>
<html>
<head><title>GitHub: Create a new repository</title></head>
<body style="padding: 40px; font-family: sans-serif; background: #0d1117; color: #fff;">
  <h2>Create a new repository</h2>
  <form action="/repositories" method="post">
    <!-- General section -->
    <div style="margin-bottom: 20px;">
      <h3>General</h3>
      <div style="margin-top: 10px;">
        <label>Repository name *</label><br/>
        <input id="repository_name" data-testid="repository-name-input" name="repository[name]" aria-label="Repository name" type="text" style="width: 300px; padding: 8px;" />
      </div>
      <div style="margin-top: 15px;">
        <label>Description</label><br/>
        <input id="repository_description" name="repository[description]" aria-label="Description" placeholder="Description" type="text" style="width: 400px; padding: 8px;" />
      </div>
    </div>

    <!-- Configuration section -->
    <div style="margin-bottom: 20px;">
      <h3>Configuration</h3>
      <div style="margin-top: 15px;">
        <label>Choose visibility *</label><br/>
        <button id="repository_visibility" aria-label="Choose visibility" data-testid="visibility-dropdown-button" type="button" style="padding: 8px 16px;">
          Public (Choose visibility)
        </button>
      </div>
      <div style="margin-top: 15px;">
        <label>Add README</label><br/>
        <button id="repository_auto_init" role="switch" aria-label="Add README" data-testid="readme-toggle-switch" type="button" style="padding: 6px 12px;">
          Toggle README
        </button>
      </div>
    </div>

    <div style="margin-top: 25px;">
      <button id="create-repo-btn" data-testid="create-repository-button" type="submit" class="btn-primary" style="padding: 10px 20px; background: #238636; color: white;">
        Create repository
      </button>
    </div>
  </form>
</body>
</html>
`;

const HTML_GITHUB_REPO = `
<!DOCTYPE html>
<html>
<head><title>octocat/Hello-World</title></head>
<body style="padding: 40px; font-family: sans-serif; background: #0d1117; color: #fff;">
  <h2>README.md</h2>
  <div style="display: flex; justify-content: flex-end; margin-bottom: 10px;">
    <a href="#" aria-label="Edit this file" data-testid="pencil-button" id="edit-button" style="padding: 6px 12px; background: #21262d; color: white;">
      Edit (Pencil)
    </a>
  </div>
  <div class="cm-content" style="min-height: 120px; border: 1px solid #30363d; padding: 10px;">
    Hello World README content to edit
  </div>
  <div style="margin-top: 20px; display: flex; gap: 10px;">
    <button data-testid="open-commit-dialog-button" class="btn-primary" style="padding: 8px 16px;">
      Commit changes...
    </button>
    <button data-testid="commit-changes-button" id="submit-file" class="btn-primary" style="padding: 8px 16px;">
      Propose changes
    </button>
  </div>
</body>
</html>
`;

const HTML_WRONG_PAGE = `
<!DOCTYPE html>
<html>
<head><title>Completely Unrelated Page</title></head>
<body style="padding: 40px; font-family: sans-serif;">
  <h1>Welcome to an Unrelated Blog</h1>
  <p>There are no repository creation or pull request buttons here.</p>
</body>
</html>
`;

// Start mock local HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  if (req.url === '/github-new.html') {
    res.end(HTML_GITHUB_NEW);
  } else if (req.url === '/github-repo.html') {
    res.end(HTML_GITHUB_REPO);
  } else if (req.url === '/wrong-page.html') {
    res.end(HTML_WRONG_PAGE);
  } else {
    res.end('<h1>404 Not Found</h1>');
  }
});

await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
console.log(`Mock test server listening at http://127.0.0.1:${PORT}`);

console.log('\n=== RUNNING CLICKGUIDE INTEGRATION TESTS (Headless Chromium) ===\n');

let browser;
try {
  browser = await puppeteer.launch({
    headless: 'new',
    executablePath: EDGE_PATH,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const page = await browser.newPage();

  let consoleMessages = [];

  // Track console output & errors
  page.on('console', (msg) => {
    consoleMessages.push(msg.text());
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Inject content scripts helper
  async function injectExtensionScripts(targetPage) {
    const flowsCode = fs.readFileSync(path.join(EXTENSION_PATH, 'flows.js'), 'utf-8');
    const contentCode = fs.readFileSync(path.join(EXTENSION_PATH, 'content/content.js'), 'utf-8');
    const cssCode = fs.readFileSync(path.join(EXTENSION_PATH, 'content/overlay.css'), 'utf-8');

    await targetPage.addStyleTag({ content: cssCode });
    await targetPage.evaluate(flowsCode);
    await targetPage.evaluate(contentCode);
  }

  // TEST 1: Flow A End-to-End on github-new mock
  await it('Flow A: Injects and resolves all 5 steps on repository creation page', async () => {
    await page.goto(`http://127.0.0.1:${PORT}/github-new.html`);
    await injectExtensionScripts(page);

    // Start Flow A
    await page.evaluate(() => {
      window.ClickGuidePlayer.startFlow('create-repo', 'en');
    });

    // Check Step 1 (Repo name)
    const step1Highlight = await page.$('input#repository_name.clickguide-highlight-target, input[data-testid="repository-name-input"].clickguide-highlight-target');
    assert.ok(step1Highlight, 'Step 1: Repo name field should have highlight class');

    const cursorExists = await page.$('#clickguide-cursor');
    assert.ok(cursorExists, 'Virtual cursor element should exist in DOM');

    const step1Title = await page.$eval('#clickguide-step-title', (el) => el.textContent);
    assert.strictEqual(step1Title, 'Name your repository');

    // Advance to Step 2 (Description)
    await page.evaluate(() => window.ClickGuidePlayer.nextStep());
    const step2Highlight = await page.$('input#repository_description.clickguide-highlight-target');
    assert.ok(step2Highlight, 'Step 2: Description field (#repository_description) should have highlight class');

    // Advance to Step 3 (Visibility dropdown)
    await page.evaluate(() => window.ClickGuidePlayer.nextStep());
    const step3Highlight = await page.$('button#repository_visibility.clickguide-highlight-target, button[aria-label*="visibility" i].clickguide-highlight-target');
    assert.ok(step3Highlight, 'Step 3: Visibility dropdown should have highlight class');

    // Advance to Step 4 (README toggle switch)
    await page.evaluate(() => window.ClickGuidePlayer.nextStep());
    const step4Highlight = await page.$('button#repository_auto_init.clickguide-highlight-target, button[role="switch"].clickguide-highlight-target');
    assert.ok(step4Highlight, 'Step 4: README toggle switch should have highlight class');

    // Advance to Step 5 (Submit button)
    await page.evaluate(() => window.ClickGuidePlayer.nextStep());
    const step5Highlight = await page.$('button#create-repo-btn.clickguide-highlight-target, button[data-testid="create-repository-button"].clickguide-highlight-target');
    assert.ok(step5Highlight, 'Step 5: Create button should have highlight class');

    const step5Counter = await page.$eval('#clickguide-step-counter', (el) => el.textContent);
    assert.strictEqual(step5Counter, 'Step 5 of 5');

    // Test Back button retreats to Step 4
    await page.evaluate(() => window.ClickGuidePlayer.previousStep());
    const step4Retreated = await page.$('button#repository_auto_init.clickguide-highlight-target, button[role="switch"].clickguide-highlight-target');
    assert.ok(step4Retreated, 'Retreat: README toggle should be highlighted again');
  })();

  // TEST 1B: Optional steps skipped silently without honest fallback modal
  await it('Flow A Optional Steps: Skips missing description/toggle silently without triggering fallback modal', async () => {
    await page.goto(`http://127.0.0.1:${PORT}/github-new.html`);
    // Remove description and readme toggle from DOM
    await page.evaluate(() => {
      document.getElementById('repository_description')?.remove();
      document.getElementById('repository_auto_init')?.remove();
    });
    await injectExtensionScripts(page);

    await page.evaluate(() => {
      window.ClickGuidePlayer.startFlow('create-repo', 'en');
    });

    // Step 1: Repo name
    const step1 = await page.$('input#repository_name.clickguide-highlight-target');
    assert.ok(step1, 'Step 1: Repo name is highlighted');

    // Advance: Step 2 (Description) is missing & optional -> should silently skip to Step 3 (Visibility)
    await page.evaluate(() => window.ClickGuidePlayer.nextStep());
    const step3 = await page.$('button#repository_visibility.clickguide-highlight-target');
    assert.ok(step3, 'Silently skipped missing optional Description and highlighted Visibility dropdown');

    const fallbackModal = await page.$('#clickguide-fallback-card');
    assert.strictEqual(fallbackModal, null, 'No fallback modal should appear for optional steps');
  })();

  // TEST 2: Flow B End-to-End on github-repo mock
  await it('Flow B: Injects and resolves all 4 steps on repository pull request workflow', async () => {
    await page.goto(`http://127.0.0.1:${PORT}/github-repo.html`);
    await injectExtensionScripts(page);

    // Start Flow B
    await page.evaluate(() => {
      window.ClickGuidePlayer.startFlow('open-pr', 'en');
    });

    // Step 1: Pencil edit button
    const step1Highlight = await page.$('a#edit-button.clickguide-highlight-target');
    assert.ok(step1Highlight, 'Step 1: Pencil edit button should have highlight class');

    // Step 2: Editor area
    await page.evaluate(() => window.ClickGuidePlayer.nextStep());
    const step2Highlight = await page.$('.cm-content.clickguide-highlight-target');
    assert.ok(step2Highlight, 'Step 2: Editor area should have highlight class');

    // Step 3: Commit dialog button
    await page.evaluate(() => window.ClickGuidePlayer.nextStep());
    const step3Highlight = await page.$('button[data-testid="open-commit-dialog-button"].clickguide-highlight-target');
    assert.ok(step3Highlight, 'Step 3: Commit changes button should have highlight class');

    // Step 4: Propose changes button
    await page.evaluate(() => window.ClickGuidePlayer.nextStep());
    const step4Highlight = await page.$('button[data-testid="commit-changes-button"].clickguide-highlight-target');
    assert.ok(step4Highlight, 'Step 4: Propose changes button should have highlight class');
  })();

  // TEST 3: URL Mismatch Toast when running on the wrong URL
  await it('URL Mismatch: Shows toast and halts immediately when executed on wrong page', async () => {
    await page.goto(`http://127.0.0.1:${PORT}/wrong-page.html`);
    await injectExtensionScripts(page);

    // Attempt Flow A on wrong page
    await page.evaluate(() => {
      window.ClickGuidePlayer.startFlow('create-repo', 'en');
    });

    // Check Toast Notification is displayed
    const toast = await page.$('#clickguide-toast');
    assert.ok(toast, 'URL mismatch toast notification should be displayed');

    const toastMsg = await page.$eval('.clickguide-toast-text', (el) => el.textContent.trim());
    assert.strictEqual(
      toastMsg,
      'Open the right page first — this guide runs on https://github.com/new.',
      'Toast message should guide user to the right target URL'
    );

    // Crucial check: Assert NO element is highlighted
    const highlightedElements = await page.$$('.clickguide-highlight-target');
    assert.strictEqual(highlightedElements.length, 0, 'Zero elements must be highlighted on URL mismatch');

    // Assert cursor is not spawned
    const cursor = await page.$('#clickguide-cursor');
    assert.strictEqual(cursor, null, 'Virtual cursor should not appear on wrong page');
  })();

  // TEST 4: Honest Fallback when selector is broken / missing on matching page
  await it('Honest Fallback: Halts immediately and draws NO highlight when selector is missing', async () => {
    await page.goto(`http://127.0.0.1:${PORT}/github-new.html`);
    await injectExtensionScripts(page);

    // Deliberately break the selector by removing the required input elements
    await page.evaluate(() => {
      const el1 = document.getElementById('repository_name');
      if (el1) el1.remove();
      const el2 = document.getElementById('repository-name-input');
      if (el2) el2.remove();
      const el3 = document.querySelector('input[name="repository[name]"]');
      if (el3) el3.remove();
    });

    // Attempt Flow A with missing selector
    await page.evaluate(() => {
      window.ClickGuidePlayer.startFlow('create-repo', 'en');
    });

    // Check Honest Fallback Notice Card is displayed
    const fallbackCard = await page.$('#clickguide-fallback-card');
    assert.ok(fallbackCard, 'Honest fallback card should be injected on missing selector');

    const fallbackMsg = await page.$eval('.clickguide-fallback-msg', (el) => el.textContent.trim());
    assert.ok(
      fallbackMsg.includes("This page looks different than expected — I won't guess. The site may have updated."),
      'Honest fallback message must match non-negotiable specification exactly'
    );

    // Crucial check: Assert NO element is highlighted
    const highlightedElements = await page.$$('.clickguide-highlight-target');
    assert.strictEqual(highlightedElements.length, 0, 'Zero elements must be highlighted on failed selector');

    // Requirement 4 Diagnostic verification
    const hasDiagnosticUrl = consoleMessages.some((m) => m.includes('[ClickGuide Diagnostic] Page URL:'));
    const hasDiagnosticForm = consoleMessages.some((m) => m.includes('[ClickGuide Diagnostic] Nearest Form outerHTML:'));
    assert.ok(hasDiagnosticUrl, 'Honest fallback must log Page URL for instant diagnostics');
    assert.ok(hasDiagnosticForm, 'Honest fallback must log Nearest Form outerHTML for instant diagnostics');
  })();

  // TEST 5: Tier 2 Dynamic Flow execution on live page
  await it('Tier 2: Injects and highlights real elements using target spec (text, role, tag)', async () => {
    await page.goto(`http://127.0.0.1:${PORT}/github-new.html`);
    await injectExtensionScripts(page);

    const dynamicFlow = {
      tier: 2,
      id: 'dynamic-test',
      title_en: 'Custom AI Star Guide',
      title_hi: 'कस्टम एआई गाइड',
      steps: [
        {
          id: 'step-1',
          action: 'click',
          target: {
            text: 'Create repository',
            role: 'button',
            tag: 'button'
          },
          instruction_en: 'Click the Create repository button to finish setup.',
          instruction_hi: 'सेटअप पूरा करने के लिए क्रिएट रिपॉजिटरी बटन पर क्लिक करें।'
        }
      ]
    };

    await page.evaluate((flow) => {
      window.ClickGuidePlayer.startFlow(flow, 'en');
    }, dynamicFlow);

    // Target button should be highlighted
    const buttonHighlight = await page.$('button#create-repo-btn.clickguide-highlight-target');
    assert.ok(buttonHighlight, 'Tier 2 target button should be located and highlighted by text & tag');

    const cursor = await page.$('#clickguide-cursor');
    assert.ok(cursor, 'Virtual ghost cursor should glide to Tier 2 target');

    const desc = await page.$eval('#clickguide-step-desc', (el) => el.textContent);
    assert.strictEqual(desc, 'Click the Create repository button to finish setup.');
  })();

  // TEST 6: Tier 2 Honest Fallback Toast when target is missing on live DOM
  await it('Tier 2 Honest Fallback: Halts immediately, draws NO highlight, and toasts exact message when target is not found', async () => {
    await page.goto(`http://127.0.0.1:${PORT}/github-new.html`);
    await injectExtensionScripts(page);

    const missingTargetFlow = {
      tier: 2,
      id: 'dynamic-missing-test',
      title_en: 'Missing Target Flow',
      steps: [
        {
          id: 'step-1',
          action: 'click',
          target: {
            text: 'Star this repository',
            role: 'button',
            tag: 'button'
          },
          instruction_en: 'Click the star button.'
        }
      ]
    };

    await page.evaluate((flow) => {
      window.ClickGuidePlayer.startFlow(flow, 'en');
    }, missingTargetFlow);

    // Assert NO element is highlighted
    const highlightedElements = await page.$$('.clickguide-highlight-target');
    assert.strictEqual(highlightedElements.length, 0, 'Zero elements must be highlighted when target is missing');

    // Assert Toast displays exact message: "I can't find '<target>' on this page — I won't guess."
    const toast = await page.$('#clickguide-toast');
    assert.ok(toast, 'Toast notification should appear');

    const toastMsg = await page.$eval('.clickguide-toast-text', (el) => el.textContent.trim());
    assert.strictEqual(
      toastMsg,
      "I can't find 'Star this repository' on this page — I won't guess.",
      'Honest fallback toast must match exact user requirement'
    );
  })();

  // TEST 7: Complete Silence Verification (Zero Audio Output / No speechSynthesis)
  await it('Complete Silence: Never invokes speechSynthesis during step progression', async () => {
    await page.goto(`http://127.0.0.1:${PORT}/github-new.html`);
    await injectExtensionScripts(page);

    // Mock speechSynthesis to detect any call
    await page.evaluate(() => {
      window.__speechCalled = false;
      if (window.speechSynthesis) {
        window.speechSynthesis.speak = () => {
          window.__speechCalled = true;
        };
      }
    });

    // Run Flow A through steps
    await page.evaluate(() => {
      window.ClickGuidePlayer.startFlow('create-repo', 'en');
      window.ClickGuidePlayer.nextStep();
      window.ClickGuidePlayer.nextStep();
    });

    const speechCalled = await page.evaluate(() => window.__speechCalled);
    assert.strictEqual(speechCalled, false, 'Speech synthesis must NEVER be called (complete silence)');
  })();

  // TEST 8: Landing Page CTA & Extension Install Modal
  await it('Landing Page CTA: Opens "Install ClickGuide in 2 minutes" modal, downloads valid zip, closes via X, backdrop, and Escape', async () => {
    await page.goto('http://127.0.0.1:5173/');

    // Find primary CTA button with text "Get started — install the extension"
    await page.waitForSelector('#cta button');

    // Click the button containing "Get started"
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('#cta button'));
      const targetBtn = btns.find((b) => b.textContent.includes('Get started'));
      if (targetBtn) targetBtn.click();
    });

    // Verify modal appeared
    await page.waitForSelector('#extension-install-modal');
    const modalTitle = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h3'));
      const found = headings.find((h) => h.textContent.includes('Install ClickGuide in 2 minutes'));
      return found ? found.textContent.trim() : null;
    });
    assert.strictEqual(modalTitle, 'Install ClickGuide in 2 minutes', 'Modal title should match specification');

    // Verify 6 numbered steps are present
    const stepCount = await page.evaluate(() => {
      const numbers = Array.from(document.querySelectorAll('.font-mono')).map((el) => el.textContent.trim());
      return [1, 2, 3, 4, 5, 6].filter((n) => numbers.includes(String(n))).length;
    });
    assert.strictEqual(stepCount, 6, 'All 6 numbered installation steps should be rendered');

    // Verify download link
    const downloadHref = await page.$eval('a[download="clickguide-extension.zip"]', (el) => el.getAttribute('href'));
    assert.strictEqual(downloadHref, '/clickguide-extension.zip', 'Download button must point to clickguide-extension.zip');

    // Verify zip file download is valid and contains manifest.json
    const zipResponse = await fetch('http://127.0.0.1:5173/clickguide-extension.zip');
    assert.strictEqual(zipResponse.status, 200, 'Zip file must return HTTP 200');
    const zipBuffer = Buffer.from(await zipResponse.arrayBuffer());
    assert.ok(zipBuffer.length > 5000, 'Zip archive must be non-empty');

    // Test body scroll locked
    const isLocked = await page.evaluate(() => document.body.style.overflow === 'hidden');
    assert.ok(isLocked, 'Background page body scroll should be locked while modal is open');

    // Test Escape key closes modal
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 600));
    const isClosedEsc = await page.evaluate(() => !document.querySelector('#extension-install-modal'));
    assert.ok(isClosedEsc, 'Modal should close on Escape key press');

    // Re-open modal and test Close (X) button
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('#cta button'));
      const targetBtn = btns.find((b) => b.textContent.includes('Get started'));
      if (targetBtn) targetBtn.click();
    });
    await page.waitForSelector('#extension-install-modal');
    await page.waitForSelector('button[aria-label="Close"]');
    await page.click('button[aria-label="Close"]');
    await new Promise((r) => setTimeout(r, 600));
    const isClosedX = await page.evaluate(() => !document.querySelector('#extension-install-modal'));
    assert.ok(isClosedX, 'Modal should close on clicking X button');
  })();

} finally {
  if (browser) await browser.close();
  server.close();
}

console.log(`\n========================================`);
console.log(`INTEGRATION TEST RESULTS: ${passedTests} passed, ${failedTests} failed`);
console.log(`Console Errors: ${consoleErrors.length}`);
console.log(`========================================\n`);

if (consoleErrors.length > 0) {
  console.error('Captured console errors:');
  consoleErrors.forEach((e) => console.error('  - ', e));
}

if (failedTests > 0 || consoleErrors.length > 0) {
  process.exit(1);
}
