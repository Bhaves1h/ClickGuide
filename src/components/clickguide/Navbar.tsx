import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { ChromeIcon } from '../icons/BrandIcons';

interface NavbarProps {
  onOpenInstallModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenInstallModal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'How it works', href: '#how-it-works' },
    { name: 'Demo', href: '#demo' },
    { name: 'Tools', href: '#tools' },
    { name: 'Features', href: '#features' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0d1117]/85 backdrop-blur-md border-b border-white/[0.08] py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand: Wordmark with cursor-arrow mark */}
        <a href="#home" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-lg bg-surface border border-white/10 flex items-center justify-center transition-all group-hover:border-accent/60 group-hover:shadow-[0_0_15px_rgba(63,185,80,0.3)]">
            <svg
              className="w-4 h-4 text-accent transition-transform group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M4 2l16 12-7 1 4 7-3 1-4-7-6 5V2z" />
            </svg>
            {/* Soft pulse glow behind cursor */}
            <span className="absolute -inset-1 rounded-lg bg-accent/20 blur-xs opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-heading font-bold text-xl tracking-tight text-white">
              Click<span className="text-accent">Guide</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-surface-raised px-1.5 py-0.5 rounded border border-white/10">
              Extension
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 glass-card px-4 py-1.5 rounded-full border border-white/10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-white px-3.5 py-1 rounded-full transition-colors hover:bg-white/[0.04]"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* CTA Button: Add to Chrome — Free */}
        <div className="hidden sm:flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenInstallModal}
            className="bg-accent hover:bg-accent-hover text-[#0d1117] font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-[0_0_20px_rgba(63,185,80,0.3)] hover:shadow-[0_0_25px_rgba(63,185,80,0.45)] transition-all"
          >
            <ChromeIcon className="w-4 h-4 text-[#0d1117]" />
            <span>Add to Chrome &mdash; Free</span>
          </motion.button>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-surface border border-white/10 text-white"
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
            className="md:hidden mx-6 mt-3 glass-card rounded-2xl p-5 border border-white/15 bg-[#0d1117]/95"
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-white py-1.5 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-3 border-t border-white/10">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenInstallModal) onOpenInstallModal();
                  }}
                  className="w-full bg-accent hover:bg-accent-hover text-[#0d1117] font-semibold text-sm py-2.5 rounded-lg flex items-center justify-center gap-2"
                >
                  <ChromeIcon className="w-4 h-4 text-[#0d1117]" />
                  <span>Add to Chrome &mdash; Free</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
