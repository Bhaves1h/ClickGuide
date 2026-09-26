import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface ToolsStripProps {
  onRequestTool?: () => void;
}

export const ToolsStrip: React.FC<ToolsStripProps> = ({ onRequestTool }) => {
  const tools = [
    {
      name: 'GitHub',
      category: 'Developer & Student',
      badge: 'Verified',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
        </svg>
      ),
    },
    {
      name: 'Gmail',
      category: 'Productivity',
      badge: 'Verified',
      icon: (
        <span className="font-bold text-xs text-[#ea4335]">M</span>
      ),
    },
    {
      name: 'IRCTC',
      category: 'Travel & Citizen',
      badge: 'Popular',
      icon: (
        <span className="font-bold text-xs text-[#0284c7]">🚆</span>
      ),
    },
    {
      name: 'Google Drive',
      category: 'Cloud Storage',
      badge: 'Verified',
      icon: (
        <span className="font-bold text-xs text-[#fbbc04]">▲</span>
      ),
    },
    {
      name: 'Notion',
      category: 'Workspace',
      badge: 'Popular',
      icon: (
        <span className="font-bold text-xs text-white">N</span>
      ),
    },
    {
      name: 'Figma',
      category: 'Design',
      badge: 'Verified',
      icon: (
        <span className="font-bold text-xs text-[#a259ff]">❖</span>
      ),
    },
  ];

  return (
    <section id="tools" className="relative py-16 md:py-24 border-y border-white/[0.08] bg-[#161b22]/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center mb-8">
        <h3 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
          Works where you work:
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
          Launching with verified walkthroughs for the most-requested tools &mdash; vote for yours and we build it next.
        </p>
      </div>

      {/* Infinite Marquee of Tool Chips */}
      <div className="marquee-container w-full overflow-hidden flex relative select-none">
        {/* Soft edge blur fades */}
        <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[#0d1117] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[#0d1117] to-transparent z-10 pointer-events-none" />

        <div className="flex shrink-0 items-center gap-4 animate-marquee py-2">
          {/* Double list for smooth seamless loop */}
          {[...tools, ...tools].map((tool, idx) => (
            <motion.div
              key={`${tool.name}-${idx}`}
              whileHover={{ y: -3, scale: 1.03 }}
              className="glass-card rounded-xl px-4 sm:px-5 py-3 flex items-center gap-3 shrink-0 cursor-default border border-white/10 hover:border-accent/40 hover:shadow-[0_0_20px_rgba(63,185,80,0.15)] transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center border border-white/10">
                {tool.icon}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-white">{tool.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-muted-foreground">
                    {tool.badge}
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground block">{tool.category}</span>
              </div>
            </motion.div>
          ))}

          {/* "+ Request yours →" Chip */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={onRequestTool}
            className="rounded-xl px-5 py-3 flex items-center gap-2.5 shrink-0 bg-accent/10 border border-accent/40 text-accent font-semibold text-xs sm:text-sm hover:bg-accent hover:text-[#0d1117] transition-all shadow-[0_0_20px_rgba(63,185,80,0.2)]"
          >
            <Plus className="w-4 h-4" />
            <span>+ Request yours &rarr;</span>
          </motion.button>
        </div>
      </div>
    </section>
  );
};
