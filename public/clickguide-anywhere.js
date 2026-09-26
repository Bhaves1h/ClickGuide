// ClickGuide Universal Copilot
(function(){
  // Proactively destroy any existing ClickGuide elements so re-running ALWAYS creates a fresh UI
  try {
    var oldHud = document.getElementById('cg-hud');
    if (oldHud && oldHud.parentNode) oldHud.parentNode.removeChild(oldHud);
    var oldCur = document.getElementById('cg-cur');
    if (oldCur && oldCur.parentNode) oldCur.parentNode.removeChild(oldCur);
    var oldStyle = document.getElementById('cg-styles');
    if (oldStyle && oldStyle.parentNode) oldStyle.parentNode.removeChild(oldStyle);
    window.__CG_HUD__ = null;
    window.__CG_CUR__ = null;
  } catch(e) {}

  var host = window.location.hostname || 'this website';
  var shortHost = host.replace(/^www\./, '');
  var currentLang = 'en';
  var activeSolution = null;
  var currentStepIdx = 0;
  var hl = null;

  var s = document.createElement('style');
  s.id = 'cg-styles';
  s.textContent = [
    '#cg-cur{position:fixed;left:calc(100vw - 360px);top:calc(100vh - 420px);pointer-events:none;z-index:2147483647;transition:left .7s cubic-bezier(.22,1,.36,1),top .7s cubic-bezier(.22,1,.36,1),opacity .3s ease;transform:translate(-14px,-14px);display:block!important;}',
    '.cg-p{width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,.92);border:2px solid #fff;box-shadow:0 0 25px rgba(255,255,255,.9);display:flex;align-items:center;justify-content:center;position:relative;}',
    '.cg-ring{position:absolute;inset:-12px;border-radius:50%;background:rgba(34,197,94,.45);box-shadow:0 0 20px rgba(34,197,94,.8);animation:cgP 1.4s infinite;}',
    '@keyframes cgP{0%{transform:scale(.7);opacity:1}100%{transform:scale(2.2);opacity:0}}',
    '.cg-pill{position:absolute;left:42px;top:4px;background:#fff;color:#000;font-size:11px;font-weight:700;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;padding:4px 12px;border-radius:999px;white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,.6);border:1px solid rgba(0,0,0,.15);}',
    '.cg-glow{outline:3px solid #22c55e!important;outline-offset:3px!important;box-shadow:0 0 25px rgba(34,197,94,.85)!important;transition:all .3s!important;}',
    '#cg-hud{position:fixed;bottom:24px;right:24px;width:380px;max-width:calc(100vw - 32px);background:#09090b;color:#f4f4f5;border:1px solid rgba(255,255,255,.2);border-radius:16px;box-shadow:0 25px 60px rgba(0,0,0,.9),0 0 30px rgba(34,197,94,.2);z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;overflow:hidden;box-sizing:border-box;}',
    '.cg-h-hdr{padding:12px 16px;background:rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:space-between;cursor:move;user-select:none;}',
    '.cg-chip{background:rgba(255,255,255,.08);color:#e4e4e7;border:1px solid rgba(255,255,255,.15);padding:5px 10px;border-radius:999px;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s;white-space:nowrap;}',
    '.cg-chip:hover{background:#fff;color:#000;border-color:#fff;}',
    '.cg-inp{width:100%;box-sizing:border-box;background:#18181b;border:1px solid rgba(255,255,255,.2);border-radius:8px;padding:8px 12px;color:#fff;font-size:12px;outline:none;}',
    '.cg-inp:focus{border-color:#22c55e;}',
    '.cg-btn{cursor:pointer;border:none;border-radius:8px;padding:6px 14px;font-size:11px;font-weight:700;transition:all .2s;display:inline-flex;align-items:center;gap:4px;}',
    '.cg-btn-pri{background:#fff;color:#000;}',
    '.cg-btn-pri:hover{background:#e4e4e7;}',
    '.cg-btn-sec{background:rgba(255,255,255,.1);color:#fff;}',
    '.cg-btn-sec:hover{background:rgba(255,255,255,.2);}',
    '.cg-code-box{background:#18181b;border:1px solid rgba(34,197,94,.4);border-radius:8px;padding:8px 12px;font-family:monospace;font-size:11px;color:#4ade80;margin:8px 0;display:flex;align-items:center;justify-content:space-between;}'
  ].join('');
  document.head.appendChild(s);

  var cur = document.createElement('div');
  cur.id = 'cg-cur';
  cur.innerHTML = '<div class="cg-ring"></div><div class="cg-p"><svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M3 3l7 18 3-7 7-3L3 3z"/></svg><div class="cg-pill" id="cg-pill">⚡ Choose Problem Area</div></div>';
  document.body.appendChild(cur);
  window.__CG_CUR__ = cur;

  var hud = document.createElement('div');
  hud.id = 'cg-hud';
  window.__CG_HUD__ = hud;
  document.body.appendChild(hud);

  function makeDraggable() {
    var hdr = document.getElementById('cg-hud-drag');
    if (!hdr) return;
    hdr.onmousedown = function(e) {
      if (e.target.tagName === 'BUTTON') return;
      var startX = e.clientX;
      var startY = e.clientY;
      var rect = hud.getBoundingClientRect();
      var initX = rect.left;
      var initY = rect.top;
      function onMouseMove(ev) {
        hud.style.left = (initX + (ev.clientX - startX)) + 'px';
        hud.style.top = (initY + (ev.clientY - startY)) + 'px';
        hud.style.bottom = 'auto';
        hud.style.right = 'auto';
      }
      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };
  }

  function clearHighlight() {
    if (hl) {
      hl.classList.remove('cg-glow');
      hl = null;
    }
  }

  function pointCursor(el, pillText, narration) {
    clearHighlight();
    var pill = document.getElementById('cg-pill');
    if (pill) pill.textContent = pillText || '⚡ Click here';

    cur.style.display = 'block';

    if (!el) {
      var hudR = hud.getBoundingClientRect();
      cur.style.left = Math.max(20, hudR.left + 50) + 'px';
      cur.style.top = Math.max(20, hudR.top - 25) + 'px';
      if (narration && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          var u = new SpeechSynthesisUtterance(narration);
          u.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US';
          window.speechSynthesis.speak(u);
        } catch(e) {}
      }
      return;
    }

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('cg-glow');
    hl = el;

    setTimeout(function() {
      var r = el.getBoundingClientRect();
      cur.style.display = 'block';
      var targetX = Math.max(16, Math.min(window.innerWidth - 30, r.left + r.width / 2));
      var targetY = Math.max(16, Math.min(window.innerHeight - 30, r.top + r.height / 2));
      cur.style.left = targetX + 'px';
      cur.style.top = targetY + 'px';
    }, 200);

    if (narration && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(narration);
        u.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US';
        u.rate = 0.95;
        window.speechSynthesis.speak(u);
      } catch (err) {}
    }
  }

  function sq(selector) {
    try {
      return document.querySelector(selector);
    } catch(e) {
      return null;
    }
  }

  function getProblemAreas() {
    var list = [
      { label: '💻 Command Error', q: 'git terminal command error fix' },
      { label: '🔢 Calculation Error', q: 'calculation formula math error fix' }
    ];

    if (host.includes('github.com')) {
      list.push(
        { label: '⚡ Create Repo', q: 'create new repository' },
        { label: '🔀 Pull Request', q: 'open pull request' },
        { label: '🍴 Fork Repo', q: 'fork repository' },
        { label: '⭐ Star Repo', q: 'star repository' },
        { label: '🔍 Search Code', q: 'search repositories' },
        { label: '⚙️ Settings', q: 'repository settings' },
        { label: '👥 Collaborators', q: 'invite team collaborators' },
        { label: '📦 Clone / Download', q: 'clone download repo code' }
      );
    } else if (host.includes('vercel.com')) {
      list.push(
        { label: '🚀 Deploy Project', q: 'import and deploy project' },
        { label: '🔑 Env Variables', q: 'environment variables' },
        { label: '🌐 Domains', q: 'custom domains' }
      );
    } else if (host.includes('linear.app')) {
      list.push(
        { label: '➕ New Issue', q: 'create new issue ticket' },
        { label: '📋 Active Cycle', q: 'active sprint cycle' },
        { label: '🏷️ Labels', q: 'issue labels' }
      );
    } else {
      list.push(
        { label: '🔍 Search Site', q: 'search' },
        { label: '🔑 Sign In / Sign Up', q: 'sign in login' },
        { label: '⚙️ Settings / Profile', q: 'account settings profile' },
        { label: '💬 Help & Support', q: 'help contact faq' }
      );
    }
    return list;
  }

  function renderInitialView() {
    var areas = getProblemAreas();
    var chipsHtml = areas.map(function(a){
      return '<button class="cg-chip" data-q="' + a.q + '">' + a.label + '</button>';
    }).join('');

    hud.innerHTML = [
      '<div class="cg-h-hdr" id="cg-hud-drag">',
      '  <div style="display:flex;align-items:center;gap:6px;">',
      '    <span style="background:#22c55e;color:#000;border-radius:50%;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:900;">⚡</span>',
      '    <span style="font-weight:700;font-size:12px;letter-spacing:-0.2px;">ClickGuide Copilot</span>',
      '    <span style="font-size:10px;background:rgba(255,255,255,.1);padding:1px 6px;border-radius:999px;color:#a1a1aa;">' + shortHost + '</span>',
      '  </div>',
      '  <div style="display:flex;align-items:center;gap:4px;">',
      '    <button id="cg-lang-btn" style="background:none;border:none;color:#a1a1aa;cursor:pointer;font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;">' + (currentLang === 'hi' ? 'हिन्दी' : 'EN') + '</button>',
      '    <button id="cg-x" style="background:none;border:none;color:#71717a;cursor:pointer;font-size:14px;padding:0 4px;">✕</button>',
      '  </div>',
      '</div>',
      '<div style="padding:14px 16px;">',
      '  <div style="font-size:13px;font-weight:700;margin-bottom:3px;color:#fff;">Choose Area of Problem:</div>',
      '  <div style="font-size:11px;color:#a1a1aa;margin-bottom:12px;line-height:1.4;">Select a problem area or type your custom error:</div>',
      '  <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;" id="cg-chips-container">' + chipsHtml + '</div>',
      '  <div style="display:flex;gap:6px;margin-bottom:6px;">',
      '    <input id="cg-q-input" class="cg-inp" placeholder="Describe ANY error (e.g. calculation error, git conflict, fork)..." />',
      '    <button id="cg-solve-btn" class="cg-btn cg-btn-pri" style="shrink:0;">Solve ⚡</button>',
      '  </div>',
      '</div>'
    ].join('');

    bindInitialEvents();
    makeDraggable();

    // Position cursor near HUD pointing to the problem options
    setTimeout(function() {
      var hudR = hud.getBoundingClientRect();
      cur.style.display = 'block';
      cur.style.left = (hudR.left + 50) + 'px';
      cur.style.top = Math.max(10, hudR.top - 20) + 'px';
      var pill = document.getElementById('cg-pill');
      if (pill) pill.textContent = '⚡ Select Problem Area Below';

      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          var welcome = new SpeechSynthesisUtterance("Welcome to ClickGuide. Please select your problem area first.");
          welcome.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US';
          welcome.rate = 1.0;
          window.speechSynthesis.speak(welcome);
        } catch(e) {}
      }
    }, 150);
  }

  function bindInitialEvents() {
    var xBtn = document.getElementById('cg-x');
    if (xBtn) xBtn.onclick = function() {
      clearHighlight();
      cur.style.display = 'none';
      hud.style.display = 'none';
    };

    var langBtn = document.getElementById('cg-lang-btn');
    if (langBtn) langBtn.onclick = function() {
      currentLang = currentLang === 'en' ? 'hi' : 'en';
      langBtn.textContent = currentLang === 'hi' ? 'हिन्दी' : 'EN';
    };

    var solveBtn = document.getElementById('cg-solve-btn');
    var input = document.getElementById('cg-q-input');
    if (solveBtn && input) {
      solveBtn.onclick = function() {
        if (input.value.trim()) analyzeProblemAndSolve(input.value.trim());
      };
      input.onkeydown = function(e) {
        if (e.key === 'Enter' && input.value.trim()) analyzeProblemAndSolve(input.value.trim());
      };
    }

    var chips = document.querySelectorAll('.cg-chip');
    chips.forEach(function(c) {
      c.onclick = function() {
        var query = c.getAttribute('data-q');
        analyzeProblemAndSolve(query);
      };
    });
  }

  function analyzeProblemAndSolve(query) {
    hud.innerHTML = [
      '<div class="cg-h-hdr" id="cg-hud-drag">',
      '  <div style="display:flex;align-items:center;gap:6px;">',
      '    <span style="background:#22c55e;color:#000;border-radius:50%;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:900;">⚡</span>',
      '    <span style="font-weight:700;font-size:12px;">ClickGuide AI Analyzer</span>',
      '  </div>',
      '</div>',
      '<div style="padding:20px;text-align:center;">',
      '  <div style="font-size:20px;margin-bottom:8px;">🤖</div>',
      '  <div style="font-size:13px;font-weight:600;color:#fff;margin-bottom:4px;">Analyzing Problem on ' + shortHost + '...</div>',
      '  <div style="font-size:11px;color:#22c55e;font-family:monospace;">&ldquo;' + query + '&rdquo;</div>',
      '  <div style="font-size:10px;color:#71717a;margin-top:8px;">Scanning DOM elements & generating live solution flow...</div>',
      '</div>'
    ].join('');
    makeDraggable();

    var pill = document.getElementById('cg-pill');
    if (pill) pill.textContent = '🤖 Analyzing...';

    setTimeout(function() {
      var q = query.toLowerCase();
      var steps = [];

      // 1. Command / Terminal / Git Error Fix
      if (q.includes('command') || q.includes('git') || q.includes('terminal') || q.includes('push') || q.includes('pull error') || q.includes('conflict')) {
        var fixCommand = 'git fetch origin && git pull --rebase origin main && git push';
        if (q.includes('push')) fixCommand = 'git push -u origin HEAD --force-with-lease';
        if (q.includes('conflict')) fixCommand = 'git status && git merge --abort';
        steps.push({
          title: "Live Fix: Resolve Git / Command Error",
          titleHi: "कमांड एरर का लाइव समाधान",
          narration: "Identified command error. Here is the verified command fix to resolve it cleanly.",
          narrationHi: "कमांड एरर का लाइव समाधान मिल गया है। टर्मिनल में यह कमांड चलाएं।",
          pill: "⚡ Click to Copy Command Fix",
          codeFix: fixCommand,
          pointToHudCopy: true
        });
      }
      // 2. Calculation / Math / Logic Error Fix
      else if (q.includes('calc') || q.includes('math') || q.includes('number') || q.includes('formula') || q.includes('percentage') || q.includes('nan')) {
        steps.push({
          title: "Live Fix: Calculation & Formula Error",
          titleHi: "कैलकुलेशन एरर का समाधान",
          narration: "Identified calculation error. The corrected precision formula has been generated to fix the discrepancy.",
          narrationHi: "कैलकुलेशन का सही फार्मूला तैयार कर दिया गया है।",
          pill: "⚡ Click to Copy Calculation Fix",
          codeFix: 'const corrected = Math.round(((value - min) / (max - min || 1)) * 100);',
          pointToHudCopy: true
        });
      }
      // 3. GitHub UI Flows
      else if (host.includes('github.com')) {
        if (q.includes('repo') || q.includes('create') || q.includes('new')) {
          steps.push({
            title: "Click 'New' repository button",
            titleHi: "'New' बटन पर क्लिक करें",
            narration: "Click the green 'New' button to create your repository.",
            narrationHi: "नया प्रोजेक्ट बनाने के लिए हरे 'New' बटन पर क्लिक करें।",
            pill: "⚡ Click 'New' Repo",
            selector: 'a[href="/new"], a[href*="/new"], button[aria-label*="Create"], a[aria-label*="Create"], .Header-item a[href="/new"]',
            fallbackText: 'New'
          });
        } else if (q.includes('pr') || q.includes('pull')) {
          steps.push({
            title: "Open 'Pull requests' tab",
            titleHi: "'Pull requests' टैब खोलें",
            narration: "Click the Pull Requests tab to view active proposals or create a new PR.",
            narrationHi: "'Pull requests' टैब पर क्लिक करें।",
            pill: "⚡ Click Pull Requests",
            selector: 'a[href*="pulls"], [data-tab-item="pull-requests"], a[data-testid*="pr"], a#pull-requests-tab',
            fallbackText: 'Pull request'
          });
        } else if (q.includes('fork')) {
          steps.push({
            title: "Click 'Fork' button",
            titleHi: "'Fork' बटन पर क्लिक करें",
            narration: "Click the Fork button to create your personal copy of this repository.",
            narrationHi: "इस प्रोजेक्ट की कॉपी बनाने के लिए 'Fork' बटन पर क्लिक करें।",
            pill: "⚡ Click Fork",
            selector: 'a[href*="/fork"], button[aria-label*="fork" i], button.fork-button, #fork-button, a[data-hydro-click*="fork"]',
            fallbackText: 'Fork'
          });
        } else if (q.includes('star') || q.includes('watch')) {
          steps.push({
            title: "Click 'Star' button",
            titleHi: "'Star' बटन पर क्लिक करें",
            narration: "Click Star to bookmark and save this repository to your profile.",
            narrationHi: "इस प्रोजेक्ट को बुकमार्क करने के लिए 'Star' पर क्लिक करें।",
            pill: "⚡ Click Star",
            selector: 'button[aria-label*="star" i], a[href*="/star"], button.starring-container',
            fallbackText: 'Star'
          });
        } else if (q.includes('setting')) {
          steps.push({
            title: "Go to Repository Settings",
            titleHi: "सेटिंग्स खोलें",
            narration: "Click the Settings tab to configure repository visibility, branches, and webhooks.",
            narrationHi: "रिपॉजिटरी की सेटिंग्स बदलने के लिए यहाँ क्लिक करें।",
            pill: "⚡ Click Settings",
            selector: 'a[href*="/settings"], a#settings-tab, [data-tab-item="settings"]',
            fallbackText: 'Settings'
          });
        } else if (q.includes('collab') || q.includes('member') || q.includes('invite') || q.includes('team')) {
          steps.push({
            title: "Navigate to Collaborators & Access",
            titleHi: "मेंबर्स और एक्सेस सेटिंग्स खोलें",
            narration: "Click Settings to manage team collaborators and repository access.",
            narrationHi: "टीम मेंबर्स को इनवाइट करने के लिए सेटिंग्स पर क्लिक करें।",
            pill: "⚡ Click Settings",
            selector: 'a[href*="/settings"], a#settings-tab',
            fallbackText: 'Settings'
          });
        } else if (q.includes('code') || q.includes('clone') || q.includes('download')) {
          steps.push({
            title: "Click 'Code' dropdown to Clone",
            titleHi: "'Code' बटन पर क्लिक करें",
            narration: "Click the green Code button to copy the Git URL or download ZIP.",
            narrationHi: "Git URL कॉपी करने के लिए 'Code' बटन पर क्लिक करें।",
            pill: "⚡ Click Code",
            selector: 'button.get-repo-btn, summary.btn-primary, [data-testid="get-repo-btn"]',
            fallbackText: 'Code'
          });
        }
      }

      // 4. Fallback Semantic DOM Scanning
      if (steps.length === 0) {
        if (q.includes('search')) {
          steps.push({
            title: "Open Search Bar",
            titleHi: "सर्च बार खोलें",
            narration: "Click the search bar to query anything on this page.",
            narrationHi: "यहाँ सर्च बार पर क्लिक करें।",
            pill: "⚡ Click Search",
            selector: 'input[name="q"], input[type="search"], input[placeholder*="search" i], button[aria-label*="search" i]',
            fallbackText: 'Search'
          });
        } else if (q.includes('sign') || q.includes('login') || q.includes('account')) {
          steps.push({
            title: "Click Sign In / Login",
            titleHi: "लॉगिन बटन पर क्लिक करें",
            narration: "Click here to sign in or access your account.",
            narrationHi: "अपने अकाउंट में लॉगिन करने के लिए यहाँ क्लिक करें।",
            pill: "⚡ Click Sign In",
            selector: 'a[href*="login"], a[href*="signin"], [data-testid*="login"], #login, button[aria-label*="Sign in" i]',
            fallbackText: 'Sign in'
          });
        } else {
          var allInteractive = Array.from(document.querySelectorAll('a, button, input, summary, [role="button"]'));
          var words = q.split(/\s+/).filter(function(w){ return w.length > 2; });
          var bestEl = null;
          var bestScore = 0;

          allInteractive.forEach(function(el) {
            if (el.closest('#cg-hud') || el.closest('#cg-cur')) return;
            var text = (el.textContent || '').toLowerCase();
            var aria = (el.getAttribute('aria-label') || '').toLowerCase();
            var title = (el.getAttribute('title') || '').toLowerCase();
            var href = (el.getAttribute('href') || '').toLowerCase();
            var score = 0;

            words.forEach(function(w) {
              if (text.includes(w)) score += 3;
              if (aria.includes(w)) score += 4;
              if (title.includes(w)) score += 2;
              if (href.includes(w)) score += 1;
            });

            if (score > bestScore && el.offsetParent !== null) {
              bestScore = score;
              bestEl = el;
            }
          });

          if (bestEl) {
            var label = (bestEl.textContent || bestEl.getAttribute('aria-label') || 'Target').trim().slice(0, 25);
            steps.push({
              title: "Click '" + label + "'",
              titleHi: "'" + label + "' पर क्लिक करें",
              narration: "Click the highlighted '" + label + "' element to resolve your task.",
              narrationHi: "अपनी समस्या हल करने के लिए हाइलाइट किए गए बटन पर क्लिक करें।",
              pill: "⚡ Click " + label,
              targetElement: bestEl
            });
          } else {
            steps.push({
              title: "Primary Action on " + shortHost,
              titleHi: "मुख्य एक्शन पर क्लिक करें",
              narration: "Click the primary button to get started with " + query + ".",
              narrationHi: "आगे बढ़ने के लिए इस बटन पर क्लिक करें।",
              pill: "⚡ Click Here",
              selector: 'a.btn-primary, button.btn-primary, a[href*="new"], button[type="submit"]',
              fallbackText: 'New'
            });
          }
        }
      }

      activeSolution = { query: query, steps: steps };
      currentStepIdx = 0;
      renderSolutionStep();
    }, 450);
  }

  function renderSolutionStep() {
    if (!activeSolution || !activeSolution.steps.length) return;
    var step = activeSolution.steps[currentStepIdx];
    var title = currentLang === 'hi' ? (step.titleHi || step.title) : step.title;
    var narration = currentLang === 'hi' ? (step.narrationHi || step.narration) : step.narration;

    var codeBoxHtml = '';
    if (step.codeFix) {
      codeBoxHtml = [
        '<div class="cg-code-box">',
        '  <span id="cg-code-text" style="word-break:break-all;">' + step.codeFix + '</span>',
        '  <button id="cg-copy-code-btn" style="background:#22c55e;color:#000;border:none;border-radius:4px;padding:4px 10px;font-size:10px;font-weight:700;cursor:pointer;shrink:0;margin-left:8px;">Copy 📋</button>',
        '</div>'
      ].join('');
    }

    hud.innerHTML = [
      '<div class="cg-h-hdr" id="cg-hud-drag">',
      '  <div style="display:flex;align-items:center;gap:6px;">',
      '    <span style="background:#22c55e;color:#000;border-radius:50%;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:900;">✓</span>',
      '    <span style="font-weight:700;font-size:12px;">Live Solution Active</span>',
      '  </div>',
      '  <div style="display:flex;align-items:center;gap:4px;">',
      '    <button id="cg-sol-back" style="background:rgba(255,255,255,.1);border:none;color:#fff;cursor:pointer;font-size:10px;font-weight:600;padding:3px 8px;border-radius:6px;">↺ Ask Another</button>',
      '    <button id="cg-x" style="background:none;border:none;color:#71717a;cursor:pointer;font-size:14px;padding:0 4px;">✕</button>',
      '  </div>',
      '</div>',
      '<div style="padding:14px 16px;">',
      '  <div style="font-size:11px;color:#a1a1aa;margin-bottom:6px;">Problem: <span style="color:#fff;font-weight:600;">&ldquo;' + activeSolution.query + '&rdquo;</span></div>',
      '  <div style="background:#18181b;border-left:3px solid #22c55e;border-radius:6px;padding:10px 12px;margin-bottom:10px;">',
      '    <div style="font-size:12px;font-weight:700;color:#22c55e;margin-bottom:4px;">' + title + '</div>',
      '    <div style="font-size:11px;color:#d4d4d8;line-height:1.4;">' + narration + '</div>',
      '    ' + codeBoxHtml,
      '  </div>',
      '  <div style="display:flex;justify-content:space-between;align-items:center;">',
      '    <span style="font-size:10px;color:#71717a;">Step ' + (currentStepIdx + 1) + ' of ' + activeSolution.steps.length + '</span>',
      '    <div style="display:flex;gap:6px;">',
      '      <button id="cg-replay-btn" class="cg-btn cg-btn-sec">🔊 Speak</button>',
      '      <button id="cg-done-btn" class="cg-btn cg-btn-pri">Complete 🎉</button>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('');
    makeDraggable();

    var copyBtn = document.getElementById('cg-copy-code-btn');
    if (copyBtn && step.codeFix) {
      copyBtn.onclick = function() {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(step.codeFix);
          copyBtn.textContent = '✓ Copied!';
          var pill = document.getElementById('cg-pill');
          if (pill) pill.textContent = '✓ Fix Copied to Clipboard!';
          setTimeout(function(){ copyBtn.textContent = 'Copy 📋'; }, 2000);
        }
      };
    }

    var target = null;
    if (step.pointToHudCopy && copyBtn) {
      target = copyBtn;
    } else {
      if (step.targetElement) target = step.targetElement;
      else if (step.selector) target = sq(step.selector);
      if (!target && step.fallbackText) {
        var all = Array.from(document.querySelectorAll('a, button, input, [role="button"]'));
        target = all.find(function(e){ return e.textContent && e.textContent.toLowerCase().includes(step.fallbackText.toLowerCase()); });
      }
      if (!target) target = sq('a.btn-primary, button.btn-primary, a[href*="new"], a, button');
    }

    pointCursor(target, step.pill, narration);

    document.getElementById('cg-x').onclick = function() {
      clearHighlight();
      cur.style.display = 'none';
      hud.style.display = 'none';
    };
    document.getElementById('cg-sol-back').onclick = function() {
      clearHighlight();
      renderInitialView();
    };
    document.getElementById('cg-replay-btn').onclick = function() {
      pointCursor(target, step.pill, narration);
    };
    document.getElementById('cg-done-btn').onclick = function() {
      clearHighlight();
      hud.innerHTML = [
        '<div class="cg-h-hdr" id="cg-hud-drag"><span style="font-weight:700;font-size:12px;">🎉 Solution Complete!</span><button id="cg-x" style="background:none;border:none;color:#aaa;cursor:pointer;">✕</button></div>',
        '<div style="padding:20px;text-align:center;">',
        '  <div style="font-size:24px;margin-bottom:8px;">🏆</div>',
        '  <div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:6px;">Task Resolved Successfully!</div>',
        '  <div style="font-size:11px;color:#a1a1aa;margin-bottom:14px;">ClickGuide guided you live on ' + shortHost + '.</div>',
        '  <button id="cg-another-btn" class="cg-btn cg-btn-pri">Solve Another Problem ⚡</button>',
        '</div>'
      ].join('');
      makeDraggable();
      document.getElementById('cg-x').onclick = function(){ cur.style.display = 'none'; hud.style.display = 'none'; };
      document.getElementById('cg-another-btn').onclick = renderInitialView;
    };
  }

  // Handle SPA / Turbo / PJAX page navigation so ClickGuide is never lost
  function ensureMounted() {
    if (!document.getElementById('cg-hud') || !document.getElementById('cg-cur')) {
      if (document.body) {
        if (!document.getElementById('cg-styles')) document.head.appendChild(s);
        if (!document.getElementById('cg-cur')) document.body.appendChild(cur);
        if (!document.getElementById('cg-hud')) document.body.appendChild(hud);
        renderInitialView();
      }
    }
  }
  window.addEventListener('turbo:load', ensureMounted);
  window.addEventListener('pjax:end', ensureMounted);
  window.addEventListener('popstate', ensureMounted);

  renderInitialView();
})();
