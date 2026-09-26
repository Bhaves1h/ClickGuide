import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-12 px-8 md:px-28 bg-background border-t border-border/20">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left: © 2026 GitGuide. All rights reserved. in text-muted-foreground text-sm */}
        <div className="flex items-center gap-3">
          <div className="relative w-5 h-5 rounded-full border border-foreground/50 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full border border-foreground/50" />
          </div>
          <p className="text-muted-foreground text-sm">
            &copy; 2026 ClickGuide. All rights reserved.
          </p>
        </div>

        {/* Right: Privacy, Terms, Contact links in text-muted-foreground text-sm hover:text-foreground */}
        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
          <a
            href="#solution"
            className="hover:text-foreground transition-colors duration-200"
          >
            Quests
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition-colors duration-200"
          >
            GitHub
          </a>
          <a
            href="#home"
            className="hover:text-foreground transition-colors duration-200"
          >
            Privacy
          </a>
          <a
            href="#home"
            className="hover:text-foreground transition-colors duration-200"
          >
            Terms
          </a>
          <a
            href="#home"
            className="hover:text-foreground transition-colors duration-200"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};
