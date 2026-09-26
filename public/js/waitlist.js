// js/waitlist.js
// Waitlist form handler with Firebase Firestore backend
(function () {
  'use strict';

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  function sanitizeDocId(email) {
    return email.toLowerCase().trim().replace(/[\/\s]/g, '_');
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src="' + src + '"]')) {
        return resolve();
      }
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = function () {
        reject(new Error('Failed to load script: ' + src));
      };
      document.head.appendChild(s);
    });
  }

  async function loadConfig() {
    if (window.firebaseConfig && window.firebaseConfig.projectId !== 'YOUR_PROJECT_ID') {
      return window.firebaseConfig;
    }
    const paths = ['firebase-config.js', 'js/firebase-config.js', '/firebase-config.js', '/js/firebase-config.js'];
    for (let i = 0; i < paths.length; i++) {
      try {
        await loadScript(paths[i]);
        if (window.firebaseConfig) {
          break;
        }
      } catch (e) {
        // try next
      }
    }
    return window.firebaseConfig;
  }

  let firestoreHandler = null;

  async function getFirestoreWriter(config) {
    if (firestoreHandler) return firestoreHandler;

    if (!config || !config.projectId || config.projectId === 'YOUR_PROJECT_ID') {
      throw new Error('Firebase configuration missing. Please update firebase-config.js with your project credentials.');
    }

    try {
      const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js');
      const { getFirestore, doc, setDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js');

      const apps = getApps();
      const app = apps.length > 0 ? apps[0] : initializeApp(config);
      const db = getFirestore(app);

      firestoreHandler = async function (sanitizedId, payload) {
        const docRef = doc(db, 'waitlist', sanitizedId);
        await setDoc(docRef, {
          ...payload,
          createdAt: serverTimestamp(),
        });
      };
      return firestoreHandler;
    } catch (modularErr) {
      console.warn('Could not load modular Firebase SDK, falling back to compat SDK...', modularErr);
    }

    try {
      await loadScript('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
      await loadScript('https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore-compat.js');

      if (!window.firebase.apps.length) {
        window.firebase.initializeApp(config);
      }
      const db = window.firebase.firestore();

      firestoreHandler = async function (sanitizedId, payload) {
        await db.collection('waitlist').doc(sanitizedId).set({
          ...payload,
          createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
        });
      };
      return firestoreHandler;
    } catch (compatErr) {
      console.error('Failed to load Firebase compat SDK:', compatErr);
      throw new Error('Network error: Unable to load Firebase database client. Please check your connection.');
    }
  }

  function showInlineMessage(form, message, isError) {
    let msgEl = form.parentElement.querySelector('.waitlist-inline-message');
    if (!msgEl) {
      msgEl = document.createElement('div');
      msgEl.className = 'waitlist-inline-message text-xs font-mono text-center mt-2.5';
      form.insertAdjacentElement('afterend', msgEl);
    }

    if (isError) {
      msgEl.className = 'waitlist-inline-message text-xs text-muted-foreground font-mono text-center mt-2.5';
      msgEl.textContent = '⚠ ' + message;
      msgEl.style.opacity = '1';
    } else {
      msgEl.className = 'waitlist-inline-message text-sm text-foreground font-medium text-center mt-3';
      msgEl.textContent = '✓ ' + message;
      msgEl.style.opacity = '1';
    }
  }

  function clearInlineMessage(form) {
    const msgEl = form.parentElement.querySelector('.waitlist-inline-message');
    if (msgEl) {
      msgEl.textContent = '';
      msgEl.style.opacity = '0';
    }
  }

  async function handleWaitlistSubmit(event) {
    const form = event.target;
    if (!form || (form.id !== 'waitlist-form' && !form.matches('#waitlist-form, [data-waitlist-form]'))) {
      return;
    }

    event.preventDefault();

    const emailInput = form.querySelector('input[type="email"]') || form.querySelector('input[name="email"]');
    const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button');

    if (!emailInput) {
      console.error('Waitlist email input not found.');
      return;
    }

    const rawEmail = emailInput.value.trim();

    clearInlineMessage(form);

    if (!rawEmail || !EMAIL_REGEX.test(rawEmail)) {
      showInlineMessage(form, 'Please enter a valid email address.', true);
      emailInput.focus();
      return;
    }

    const originalButtonContent = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = 'Joining...';
    }

    try {
      const sanitizedEmail = sanitizeDocId(rawEmail);

      const payload = {
        email: rawEmail.toLowerCase().trim(),
        source: 'landing',
      };

      const nameInput = form.querySelector('input[name="name"]');
      if (nameInput && nameInput.value.trim()) {
        payload.name = nameInput.value.trim();
      }

      const userTypeSelect = form.querySelector('[name="userType"]');
      if (userTypeSelect && userTypeSelect.value) {
        const val = userTypeSelect.value.trim();
        if (['student', 'bootcamp', 'other'].includes(val)) {
          payload.userType = val;
        }
      }

      // 1. Send to backend API
      try {
        const apiRes = await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (apiRes.ok) {
          console.log('Successfully saved to /api/waitlist');
        }
      } catch (apiErr) {
        console.warn('Backend API submission note:', apiErr);
      }

      // 2. Also sync to Firebase if real credentials exist
      try {
        const config = await loadConfig();
        if (config && config.projectId && config.projectId !== 'YOUR_PROJECT_ID') {
          const writeDoc = await getFirestoreWriter(config);
          await writeDoc(sanitizedEmail, payload);
        }
      } catch (fbErr) {
        console.warn('Firebase sync note:', fbErr);
      }

      // 3. Client-side persistence fallback
      try {
        const localList = JSON.parse(localStorage.getItem('clickguide_waitlist') || '[]');
        localList.push({ ...payload, timestamp: new Date().toISOString() });
        localStorage.setItem('clickguide_waitlist', JSON.stringify(localList));
      } catch (storageErr) {
        // ignore
      }

      showInlineMessage(form, "✓ You're on the list! Opening ClickGuide Live Solution...", false);
      window.dispatchEvent(new CustomEvent('clickguide:open-live-solution', { detail: { email: rawEmail } }));

      emailInput.value = '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Joined!';
      }
    } catch (err) {
      console.error('Waitlist submission failed:', err);
      const errorMessage = (err && err.message) ? err.message : 'Unable to join waitlist. Please try again.';
      showInlineMessage(form, errorMessage, true);

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalButtonContent;
      }
    }
  }

  function initWaitlist() {
    document.removeEventListener('submit', handleWaitlistSubmit);
    document.addEventListener('submit', handleWaitlistSubmit);

    const form = document.getElementById('waitlist-form');
    if (form) {
      form.removeEventListener('submit', handleWaitlistSubmit);
      form.addEventListener('submit', handleWaitlistSubmit);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWaitlist);
  } else {
    initWaitlist();
  }

  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(function () {
      const form = document.getElementById('waitlist-form');
      if (form && !form.dataset.waitlistBound) {
        form.dataset.waitlistBound = 'true';
        form.addEventListener('submit', handleWaitlistSubmit);
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
