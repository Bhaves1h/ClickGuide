import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, UserCheck } from 'lucide-react';

export const AudienceStrip: React.FC = () => {
  const audiences = [
    {
      icon: GraduationCap,
      title: 'Students & Learners',
      subtitle: 'Never feel lost in tech class',
      examples: [
        'Pushing your first coding assignment to GitHub',
        'Organizing shared research drives on Google Cloud',
        'Exporting presentation prototypes in Figma',
      ],
    },
    {
      icon: Briefcase,
      title: 'Working Professionals',
      subtitle: 'Skip the 2-week software onboarding',
      examples: [
        'Configuring Jira sprints, Notion databases & Slack workflows',
        'Setting up Gmail automated filters & customer signatures',
        'Adopting internal corporate portals without IT tickets',
      ],
    },
    {
      icon: UserCheck,
      title: 'First-Time Web Users',
      subtitle: 'Do it yourself with full confidence',
      examples: [
        'Booking train tickets and Tatkal quotas on IRCTC',
        'Navigating government portal applications and utility bills',
        'Managing cloud file backups without fear of deleting anything',
      ],
    },
  ];

  return (
    <section className="relative py-24 md:py-32 px-6 sm:px-8 border-t border-white/[0.08] bg-[#161b22]/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-[2px] text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full inline-block mb-4">
            Built For Everyone
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
            For students, professionals, and anyone{' '}
            <span className="text-accent">opening a new tool for the first time.</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            You shouldn&apos;t need an engineering degree just to navigate modern web interfaces.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {audiences.map((aud, idx) => {
            const Icon = aud.icon;
            return (
              <motion.div
                key={aud.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="glass-card rounded-2xl p-7 sm:p-8 border border-white/10 hover:border-accent/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-surface border border-white/10 flex items-center justify-center text-accent mb-6">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-1">
                    {aud.title}
                  </h3>
                  <p className="text-xs font-mono text-muted-foreground mb-6">
                    {aud.subtitle}
                  </p>

                  <ul className="space-y-3">
                    {aud.examples.map((item, i) => (
                      <li key={i} className="text-xs sm:text-sm text-muted-foreground flex items-start gap-2.5">
                        <span className="text-accent font-bold mt-0.5">•</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-white/[0.06] text-[11px] font-mono text-accent/80">
                  <span>Verified walkthroughs available</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
