import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Copy, Check, Sparkles, FolderArchive } from 'lucide-react';

interface ExtensionInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExtensionInstallModal: React.FC<ExtensionInstallModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText('chrome://extensions');
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback if clipboard API is restricted
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop with click-outside to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            id="extension-install-modal"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-zinc-950 border border-white/15 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_40px_rgba(34,197,94,0.12)] overflow-hidden z-10 my-auto text-left"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-black/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center bg-white/5">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                    Install ClickGuide in 2 minutes
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Step-by-step installation for Chrome, Edge, and Brave browsers
                  </p>
                </div>
              </div>

              {/* Close (X) Button */}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close modal (Esc)"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: 6 Numbered Steps */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Step 1: Download .zip */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-colors">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/30">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white mb-1">
                    Download the extension
                  </h4>
                  <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
                    Download the official ClickGuide Chrome extension package archive (.zip).
                  </p>
                  <a
                    href="/clickguide-extension.zip"
                    download="clickguide-extension.zip"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download ClickGuide (.zip)</span>
                  </a>
                </div>
              </div>

              {/* Step 2: Unzip */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-white/10">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                    <span>Unzip the downloaded file to a folder</span>
                    <FolderArchive className="w-3.5 h-3.5 text-zinc-400" />
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Right-click the downloaded <code className="text-zinc-200 bg-white/10 px-1.5 py-0.5 rounded text-[11px]">clickguide-extension.zip</code> and select <strong className="text-zinc-200">"Extract All..."</strong> (or extract using your preferred archive utility).
                  </p>
                </div>
              </div>

              {/* Step 3: Chrome Extensions URL */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-white/10">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white mb-1">
                    Open Extensions in your browser
                  </h4>
                  <p className="text-xs text-zinc-400 mb-2 leading-relaxed">
                    In Chrome or Edge's address bar, type <code className="text-emerald-300 bg-emerald-950/40 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[11px] font-mono">chrome://extensions</code> and press Enter.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyUrl}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 text-zinc-200 text-xs font-mono transition-colors cursor-pointer border border-white/10"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied to clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy address (chrome://extensions)</span>
                        </>
                      )}
                    </button>
                    <span className="text-[11px] text-zinc-500 italic">
                      (Web pages cannot link directly to chrome:// URLs for security)
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 4: Developer Mode */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-white/10">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white mb-1">
                    Turn on "Developer mode"
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Look for the <strong className="text-zinc-200">"Developer mode"</strong> toggle in the top-right corner of the Extensions page and turn it on.
                  </p>
                </div>
              </div>

              {/* Step 5: Load Unpacked */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-white/10">
                  5
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white mb-1">
                    Click "Load unpacked"
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Click the <strong className="text-zinc-200">"Load unpacked"</strong> button in the top-left, then navigate to and select the folder you extracted in Step 2.
                  </p>
                </div>
              </div>

              {/* Step 6: Pin & Start */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 bg-gradient-to-r from-emerald-950/20 to-transparent">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/30">
                  6
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white mb-1 flex items-center gap-1.5">
                    <span>Pin ClickGuide & Describe your problem</span>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Pin ClickGuide to your Chrome toolbar, click its icon on any live page (e.g., <code className="text-zinc-300">github.com/new</code>), type or speak your problem, and watch the virtual cursor guide you.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/10 bg-black/60 flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-mono">
                Manifest V3 &bull; Real browser DOM injection &bull; 100% Client-Side
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
