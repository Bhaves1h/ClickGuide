import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { GithubIcon, TwitterIcon, LinkedinIcon } from './icons/BrandIcons';

interface NavbarProps {
  onOpenInstallModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenInstallModal: _onOpenInstallModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'How It Works', href: '#search-changed' },
    { name: 'Philosophy', href: '#mission' },
    { name: 'Use Cases', href: '#solution' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 px-6 sm:px-8 md:px-28 py-4 transition-all duration-300 ${scrolled ? 'backdrop-blur-md bg-black/50 border-b border-white/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo (concentric circles icon + GitGuide bold text) */}
        <a href="#home" className="flex items-center gap-3 group">
          <div className="relative w-7 h-7 rounded-full border-2 border-foreground/60 flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-3 h-3 rounded-full border border-foreground/60 group-hover:bg-foreground/20 transition-colors" />
          </div>
          <span className="font-bold text-lg md:text-xl tracking-tight text-foreground flex items-center gap-1.5">
            ClickGuide
            <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded border border-white/20 text-muted-foreground font-mono font-normal hidden sm:inline-block">
              Web App
            </span>
          </span>
        </a>

        {/* Center-left: Nav links separated by • dots */}
        <nav className="hidden lg:flex items-center space-x-3 text-sm font-medium">
          {navLinks.map((link, index) => (
            <React.Fragment key={link.name}>
              <a
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.name}
              </a>
              {index < navLinks.length - 1 && (
                <span className="text-muted-foreground/40 text-xs select-none">•</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Right: 3 social/extension icons in liquid-glass circular buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Repository"
            className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:scale-105 transition-all duration-200"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:scale-105 transition-all duration-200"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter"
            className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:scale-105 transition-all duration-200"
          >
            <TwitterIcon className="w-4 h-4" />
          </a>

          <a
            href="/#/mission"
            target="_blank"
            rel="noopener"
            className="ml-2 liquid-glass px-4 py-2 rounded-full text-xs font-semibold tracking-wide text-foreground flex items-center gap-1.5 hover:border-white/40 transition-colors"
          >
            <span>Launch Web App</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </a>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-foreground"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drop-down */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden mt-4 liquid-glass rounded-2xl p-6 bg-black/95 border border-white/10"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base text-muted-foreground hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <a href="https://github.com" className="text-muted-foreground hover:text-white"><GithubIcon className="w-5 h-5" /></a>
                  <a href="https://linkedin.com" className="text-muted-foreground hover:text-white"><LinkedinIcon className="w-5 h-5" /></a>
                  <a href="https://twitter.com" className="text-muted-foreground hover:text-white"><TwitterIcon className="w-5 h-5" /></a>
                </div>
                <a
                  href="/#/mission"
                  target="_blank"
                  rel="noopener"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-white text-black font-semibold text-xs px-4 py-2 rounded-full inline-block"
                >
                  Launch Web App
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
