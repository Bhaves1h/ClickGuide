import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';
import { ChromeIcon } from '../icons/BrandIcons';
import confetti from 'canvas-confetti';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    // Trigger download of extension zip
    const link = document.createElement('a');
    link.href = '/clickguide-extension.zip';
    link.download = 'clickguide-extension.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#3fb950', '#2ea043', '#ffffff'],
      });
    } catch {}
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg bg-[#161b22] border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 text-white overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                <ChromeIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold tracking-tight">
                  Get ClickGuide for Chrome
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  Manifest V3 &bull; Verified Walkthroughs &bull; Free &amp; Private
                </p>
              </div>
            </div>

            {!downloaded ? (
              <div className="space-y-6">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  ClickGuide installs as a lightweight browser assistant. Whenever you are on a supported website, summon it to guide you step-by-step.
                </p>

                <div className="space-y-3 bg-[#0d1117] rounded-xl p-4 border border-white/10 text-xs">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    <span>30-Second Quick Setup:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-muted-foreground">
                    <li>Download the extension package below and unzip it</li>
                    <li>Open <code className="text-accent font-mono">chrome://extensions</code> &amp; toggle Developer mode</li>
                    <li>Click <strong>Load unpacked</strong> and select the unzipped folder</li>
                  </ol>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleDownload}
                    className="w-full sm:flex-1 bg-accent hover:bg-accent-hover text-[#0d1117] font-semibold py-3 px-5 rounded-lg text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(63,185,80,0.35)] transition-all"
                  >
                    <Download className="w-4 h-4 text-[#0d1117]" />
                    <span>Download Extension (.zip)</span>
                  </button>

                  <a
                    href="https://chrome.google.com/webstore"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-4 py-3 rounded-lg border border-white/15 text-xs text-muted-foreground hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Web Store Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center space-y-4">
                <div className="w-12 h-12 rounded-full border border-accent/40 bg-accent/10 text-accent mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-heading text-lg font-bold text-white">
                  Package Downloaded!
                </h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Extract the zip, head to <code className="text-white font-mono">chrome://extensions</code>, and click <strong>Load unpacked</strong>. Open any page on GitHub or Gmail and enjoy visual guidance!
                </p>

                <div className="pt-2 flex items-center justify-center gap-3">
                  <a
                    href="https://github.com/new"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-accent text-[#0d1117] text-xs font-semibold px-5 py-2.5 rounded-lg flex items-center gap-1.5"
                  >
                    <span>Test on GitHub.com</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#0d1117]" />
                  </a>
                  <button
                    onClick={onClose}
                    className="text-xs font-medium text-white px-4 py-2.5 rounded-lg border border-white/15 hover:bg-white/5"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
