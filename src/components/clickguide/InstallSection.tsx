import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FolderCheck, ToggleRight, CheckCircle2, Copy, ExternalLink, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const InstallSection: React.FC = () => {
  const [downloaded, setDownloaded] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleDownload = () => {
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
        origin: { y: 0.7 },
        colors: ['#3fb950', '#ffffff', '#2ea043']
      });
    } catch (e) {}
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText('chrome://extensions');
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <section id="install" className="py-20 md:py-28 px-6 sm:px-8 border-t border-white/5 bg-[#0d1117] relative">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-medium uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Developer Mode Install</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Install in <span className="text-accent">30 seconds</span>.
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Get the full ClickGuide extension running locally on Chrome in 4 quick steps &mdash; zero setup, zero API keys required.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Step 1 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 rounded-2xl bg-surface border border-white/10 hover:border-accent/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 text-accent font-bold font-mono text-sm flex items-center justify-center mb-5">
                01
              </div>
              <h3 className="text-white font-semibold text-base mb-2">Download Zip</h3>
              <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                Download the lightweight <code className="text-white font-mono">clickguide-extension.zip</code> and extract it anywhere on your machine.
              </p>
            </div>
            <button
              onClick={handleDownload}
              className="w-full bg-accent text-[#0d1117] font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 hover:bg-accent-hover transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloaded ? 'Downloaded ✓' : 'Download Zip'}</span>
            </button>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 rounded-2xl bg-surface border border-white/10 hover:border-accent/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/15 text-white/90 font-bold font-mono text-sm flex items-center justify-center mb-5">
                02
              </div>
              <h3 className="text-white font-semibold text-base mb-2">Open Extensions</h3>
              <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                Open a new tab in Chrome and navigate to <code className="text-white font-mono">chrome://extensions</code>.
              </p>
            </div>
            <button
              onClick={handleCopyUrl}
              className="w-full bg-[#21262d] border border-white/15 text-white font-medium text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 hover:bg-[#30363d] transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-accent" />
              <span>{copiedUrl ? 'Copied to Clipboard!' : 'Copy URL'}</span>
            </button>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 rounded-2xl bg-surface border border-white/10 hover:border-accent/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/15 text-white/90 font-bold font-mono text-sm flex items-center justify-center mb-5">
                03
              </div>
              <h3 className="text-white font-semibold text-base mb-2">Enable Dev Mode</h3>
              <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                Turn on the <strong className="text-white">Developer mode</strong> toggle located at the top-right corner of the Extensions page.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0d1117] border border-white/10 flex items-center justify-between text-xs text-muted-foreground">
              <span>Developer mode</span>
              <ToggleRight className="w-5 h-5 text-accent" />
            </div>
          </motion.div>

          {/* Step 4 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 rounded-2xl bg-surface border border-white/10 hover:border-accent/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 text-accent font-bold font-mono text-sm flex items-center justify-center mb-5">
                04
              </div>
              <h3 className="text-white font-semibold text-base mb-2">Load Unpacked</h3>
              <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                Click <strong className="text-white">Load unpacked</strong> button on the top-left and select the extracted folder.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0d1117] border border-white/10 flex items-center gap-2 text-xs text-accent">
              <FolderCheck className="w-4 h-4" />
              <span className="font-semibold">Ready to Use!</span>
            </div>
          </motion.div>
        </div>

        {/* Verification banner */}
        <div className="p-4 sm:p-6 rounded-2xl bg-surface border border-accent/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-medium text-sm">Verified on Manifest V3</div>
              <div className="text-muted-foreground text-xs">
                Supports Chrome, Edge, Brave, and Arc browsers.
              </div>
            </div>
          </div>
          <a
            href="https://github.com/new"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
          >
            <span>Test live on github.com/new</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
