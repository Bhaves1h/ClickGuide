import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../lib/utils';

export const SearchChanged: React.FC = () => {
  const platforms = [
    {
      name: 'ChatGPT & LLMs',
      icon: '/icon-chatgpt.png',
      tag: 'Theoretical Text',
      description:
        'Spits out walls of text in a disconnected tab. Tells you git concepts in theory, but leaves you stranded hunting for buttons, branches, and merge options across GitHub’s dense web interface.',
    },
    {
      name: 'Perplexity & Search',
      icon: '/icon-perplexity.png',
      tag: 'Outdated Screenshots',
      description:
        'Cites outdated StackOverflow answers and YouTube videos with obsolete GitHub UIs from 2021. You spend 45 minutes cross-referencing instructions instead of shipping your code.',
    },
    {
      name: 'ClickGuide Visual Web App',
      icon: '/icon-google.png',
      tag: 'In-Browser Virtual Copilot',
      description:
        'A virtual ghost cursor that glides smoothly across the REAL web page. It highlights precisely what to click and narrates each step aloud in natural English or Hindi right inside your browser.',
    },
  ];

  return (
    <section
      id="search-changed"
      className="relative w-full pt-52 md:pt-64 pb-6 md:pb-9 px-6 sm:px-8 md:px-28 bg-background border-t border-border/20 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center">
          <motion.h2
            {...fadeUp(0.1)}
            className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-[-2px] text-foreground mb-6"
          >
            Learning has{' '}
            <span className="font-serif italic font-normal text-white">
              changed.
            </span>{' '}
            Have you?
          </motion.h2>

          <motion.p
            {...fadeUp(0.2)}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-24 leading-relaxed"
          >
            Reading tutorials in another tab is broken. ClickGuide eliminates the tab-switching penalty by coaching all Chrome users directly on top of real websites and GitHub repositories.
          </motion.p>
        </div>

        {/* 3 platform cards (grid md:grid-cols-3 gap-12 md:gap-8 mb-20) */}
        <div className="grid md:grid-cols-3 gap-12 md:gap-8 mb-20">
          {platforms.map((platform, idx) => (
            <motion.div
              key={platform.name}
              {...fadeUp(0.2 + idx * 0.1)}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="liquid-glass rounded-2xl p-8 border border-white/10 flex flex-col items-center text-center group hover:border-white/30 transition-all duration-300"
            >
              {/* Badge */}
              <div className="w-full flex justify-end mb-4">
                <span className="text-[11px] uppercase tracking-wider font-mono text-muted-foreground/80 px-2 py-0.5 rounded border border-white/5 group-hover:border-white/20 transition-colors">
                  {platform.tag}
                </span>
              </div>

              {/* 200x200 Icon Image Centered */}
              <div className="w-[200px] h-[200px] flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 bg-white/[0.02] rounded-full blur-xl group-hover:bg-white/[0.05] transition-colors" />
                <img
                  src={platform.icon}
                  alt={`${platform.name} icon`}
                  width={200}
                  height={200}
                  className="w-[200px] h-[200px] object-contain relative z-10 transition-transform duration-300 group-hover:scale-105 filter brightness-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                />
              </div>

              {/* Platform Name */}
              <h3 className="font-semibold text-lg md:text-xl text-foreground mb-3 tracking-tight">
                {platform.name}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                {platform.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom tagline */}
        <motion.p
          {...fadeUp(0.5)}
          className="text-muted-foreground text-sm text-center tracking-wide font-mono opacity-80"
        >
          &ldquo;If you don&apos;t answer the questions on the page, tab fatigue will.&rdquo;
        </motion.p>
      </div>
    </section>
  );
};
