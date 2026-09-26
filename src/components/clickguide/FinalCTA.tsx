import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ChromeIcon } from '../icons/BrandIcons';

interface FinalCTAProps {
  onOpenInstallModal?: () => void;
  onRequestTool?: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenInstallModal, onRequestTool }) => {
  return (
    <section className="relative py-28 md:py-40 px-6 sm:px-8 border-t border-white/[0.08] bg-[#0d1117] overflow-hidden">
      {/* Background radial electric glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-accent/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-white/10 text-xs font-mono text-muted-foreground mb-6">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>No credit card &bull; 100% Free</span>
        </div>

        <h2 className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 text-balance">
          Your next tool is{' '}
          <span className="text-accent underline decoration-accent/30 underline-offset-8">
            5 guided clicks away.
          </span>
        </h2>

        <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          Stop pausing 20-minute video tutorials. Add ClickGuide to your browser today and glide through websites with complete confidence.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenInstallModal}
            className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-[#0d1117] font-semibold text-base px-8 py-4 rounded-xl flex items-center justify-center gap-2.5 shadow-[0_0_35px_rgba(63,185,80,0.4)] transition-all"
          >
            <ChromeIcon className="w-5 h-5 text-[#0d1117]" />
            <span>Add to Chrome &mdash; Free</span>
            <ArrowRight className="w-4 h-4 text-[#0d1117]" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRequestTool}
            className="w-full sm:w-auto glass-card hover:bg-surface-raised text-white font-medium text-base px-7 py-4 rounded-xl border border-white/10 hover:border-white/25 transition-all"
          >
            <span>Vote / Request a Website</span>
          </motion.button>
        </div>

        <div className="mt-8 text-xs font-mono text-muted-foreground">
          Compatible with Chrome, Brave, Arc, Edge, and all Chromium browsers
        </div>
      </div>
    </section>
  );
};
