// ClickGuide Popup Controller - Free-Text Problem Input + Voice (Speech-to-Text) + Two-Tier Guidance
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  let currentLang = 'en';
  let resolvedFlow = null;
  let recognition = null;
  let isRecording = false;

  // DOM Elements
  const btnLangEn = document.getElementById('btn-lang-en');
  const btnLangHi = document.getElementById('btn-lang-hi');
  const btnToggleSettings = document.getElementById('btn-toggle-settings');
  const btnCloseSettings = document.getElementById('btn-close-settings');
  const settingsPanel = document.getElementById('settings-panel');
  const geminiKeyInput = document.getElementById('gemini-key-input');
  const btnSaveKey = document.getElementById('btn-save-key');
  const keyStatus = document.getElementById('key-status');

  const viewInput = document.getElementById('view-input');
  const viewLoading = document.getElementById('view-loading');
  const viewSteps = document.getElementById('view-steps');
  const viewNoMatch = document.getElementById('view-no-match');

  const problemInput = document.getElementById('problem-input');
  const btnMic = document.getElementById('btn-mic');
  const micError = document.getElementById('mic-error');
  const btnGuideMe = document.getElementById('btn-guide-me');
  const guideLabel = document.getElementById('guide-label');
  const quickLabel = document.getElementById('quick-label');

  const btnBackToInput = document.getElementById('btn-back-to-input');
  const tierBadge = document.getElementById('tier-badge');
  const flowTitle = document.getElementById('flow-title');
  const stepsContainer = document.getElementById('steps-container');
  const btnStartFlow = document.getElementById('btn-start-flow');
  const startFlowLabel = document.getElementById('start-flow-label');

  const btnOpenSettingsFromEmpty = document.getElementById('btn-open-settings-from-empty');
  const btnBackFromNoMatch = document.getElementById('btn-back-from-no-match');
  const noMatchTitle = document.getElementById('no-match-title');
  const noMatchDesc = document.getElementById('no-match-desc');
  const loadingText = document.getElementById('loading-text');
  const tabWarning = document.getElementById('tab-warning');

  // Translations
  const TEXTS = {
    en: {
      placeholder: 'Describe your problem…',
      guideBtn: 'Guide me →',
      tryLabel: 'Try:',
      micError: 'Microphone blocked — type instead.',
      editProblem: '← Edit problem',
      startBtn: 'Start Walkthrough',
      resolving: 'Resolving steps...',
      tier1Badge: 'Tier 1 • Verified',
      tier2Badge: 'Tier 2 • Gemini AI',
      noMatchTitle: 'No Offline Match Found',
      noMatchDesc: 'To generate custom AI steps for this task, add a Gemini API key in Settings (⚙️).',
      tryAnother: '← Try another problem',
      keySaved: '✓ Key saved in local storage',
      keyRemoved: 'Key removed'
    },
    hi: {
      placeholder: 'अपनी समस्या बताएं…',
      guideBtn: 'मार्गदर्शन करें →',
      tryLabel: 'कोशिश करें:',
      micError: 'माइक्रोफ़ोन ब्लॉक है — टाइप करें।',
      editProblem: '← समस्या बदलें',
      startBtn: 'वॉकथ्रू शुरू करें',
      resolving: 'स्टेप्स तैयार हो रहे हैं...',
      tier1Badge: 'टियर 1 • सत्यापित',
      tier2Badge: 'टियर 2 • जेमिनी एआई',
      noMatchTitle: 'कोई ऑफ़लाइन मैच नहीं मिला',
      noMatchDesc: 'इस कार्य के लिए कस्टम AI स्टेप्स बनाने के लिए सेटिंग्स (⚙️) में Gemini API की जोड़ें।',
      tryAnother: '← दूसरी समस्या बताएं',
      keySaved: '✓ की सुरक्षित रूप से सहेजी गई',
      keyRemoved: 'की हटा दी गई'
    }
  };

  // 1. Language Preference Management
  function setLanguage(lang) {
    currentLang = lang;
    const t = TEXTS[lang] || TEXTS.en;

    if (lang === 'hi') {
      btnLangHi.classList.add('active');
      btnLangEn.classList.remove('active');
    } else {
      btnLangEn.classList.add('active');
      btnLangHi.classList.remove('active');
    }

    // Update text content
    problemInput.placeholder = t.placeholder;
    guideLabel.textContent = t.guideBtn;
    if (quickLabel) quickLabel.textContent = t.tryLabel;
    if (btnBackToInput) btnBackToInput.textContent = t.editProblem;
    if (startFlowLabel) startFlowLabel.textContent = t.startBtn;
    if (loadingText) loadingText.textContent = t.resolving;
    if (noMatchTitle) noMatchTitle.textContent = t.noMatchTitle;
    if (noMatchDesc) noMatchDesc.textContent = t.noMatchDesc;
    if (btnBackFromNoMatch) btnBackFromNoMatch.textContent = t.tryAnother;

    // Update mic recognition language if active
    if (recognition) {
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    }

    // If steps are currently shown, re-render them with the chosen language
    if (resolvedFlow) {
      renderResolvedSteps(resolvedFlow);
    }

    // Persist language
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ clickguide_lang: lang });
    } else {
      localStorage.setItem('clickguide_lang', lang);
    }
  }

  btnLangEn.addEventListener('click', () => setLanguage('en'));
  btnLangHi.addEventListener('click', () => setLanguage('hi'));

  // Load saved language & API key
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['clickguide_lang', 'gemini_api_key'], (res) => {
      if (res && res.clickguide_lang) {
        setLanguage(res.clickguide_lang);
      } else {
        setLanguage('en');
      }

      if (res && res.gemini_api_key) {
        geminiKeyInput.value = res.gemini_api_key;
        keyStatus.textContent = TEXTS[currentLang].keySaved;
      }
    });
  } else {
    const savedLang = localStorage.getItem('clickguide_lang') || 'en';
    setLanguage(savedLang);
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      geminiKeyInput.value = savedKey;
      keyStatus.textContent = TEXTS[currentLang].keySaved;
    }
  }

  // 2. Settings Panel Controls
  btnToggleSettings.addEventListener('click', () => {
    const isVisible = settingsPanel.style.display !== 'none';
    settingsPanel.style.display = isVisible ? 'none' : 'block';
  });

  btnCloseSettings.addEventListener('click', () => {
    settingsPanel.style.display = 'none';
  });

  btnSaveKey.addEventListener('click', () => {
    const key = geminiKeyInput.value.trim();
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ gemini_api_key: key }, () => {
        keyStatus.textContent = key ? TEXTS[currentLang].keySaved : TEXTS[currentLang].keyRemoved;
        setTimeout(() => {
          settingsPanel.style.display = 'none';
        }, 800);
      });
    } else {
      if (key) localStorage.setItem('gemini_api_key', key);
      else localStorage.removeItem('gemini_api_key');
      keyStatus.textContent = key ? TEXTS[currentLang].keySaved : TEXTS[currentLang].keyRemoved;
      setTimeout(() => {
        settingsPanel.style.display = 'none';
      }, 800);
    }
  });

  if (btnOpenSettingsFromEmpty) {
    btnOpenSettingsFromEmpty.addEventListener('click', () => {
      viewNoMatch.style.display = 'none';
      viewInput.style.display = 'flex';
      settingsPanel.style.display = 'block';
      geminiKeyInput.focus();
    });
  }

  // 3. Web Speech API (webkitSpeechRecognition) Voice Problem Input
  function setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('[ClickGuide] SpeechRecognition is not supported in this browser.');
      return null;
    }

    try {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = true;
      recog.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US';

      recog.onstart = () => {
        isRecording = true;
        btnMic.classList.add('is-recording');
        micError.style.display = 'none';
      };

      recog.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          problemInput.value = transcript;
        }
      };

      recog.onerror = (event) => {
        console.error('[ClickGuide] Speech recognition error:', event.error);
        isRecording = false;
        btnMic.classList.remove('is-recording');
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          micError.textContent = TEXTS[currentLang].micError;
          micError.style.display = 'block';
        }
      };

      recog.onend = () => {
        isRecording = false;
        btnMic.classList.remove('is-recording');
      };

      return recog;
    } catch (e) {
      console.error('[ClickGuide] Failed to initialize SpeechRecognition:', e);
      return null;
    }
  }

  btnMic.addEventListener('click', () => {
    micError.style.display = 'none';
    if (!recognition) {
      recognition = setupSpeechRecognition();
    }

    if (!recognition) {
      micError.textContent = TEXTS[currentLang].micError;
      micError.style.display = 'block';
      return;
    }

    if (isRecording) {
      try {
        recognition.stop();
      } catch {}
      isRecording = false;
      btnMic.classList.remove('is-recording');
    } else {
      try {
        recognition.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US';
        recognition.start();
      } catch (err) {
        console.error('[ClickGuide] Error starting speech recognition:', err);
        micError.textContent = TEXTS[currentLang].micError;
        micError.style.display = 'block';
        isRecording = false;
        btnMic.classList.remove('is-recording');
      }
    }
  });

  // Quick Chips Click Handlers
  document.querySelectorAll('.cg-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const query = chip.dataset.query;
      if (query) {
        problemInput.value = query;
        handleProblemResolution(query);
      }
    });
  });

  // Problem Input Enter Key
  problemInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = problemInput.value.trim();
      if (query) handleProblemResolution(query);
    }
  });

  btnGuideMe.addEventListener('click', () => {
    const query = problemInput.value.trim();
    if (query) handleProblemResolution(query);
    else problemInput.focus();
  });

  // Back Links
  btnBackToInput.addEventListener('click', () => {
    viewSteps.style.display = 'none';
    viewInput.style.display = 'flex';
  });

  btnBackFromNoMatch.addEventListener('click', () => {
    viewNoMatch.style.display = 'none';
    viewInput.style.display = 'flex';
  });

  // 4. Two-Tier Problem Resolution Engine
  async function handleProblemResolution(query) {
    if (!query) return;

    // Show Loading
    viewInput.style.display = 'none';
    viewSteps.style.display = 'none';
    viewNoMatch.style.display = 'none';
    viewLoading.style.display = 'flex';
    tabWarning.style.display = 'none';

    // TIER 1: Offline Keyword Match against flows.js
    const flows = window.CLICKGUIDE_FLOWS || {};
    const matcher = window.ClickGuideMatcher;

    let tier1Match = null;
    if (matcher && typeof matcher.matchQuery === 'function') {
      tier1Match = matcher.matchQuery(query, flows);
    }

    if (tier1Match && tier1Match.matched && tier1Match.flow && tier1Match.flow.steps && tier1Match.flow.steps.length > 0) {
      const flow = tier1Match.flow;
      resolvedFlow = {
        tier: 1,
        id: flow.id,
        title_en: flow.title_en,
        title_hi: flow.title_hi,
        urlMatch: flow.urlMatch,
        targetUrl: flow.targetUrl,
        steps: flow.steps
      };

      viewLoading.style.display = 'none';
      renderResolvedSteps(resolvedFlow);
      return;
    }

    // TIER 2: Gemini AI Custom Flow Generation (Requires API Key)
    let apiKey = null;
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const res = await new Promise((r) => chrome.storage.local.get(['gemini_api_key'], r));
      apiKey = res ? res.gemini_api_key : null;
    } else {
      apiKey = localStorage.getItem('gemini_api_key');
    }

    if (!apiKey) {
      // Constraint: Never call Gemini without a saved key.
      viewLoading.style.display = 'none';
      viewNoMatch.style.display = 'flex';
      return;
    }

    // Fetch page context from active tab
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.id) {
        throw new Error('No active browser tab found.');
      }

      // Extract DOM context from the live page
      const contextResults = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const url = window.location.href;
          const title = document.title;
          const interactiveEls = [];

          const candidates = document.querySelectorAll(
            'button, a, input, select, textarea, [role="button"], [role="link"], [role="tab"], [role="menuitem"], [role="checkbox"], [role="radio"]'
          );

          for (const el of candidates) {
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) continue;
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;

            const text = (el.innerText || el.value || el.placeholder || '').trim().replace(/\s+/g, ' ').slice(0, 60);
            const ariaLabel = (el.getAttribute('aria-label') || '').trim().slice(0, 60);
            const role = el.getAttribute('role') || el.tagName.toLowerCase();
            const tag = el.tagName.toLowerCase();

            if (!text && !ariaLabel) continue;

            interactiveEls.push({ text, ariaLabel, role, tag });
            if (interactiveEls.length >= 75) break; // Truncated to fit context
          }

          return { url, title, interactiveEls };
        }
      });

      const pageContext = (contextResults && contextResults[0] && contextResults[0].result) || {
        url: tab.url || '',
        title: tab.title || '',
        interactiveEls: []
      };

      // Call Gemini 1.5 Flash API with strict JSON schema
      const prompt = `You are ClickGuide AI, an in-page visual walkthrough navigation assistant.
Webpage context:
URL: ${pageContext.url}
Title: ${pageContext.title}

User problem: "${query}"

Visible interactive elements on the page:
${JSON.stringify(pageContext.interactiveEls)}

Create a step-by-step walkthrough to solve the user's problem on this exact page.
Match the targets to the real visible elements provided above.
Return ONLY a valid JSON object matching this schema:
{
  "title_en": "Title in English",
  "title_hi": "Title in Hindi",
  "steps": [
    {
      "action": "click" | "type" | "select",
      "target": {
        "text": "element text or placeholder",
        "ariaLabel": "element aria-label if present",
        "role": "button | link | textbox | etc",
        "tag": "button | a | input | etc"
      },
      "instruction_en": "Clear English instruction for this step",
      "instruction_hi": "इस चरण के लिए स्पष्ट हिन्दी निर्देश"
    }
  ]
}`;

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API error (${response.status}): ${errText}`);
      }

      const resData = await response.json();
      const rawText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Empty response from Gemini API.');

      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanJson);

      if (!parsedData.steps || !Array.isArray(parsedData.steps) || parsedData.steps.length === 0) {
        throw new Error('Gemini could not determine valid steps on this page.');
      }

      resolvedFlow = {
        tier: 2,
        id: 'dynamic-' + Date.now(),
        title_en: parsedData.title_en || query,
        title_hi: parsedData.title_hi || query,
        urlMatch: null, // Dynamic flow runs on current page
        steps: parsedData.steps.map((s, idx) => ({
          id: `step-${idx + 1}`,
          action: s.action || 'click',
          target: s.target,
          title_en: `Step ${idx + 1}`,
          title_hi: `चरण ${idx + 1}`,
          desc_en: s.instruction_en || '',
          desc_hi: s.instruction_hi || s.instruction_en || '',
          actionText: s.action ? (s.action.toUpperCase() + (s.target?.text ? ` '${s.target.text}'` : '')) : 'Click here'
        }))
      };

      viewLoading.style.display = 'none';
      renderResolvedSteps(resolvedFlow);

    } catch (err) {
      console.error('[ClickGuide] Tier 2 generation failed:', err);
      viewLoading.style.display = 'none';
      viewNoMatch.style.display = 'flex';
      noMatchDesc.textContent = 'AI generation failed: ' + err.message;
    }
  }

  // 5. Render Resolved Steps in Popup
  function renderResolvedSteps(flow) {
    if (!flow) return;

    viewInput.style.display = 'none';
    viewLoading.style.display = 'none';
    viewNoMatch.style.display = 'none';
    viewSteps.style.display = 'flex';

    // Tier badge
    if (flow.tier === 1) {
      tierBadge.className = 'cg-tier-badge tier-1';
      tierBadge.textContent = TEXTS[currentLang].tier1Badge;
    } else {
      tierBadge.className = 'cg-tier-badge tier-2';
      tierBadge.textContent = TEXTS[currentLang].tier2Badge;
    }

    // Title
    flowTitle.textContent = currentLang === 'hi' ? (flow.title_hi || flow.title_en) : flow.title_en;

    // Steps list
    stepsContainer.innerHTML = '';
    flow.steps.forEach((step, index) => {
      const card = document.createElement('div');
      card.className = 'cg-step-card';

      const desc = currentLang === 'hi'
        ? (step.desc_hi || step.instruction_hi || step.desc_en)
        : (step.desc_en || step.instruction_en || step.desc_hi);

      const title = currentLang === 'hi'
        ? (step.title_hi || step.title_en)
        : (step.title_en || `Step ${index + 1}`);

      const action = step.action || (step.actionText ? step.actionText.split(' ')[0] : 'CLICK');
      const targetDetail = (step.target && (step.target.text || step.target.ariaLabel)) || '';

      card.innerHTML = `
        <div class="cg-step-num">${index + 1}</div>
        <div class="cg-step-details">
          <div class="cg-step-card-header">
            <span class="cg-step-card-title">${title}</span>
            <span class="cg-step-card-action">${action}</span>
          </div>
          <div class="cg-step-card-desc">${desc}</div>
          ${targetDetail ? `<div style="font-family: monospace; font-size: 10px; color: #71717a; margin-top: 2px;">Target: ${targetDetail}</div>` : ''}
        </div>
      `;

      stepsContainer.appendChild(card);
    });
  }

  // 6. "Start Walkthrough" Button - Inject and play in active tab
  btnStartFlow.addEventListener('click', async () => {
    if (!resolvedFlow) return;

    if (typeof chrome === 'undefined' || !chrome.tabs) {
      alert('ClickGuide extension requires a live browser tab.');
      return;
    }

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.id) {
        tabWarning.style.display = 'block';
        tabWarning.textContent = 'No active tab found.';
        return;
      }

      tabWarning.style.display = 'none';

      const payload = resolvedFlow.tier === 1
        ? { action: 'START_FLOW', flowId: resolvedFlow.id, lang: currentLang }
        : { action: 'START_DYNAMIC_FLOW', flow: resolvedFlow, lang: currentLang };

      // Ensure content scripts and styles are injected
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['flows.js', 'content/content.js']
        });
      } catch {}

      try {
        await chrome.scripting.insertCSS({
          target: { tabId: tab.id },
          files: ['content/overlay.css']
        });
      } catch {}

      // Send start message
      setTimeout(() => {
        chrome.tabs.sendMessage(tab.id, payload, () => {
          window.close();
        });
      }, 100);

    } catch (err) {
      console.error('[ClickGuide] Start flow error:', err);
      tabWarning.style.display = 'block';
      tabWarning.textContent = 'Error: ' + err.message;
    }
  });
});
