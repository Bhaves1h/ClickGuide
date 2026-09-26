// ClickGuide Authored Flows (Verified against live websites)
const CLICKGUIDE_FLOWS = {
  // 1. Create my first repository (Verified on live github.com/new)
  'create-repo': {
    id: 'create-repo',
    title_en: 'Create my first repository',
    title_hi: 'अपनी पहली रिपॉजिटरी बनाएं',
    urlMatch: 'github.com/new',
    targetUrl: 'https://github.com/new',
    description_en: 'Set up a new GitHub repository with a README and public visibility in 5 guided steps.',
    description_hi: '5 आसान चरणों में README और पब्लिक विजिबिलिटी के साथ नई GitHub रिपॉजिटरी बनाएं।',
    steps: [
      {
        id: 'step-repo-name',
        urlMatch: 'github.com/new',
        labelText: ['Repository name', 'Repository name *'],
        selectors: [
          'input[data-testid="repository-name-input"], input[aria-label*="Repository name" i]',
          '#repository_name, input[name="repository[name]"]'
        ],
        selector: 'input[data-testid="repository-name-input"], input[aria-label*="Repository name" i], #repository_name',
        title_en: 'Name your repository',
        title_hi: 'अपनी रिपॉजिटरी को नाम दें',
        desc_en: "Type a short, memorable name for your project (e.g., 'my-first-app').",
        desc_hi: "अपने प्रोजेक्ट के लिए एक छोटा और यादगार नाम लिखें (उदा. 'my-first-app')।",
        actionText: 'Enter repository name'
      },
      {
        id: 'step-repo-desc',
        optional: true,
        urlMatch: 'github.com/new',
        labelText: ['Description'],
        selectors: [
          'input[aria-label*="Description" i], textarea[aria-label*="Description" i]',
          '#repository_description, input[name="repository[description]"]'
        ],
        selector: 'input[aria-label*="Description" i], textarea[aria-label*="Description" i], #repository_description',
        title_en: 'Add a short description',
        title_hi: 'छोटा विवरण जोड़ें',
        desc_en: 'Optionally describe what this project is about so teammates understand it immediately.',
        desc_hi: 'वैकल्पिक रूप से बताएं कि यह प्रोजेक्ट किस बारे में है ताकि अन्य लोग समझ सकें।',
        actionText: 'Enter description'
      },
      {
        id: 'step-visibility',
        urlMatch: 'github.com/new',
        labelText: ['Choose visibility', 'Choose visibility *', 'Visibility'],
        selectors: [
          'button[aria-label*="visibility" i], [data-testid*="visibility"]',
          '#repository_visibility, button[id*="visibility" i], #repository_visibility_public'
        ],
        selector: 'button[aria-label*="visibility" i], [data-testid*="visibility"], #repository_visibility, #repository_visibility_public',
        title_en: 'Choose visibility dropdown',
        title_hi: 'विजिबिलिटी ड्रॉपडाउन चुनें',
        desc_en: 'Choose Public here so teammates, mentors, and the open-source community can view your code.',
        desc_hi: 'यहाँ Public चुनें ताकि आपके साथी और मेंटर्स आपका कोड देख सकें।',
        actionText: 'Choose Public here'
      },
      {
        id: 'step-readme',
        optional: true,
        urlMatch: 'github.com/new',
        labelText: ['Add README', 'Add a README file', 'README'],
        selectors: [
          'button[role="switch"][aria-label*="README" i], button[role="switch"]',
          '#repository_auto_init, input[type="checkbox"][name*="auto_init"]'
        ],
        selector: 'button[role="switch"][aria-label*="README" i], button[role="switch"], #repository_auto_init',
        title_en: "Toggle 'Add README'",
        title_hi: "'Add README' टॉगल करें",
        desc_en: "Toggle 'Add README' to automatically initialize your repository with a documentation file.",
        desc_hi: "'Add README' टॉगल करें ताकि रिपॉजिटरी में विवरण जुड़ सके।",
        actionText: "Toggle 'Add README'"
      },
      {
        id: 'step-submit',
        urlMatch: 'github.com/new',
        isEndStep: true,
        labelText: ['Create repository'],
        selectors: [
          'button[data-testid="create-repository-button"], button[type="submit"]',
          'form button[type="submit"], button#create-repo-btn'
        ],
        selector: 'button[data-testid="create-repository-button"], button[type="submit"], form button[type="submit"], button#create-repo-btn',
        title_en: "Glide onto 'Create repository'",
        title_hi: "'Create repository' पर कर्सर ले जाएं",
        desc_en: "Glide cursor onto 'Create repository'. You are all set! (Guide complete)",
        desc_hi: "'Create repository' पर कर्सर ले जाएं। आपका वॉकथ्रू पूरा हुआ!",
        actionText: 'Complete guide'
      }
    ]
  },

  // 2. Open my first pull request (Verified on live github.com repo pages)
  'open-pr': {
    id: 'open-pr',
    title_en: 'Open my first pull request',
    title_hi: 'पहला पुल रिक्वेस्ट खोलें',
    urlMatch: 'github.com',
    targetUrl: 'https://github.com',
    description_en: 'Propose your branch changes, edit README, and open a pull request in 4 steps.',
    description_hi: 'README फ़ाइल बदलें, बदलाव कमिट करें और 4 चरणों में पुल रिक्वेस्ट भेजें।',
    steps: [
      {
        id: 'step-edit-btn',
        urlMatch: 'github.com',
        selectors: [
          'a[aria-label*="Edit this file" i]',
          'button[aria-label*="Edit this file" i]',
          '[data-testid="pencil-button"]',
          'a[data-testid="edit-button"]',
          '#edit-button',
          'a.js-edit-file',
          'a[aria-label*="Edit" i]',
          'button[aria-label*="Edit" i]'
        ],
        selector: 'a[aria-label*="Edit this file" i], button[aria-label*="Edit this file" i], [data-testid="pencil-button"], a[data-testid="edit-button"], #edit-button',
        title_en: 'Click Edit File (Pencil)',
        title_hi: 'फ़ाइल एडिट करें (पेंसिल आइकन)',
        desc_en: 'Click the pencil icon on the README to open the in-browser file editor.',
        desc_hi: 'ब्राउज़र एडिटर खोलने के लिए README पर पेंसिल आइकन पर क्लिक करें।',
        actionText: 'Click Edit file'
      },
      {
        id: 'step-editor-area',
        urlMatch: 'github.com',
        selectors: [
          '.cm-content',
          '.cm-editor',
          '.monaco-editor',
          '#commit-file-body',
          'textarea[name="value"]',
          '.react-blob-editor-header',
          '#file-content'
        ],
        selector: '.cm-content, .cm-editor, #commit-file-body, textarea[name="value"], #file-content',
        title_en: 'Make your edits',
        title_hi: 'अपने बदलाव लिखें',
        desc_en: 'Make your changes or add a new line directly inside this live code editor.',
        desc_hi: 'इस लाइव कोड एडिटर में सीधे अपने बदलाव या नई लाइन लिखें।',
        actionText: 'Edit file content'
      },
      {
        id: 'step-commit-btn',
        urlMatch: 'github.com',
        selectors: [
          'button[data-testid="open-commit-dialog-button"]',
          'button.js-blob-submit',
          'button[aria-label*="Commit" i]',
          '#commit-changes-button',
          'button.btn-primary[data-hotkey*="Mod+Enter"]'
        ],
        selector: 'button[data-testid="open-commit-dialog-button"], button.js-blob-submit, button[aria-label*="Commit" i], #commit-changes-button',
        title_en: "Click 'Commit changes...'",
        title_hi: "'Commit changes...' पर क्लिक करें",
        desc_en: 'Click this button to open the commit dialog and summary panel.',
        desc_hi: 'कमिट डायलॉग और विवरण बॉक्स खोलने के लिए इस बटन पर क्लिक करें।',
        actionText: 'Click Commit changes'
      },
      {
        id: 'step-propose-btn',
        urlMatch: 'github.com',
        selectors: [
          'button[data-testid="commit-changes-button"]',
          'button#submit-file',
          'button.js-blob-submit',
          'button[type="submit"].btn-primary'
        ],
        selector: 'button[data-testid="commit-changes-button"], button#submit-file, button.js-blob-submit, button[type="submit"].btn-primary',
        title_en: "Click 'Propose changes'",
        title_hi: "'Propose changes' पर क्लिक करें",
        desc_en: "Click 'Propose changes' to save your branch and open your first pull request!",
        desc_hi: "अपनी ब्रांच सेव करने और पुल रिक्वेस्ट तैयार करने के लिए 'Propose changes' पर क्लिक करें!",
        actionText: 'Click Propose changes'
      }
    ]
  },

  // 3. Create issue & assign sprint on Linear (Requires authentication - ungrounded live selectors omitted)
  'linear-issue': {
    id: 'linear-issue',
    title_en: 'Create issue & assign sprint on Linear',
    title_hi: 'Linear पर इशू बनाएं और स्प्रिंट असाइन करें',
    urlMatch: 'linear.app',
    targetUrl: 'https://linear.app',
    description_en: 'Track software bugs or features and link them to your current cycle.',
    description_hi: 'Linear में नया टास्क बनाएं और स्प्रिंट में जोड़ें।',
    steps: [] // Omitted rather than faking unverified selectors
  },

  // 4. Deploy Git project on Vercel (Requires authentication - ungrounded live selectors omitted)
  'vercel-deploy': {
    id: 'vercel-deploy',
    title_en: 'Deploy Git project on Vercel',
    title_hi: 'Vercel पर गिट प्रोजेक्ट डिप्लॉय करें',
    urlMatch: 'vercel.com',
    targetUrl: 'https://vercel.com',
    description_en: 'Import a GitHub repository, configure environment variables, and publish globally.',
    description_hi: 'GitHub प्रोजेक्ट को Vercel से जोड़ें और लाइव करें।',
    steps: [] // Omitted rather than faking unverified selectors
  },

  // 5. Build a Kanban Database on Notion (Requires authentication - ungrounded live selectors omitted)
  'notion-database': {
    id: 'notion-database',
    title_en: 'Build a Kanban Database on Notion',
    title_hi: 'Notion पर कानबान डेटाबेस बनाएं',
    urlMatch: 'notion.so',
    targetUrl: 'https://notion.so',
    description_en: 'Create an interactive project board with custom tags and progress columns.',
    description_hi: 'Notion में नया बोर्ड डेटाबेस बनाएं और टास्क कार्ड जोड़ें।',
    steps: [] // Omitted rather than faking unverified selectors
  },

  // 6. Fix Terminal / Git Command Error (CLI/Local task - runs in ClickGuide Command Center)
  'command-error': {
    id: 'command-error',
    title_en: 'Fix Terminal / Git Command Error',
    title_hi: 'टर्मिनल / Git कमांड एरर ठीक करें',
    urlMatch: 'mission',
    targetUrl: 'http://localhost:5173/#/mission',
    description_en: 'Resolve push rejections, detached HEAD, and merge conflicts cleanly.',
    description_hi: 'टर्मिनल और Git कमांड्स की त्रुटियां ठीक करें।',
    steps: [] // Omitted rather than faking unverified selectors
  },

  // 7. Fix Calculation & Formula Error (Math/Local task - runs in ClickGuide Command Center)
  'calculation-error': {
    id: 'calculation-error',
    title_en: 'Fix Calculation & Formula Error',
    title_hi: 'कैलकुलेशन और फार्मूला एरर ठीक करें',
    urlMatch: 'mission',
    targetUrl: 'http://localhost:5173/#/mission',
    description_en: 'Diagnose formula discrepancies, floating-point rounding, and metric errors.',
    description_hi: 'कैलकुलेशन और फार्मूला एरर का लाइव समाधान पाएं।',
    steps: [] // Omitted rather than faking unverified selectors
  }
};

// Full list of 7 walkthroughs for popup UI
const CLICKGUIDE_ALL_WALKTHROUGHS = [
  { id: 'create-repo', platform: 'GitHub', icon: '📦', title_en: 'Create my first repository', title_hi: 'अपनी पहली रिपॉजिटरी बनाएं', verified: true, targetUrl: 'https://github.com/new' },
  { id: 'open-pr', platform: 'GitHub', icon: '🔀', title_en: 'Open my first pull request', title_hi: 'पहला पुल रिक्वेस्ट खोलें', verified: true, targetUrl: 'https://github.com' },
  { id: 'linear-issue', platform: 'Linear', icon: '⚡', title_en: 'Create issue & assign sprint on Linear', title_hi: 'Linear पर इशू बनाएं और स्प्रिंट असाइन करें', verified: false, targetUrl: 'https://linear.app' },
  { id: 'vercel-deploy', platform: 'Vercel', icon: '▲', title_en: 'Deploy Git project on Vercel', title_hi: 'Vercel पर गिट प्रोजेक्ट डिप्लॉय करें', verified: false, targetUrl: 'https://vercel.com' },
  { id: 'notion-database', platform: 'Notion', icon: '📝', title_en: 'Build a Kanban Database on Notion', title_hi: 'Notion पर कानबान डेटाबेस बनाएं', verified: false, targetUrl: 'https://notion.so' },
  { id: 'command-error', platform: 'CLI', icon: '💻', title_en: 'Fix Terminal / Git Command Error', title_hi: 'टर्मिनल / Git कमांड एरर ठीक करें', verified: false, targetUrl: 'http://localhost:5173/#/mission' },
  { id: 'calculation-error', platform: 'Math', icon: '🔢', title_en: 'Fix Calculation & Formula Error', title_hi: 'कैलकुलेशन और फार्मूला एरर ठीक करें', verified: false, targetUrl: 'http://localhost:5173/#/mission' }
];

// Global browser window assignment
if (typeof window !== 'undefined') {
  window.CLICKGUIDE_FLOWS = CLICKGUIDE_FLOWS;
  window.CLICKGUIDE_ALL_WALKTHROUGHS = CLICKGUIDE_ALL_WALKTHROUGHS;
}
if (typeof globalThis !== 'undefined') {
  globalThis.CLICKGUIDE_FLOWS = CLICKGUIDE_FLOWS;
  globalThis.CLICKGUIDE_ALL_WALKTHROUGHS = CLICKGUIDE_ALL_WALKTHROUGHS;
}
// Node module export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CLICKGUIDE_FLOWS,
    CLICKGUIDE_ALL_WALKTHROUGHS
  };
}
