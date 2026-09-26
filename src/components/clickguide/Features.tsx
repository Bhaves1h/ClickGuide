import React from 'react';
import { motion } from 'framer-motion';
import { Globe2, CheckCircle, Languages, HelpCircle } from 'lucide-react';

export const Features: React.FC = () => {
  const featureList = [
    {
      icon: Globe2,
      title: 'Real websites, no sandbox.',
      description:
        'Operates directly inside your actual browser tab on the live website. You work with your real accounts, projects, and data — gaining authentic muscle memory.',
      tag: 'Live DOM Injection',
    },
    {
      icon: CheckCircle,
      title: 'Verified steps — every click checked, never guessed.',
      description:
        'Every single walkthrough is battle-tested and validated against real site updates. ClickGuide never invents fictional buttons or hallucinates navigation paths.',
      tag: '100% Validated',
    },
    {
      icon: Languages,
      title: 'Hindi + English narration.',
      description:
        'Audio narration and clear subtitles in both English and natural everyday हिन्दी. Technical jargon is translated into easy, intuitive analogies everyone understands.',
      tag: 'Bilingual Voiceover',
    },
    {
      icon: HelpCircle,
      title: 'Honest when stuck — stops and asks if the page changed instead of guessing.',
      description:
        'If a website updates its layout, serves an A/B test, or pops up a new permissions modal, ClickGuide pauses and asks you instead of clicking blindly.',
      tag: 'Fail-Safe Safety',
    },
  ];

  return (
    <section id="features" className="relative py-28 md:py-36 px-6 sm:px-8 border-t border-white/[0.08] bg-[#161b22]/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-mono uppercase tracking-[2px] text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full inline-block mb-4">
            Built for Trust &amp; Clarity
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Engineered for everyone,{' '}
            <span className="text-accent">built without shortcuts.</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            A Chrome extension that respects your screen, speaks your language, and never clicks without your consent.
          </p>
        </div>

        {/* 4 Feature Cards (2x2 Grid) */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {featureList.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                whileHover={{ y: -4 }}
                className="glass-card rounded-2xl p-8 sm:p-9 border border-white/10 hover:border-accent/40 transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-surface border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent/10 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground bg-surface px-3 py-1 rounded-full border border-white/10">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">
                    {feat.title}
                  </h3>

                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>Feature 0{idx + 1}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
