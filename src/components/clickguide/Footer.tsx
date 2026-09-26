import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-12 px-6 sm:px-8 border-t border-white/[0.08] bg-[#090d12]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left: ClickGuide Logo & Copyright */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-surface border border-white/10 flex items-center justify-center">
            <svg
              className="w-3.5 h-3.5 text-accent"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M4 2l16 12-7 1 4 7-3 1-4-7-6 5V2z" />
            </svg>
          </div>
          <span className="font-heading font-bold text-base text-white">
            Click<span className="text-accent">Guide</span>
          </span>
          <span className="text-xs text-muted-foreground ml-2">
            &copy; 2026 ClickGuide. Stop reading tutorials. Start clicking.
          </span>
        </div>

        {/* Right: Clean links */}
        <div className="flex items-center gap-6 text-xs text-muted-foreground font-medium">
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#demo" className="hover:text-white transition-colors">Interactive Demo</a>
          <a href="#tools" className="hover:text-white transition-colors">Supported Tools</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
};
