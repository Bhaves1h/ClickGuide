# ClickGuide — Real AI Virtual Cursor (Chrome Extension)

Manifest V3 Chrome extension that injects a real virtual ghost cursor into live browser tabs on real websites without mock simulations or canned canvases.

---

## 🚀 Quick Start: Load Unpacked in Chrome / Edge / Brave

1. Open your browser and navigate to:
   - **Chrome**: `chrome://extensions`
   - **Edge**: `edge://extensions`
   - **Brave**: `brave://extensions`
2. Enable **Developer mode** (toggle in top-right corner).
3. Click **"Load unpacked"** (top-left).
4. Select the `extension/` directory inside this project:
   ```
   C:\Users\ASUS\Desktop\Hackproject\extension
   ```
5. Pin **ClickGuide** to your browser toolbar.

---

## 🎙️ Free-Text + Voice Problem Input

- **Problem Input Box**: Type your request (e.g., `"create a repo"`, `"repository banani hai"`, `"open my first pull request"`, or `"how do I star a repository"`).
- **Web Speech API Mic**: Tap the microphone icon beside the input to speak. The live transcript immediately fills the input. Recognition language automatically matches your language toggle (`en-US` or `hi-IN`). If blocked, displays: *"Microphone blocked — type instead."*
- **Text-Only EN / हिन्दी Toggle**: Switches text across the popup, step list, and live on-page tooltips. Voice narration is **completely removed** — ClickGuide operates in complete silence with zero audio output.

---

## ⚡ Two-Tier Problem Resolution

1. **Tier 1 (Offline, No API Key Required)**:
   - Matches problem queries against verified authored flows (`flows.js`) using keyword scoring.
   - Fully supports English and Hinglish phrases (e.g. `"create a repo"`, `"repository banani hai"` &rarr; GitHub Repository creation flow).
   - Works 100% offline; never sends page content anywhere.
2. **Tier 2 (Gemini AI Dynamic Custom Guides)**:
   - Activated when a Gemini API key is saved in Settings (⚙️), stored locally in `chrome.storage.local`.
   - When Tier 1 finds no match, ClickGuide extracts visible interactive elements from the active tab and queries Gemini with a strict JSON schema:
     ```json
     {
       "action": "click" | "type" | "select",
       "target": { "text": "...", "ariaLabel": "...", "role": "...", "tag": "..." },
       "instruction_en": "...",
       "instruction_hi": "..."
     }
     ```
   - The content script locates the target in the live DOM by text/aria-label/role (case-insensitive, visible elements only) and guides the user.

---

## 🛡️ Honest Fallback & Guardrails

- **Missing Target Honest Fallback**: If a target element is not found on the live DOM, ClickGuide halts immediately, draws NO highlights, and displays:
  > *"I can't find '<target>' on this page — I won't guess."*
- **URL Mismatch Guard**: On the wrong page, halts and toasts:
  > *"Open the right page first — this guide runs on <url>."*
- **Non-Clipping Action Pills**: Smart viewport boundary flipping (`.flip-left`, `.flip-down`).
- **Complete Silence**: 0 audio output; narration is purely visual in tooltips and step lists.

---

## 🧪 Automated Tests

Run the full test suite from the repository root:
```bash
npm.cmd test
```

- **Unit tests**: 24 passed (Keyword match scoring with EN & Hinglish phrasings, graceful fallbacks, advance/retreat logic, silence verification).
- **Integration tests**: 7 passed (Headless Chromium testing Flow A, Flow B, URL mismatch toast, broken selector fallback, Tier 2 target resolution, Tier 2 honest fallback toast, and complete silence with 0 console errors).
