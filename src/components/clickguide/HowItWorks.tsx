import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquareText, ShieldCheck, MousePointerClick } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: MessageSquareText,
      title: 'Ask in plain English or Hindi.',
      description:
        'Type or speak what you want to achieve — like "How do I create a new branch?" or "Gmail me email signature kaise lagayein?". ClickGuide understands your intent in colloquial language.',
      badge: 'Natural Language Input',
    },
    {
      num: '02',
      icon: ShieldCheck,
      title: 'AI matches a verified walkthrough for that site.',
      description:
        'ClickGuide detects the exact page you are currently viewing and loads a step-by-step verified action path. Every single click target is verified against the real website layout.',
      badge: 'Zero Guesswork',
    },
    {
      num: '03',
      icon: MousePointerClick,
      title: 'Follow the cursor on the real page, narrated step by step.',
      description:
        'A virtual cursor glides directly across the real website DOM. It highlights precisely where to click with an electric green spotlight, explaining each action in natural audio and text.',
      badge: 'In-DOM Guidance',
    },
  ];

  return (
    <section id="how-it-works" className="relative py-28 md:py-36 px-6 sm:px-8 border-t border-white/[0.08] bg-[#0d1117]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-mono uppercase tracking-[2px] text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full inline-block mb-4">
            How It Works
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
            From confused to finished{' '}
            <span className="text-accent">in 3 simple steps.</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            No long videos to scrub through. ClickGuide acts like a mentor sitting right next to you, pointing at your screen.
          </p>
        </div>

        {/* 3 Numbered Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-accent/0 via-accent/30 to-accent/0 -translate-y-12 pointer-events-none" />

          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="glass-card rounded-2xl p-8 border border-white/10 flex flex-col justify-between relative group hover:border-accent/40 transition-all duration-300 z-10"
              >
                <div>
                  {/* Top Bar with Number & Badge */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-heading text-3xl sm:text-4xl font-bold text-accent tracking-tighter">
                      {s.num}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground bg-surface px-2.5 py-1 rounded-md border border-white/10">
                      {s.badge}
                    </span>
                  </div>

                  {/* Step Icon */}
                  <div className="w-12 h-12 rounded-xl bg-surface-raised border border-white/10 flex items-center justify-center text-white mb-6 group-hover:border-accent/50 group-hover:text-accent transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">
                    {s.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {s.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs font-mono text-accent">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>Step {idx + 1} of 3</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
