import React from 'react';
import { motion } from 'framer-motion';
import { EyeOff, Layers, AlertTriangle } from 'lucide-react';

export const Problem: React.FC = () => {
  const problems = [
    {
      icon: EyeOff,
      title: "Tutorials tell, they don't show.",
      description:
        "Text articles and blogs explain abstract concepts in jargon, leaving you squinting at complex menus and wondering where the actual button is hiding.",
      callout: "Words can't point at buttons.",
    },
    {
      icon: Layers,
      title: "Tab-switching kills your flow.",
      description:
        "Switching back and forth between a 20-minute YouTube video or AI chat and your actual workspace breaks your mental momentum and wastes hours.",
      callout: "Context-switching tax.",
    },
    {
      icon: AlertTriangle,
      title: "One wrong click and beginners panic.",
      description:
        "Modern web software is dense and intimidating. The fear of deleting files, clicking the wrong branch, or making a permanent mistake causes users to give up.",
      callout: "Fear of the unknown.",
    },
  ];

  return (
    <section className="relative py-28 md:py-36 px-6 sm:px-8 bg-grid">
      <div className="max-w-6xl mx-auto">
        {/* Section Pill & Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-mono uppercase tracking-[2px] text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full inline-block mb-4">
            The Learning Curve Problem
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
            The web is full of great tools.{' '}
            <span className="text-muted-foreground font-normal">Learning them is still painful.</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Whether you are opening GitHub for your first class, setting up Notion for your team, or booking a train on IRCTC &mdash; traditional guides fail you.
          </p>
        </div>

        {/* 3 Problem Cards */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {problems.map((prob, idx) => {
            const Icon = prob.icon;
            return (
              <motion.div
                key={prob.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -6 }}
                className="glass-card rounded-2xl p-7 sm:p-8 flex flex-col justify-between border border-white/10 hover:border-white/20 transition-all duration-300 relative group overflow-hidden"
              >
                {/* Subtle card glow on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors pointer-events-none" />

                <div>
                  <div className="w-12 h-12 rounded-xl bg-surface border border-white/10 flex items-center justify-center text-white mb-6 group-hover:border-accent/40 group-hover:text-accent transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">
                    {prob.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {prob.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <span>{prob.callout}</span>
                  <span className="text-accent/60">0{idx + 1}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
