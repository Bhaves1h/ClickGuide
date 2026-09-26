# ClickGuide

> **ChatGPT explains GitHub. ClickGuide walks you through it.**

ClickGuide is an AI-powered visual assistant and Chrome extension that guides users directly on real websites inside real tabs. Instead of relying on mock browsers or canned simulations, ClickGuide injects a ghost cursor overlay onto the live webpage that glides across elements, highlights exact targets with pulsing rings, and shows concise, step-by-step guidance in English and Hindi.

---

## 🌟 Features

- **Real DOM Ghost Cursor**: Injects directly into real web pages (e.g. `github.com/new`, Pull Requests, etc.) with smooth cubic-bezier transitions.
- **Resilient Modern Selectors**: Multi-fallback selector resolution with visible-text label matchers designed for modern Primer/React layouts.
- **Two-Tier Intent Resolution**:
  - **Tier 1 (Offline & Free)**: Intelligent keyword matching for common flows (e.g., repository creation, pull requests) supporting English and Hinglish phrases.
  - **Tier 2 (AI-Powered)**: Gemini 2.0 Flash fallback for dynamic queries with structured JSON element targeting.
- **Honest Fallback System**: If a page redesigns or an element is missing, ClickGuide halts cleanly and provides an honest explanation modal rather than breaking or clicking blind.
- **Bilingual Support**: Instant toggle between English and हिन्दी.
- **Zero-Audio Experience**: Completely silent, purely visual walkthroughs without noisy text-to-speech interruptions.
- **Built-in Web App & Extension Downloader**: Landing page includes a 2-minute install modal with a direct 1-click download of `clickguide-extension.zip`.

---

## 📂 Project Structure

```
├── extension/             # Manifest V3 Chrome Extension
│   ├── manifest.json      # Extension configuration and permissions
│   ├── flows.js           # Multi-step flow definitions and fallback selectors
│   ├── popup/             # Extension popup UI (free-text + Web Speech voice input)
│   ├── content/           # Ghost cursor, highlight ring, and step player
│   └── background/        # Service worker for script injection
├── src/                   # React + TypeScript + Vite web application
│   ├── components/        # Landing page and UI components
│   ├── views/             # Views including Mission Command Center (/mission)
│   └── App.tsx            # Main application router
├── public/                # Static assets & packaged clickguide-extension.zip
├── tests/                 # Automated test suite (unit and headless browser tests)
└── scripts/               # Automation, asset generation, and verification scripts
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ or v20+ recommended)
- Google Chrome or Chromium-based browser (Edge, Brave)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Run Automated Tests
```bash
npm test
```
Runs 24 unit tests and 9 headless browser integration tests covering flow injection, resilient selectors, quiet audio assertion, and CTA modal behavior.

### 4. Build for Production
```bash
npm run build
```
Creates an optimized production bundle in the `dist/` directory.

---

## 🧩 Installing the Chrome Extension

1. Open Chrome and navigate to `chrome://extensions/`.
2. Toggle **Developer mode** on in the top-right corner.
3. Click **Load unpacked**.
4. Select the `extension/` directory inside this repository (or extract `clickguide-extension.zip`).
5. Pin ClickGuide to your toolbar and open [https://github.com/new](https://github.com/new) to test the walkthrough!

---

## 🌐 Deploying on Render (Static Site)

To host ClickGuide on [Render](https://render.com/):

1. **Create a New Web Service**:
   - Go to the Render Dashboard → **New +** → **Static Site**.
   - Connect your GitHub repository (`Bhaves1h/testrepo`).
2. **Configure Build & Deploy Settings**:
   - **Name**: `clickguide` (or your preferred name)
   - **Branch**: `main`
   - **Root Directory**: `.` (leave blank or specify root)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
3. **Configure SPA Rewrite Rule**:
   - Navigate to the **Redirects/Rewrites** tab in Render.
   - Add a rewrite rule:
     - **Source**: `/*`
     - **Destination**: `/index.html`
     - **Action**: `Rewrite`
4. Click **Create Static Site**. Render will build and deploy your app with global CDN caching and SSL enabled.
