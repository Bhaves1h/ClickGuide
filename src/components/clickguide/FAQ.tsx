import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Which websites are supported?',
      a: 'Verified walkthroughs are launching for popular tools, starting with GitHub — with Gmail, IRCTC, Notion, Figma, and Google Drive in active rollout. You can vote for or request any website, and we prioritize building verified guides based on community demand.',
    },
    {
      q: 'Is this just a ChatGPT wrapper?',
      a: 'No — it guides you on the page itself, click by click. While AI chatbots give you long walls of theoretical text in a separate tab, ClickGuide lives directly in your browser. Its virtual cursor glides across the real DOM, highlights buttons in electric green, and speaks aloud in English or Hindi.',
    },
    {
      q: 'What if a site redesigns?',
      a: 'It stops and asks instead of guessing. Brittle automations often click the wrong things when layouts change. ClickGuide’s safety protocol validates each selector before moving. If an interface changed or an unexpected modal pops up, ClickGuide gracefully pauses and asks for confirmation.',
    },
    {
      q: 'Is it free?',
      a: 'Yes. ClickGuide is 100% free for individual users, students, and professionals, with all verified walkthroughs included.',
    },
    {
      q: 'Does ClickGuide read my private data or passwords?',
      a: 'Never. ClickGuide operates under Google Chrome Manifest V3 security rules. It only inspects the layout positions of buttons and navigation controls to position the virtual cursor. It never reads passwords, private messages, financial info, or personal credentials.',
    },
  ];

  return (
    <section id="faq" className="relative py-28 md:py-36 px-6 sm:px-8 border-t border-white/[0.08] bg-[#0d1117]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono uppercase tracking-[2px] mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Everything you need to know about ClickGuide and in-browser visual guidance.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 select-none hover:bg-white/[0.02]"
                >
                  <span className="font-heading text-base sm:text-lg font-semibold text-white">
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-accent/15 border-accent text-accent' : 'text-muted-foreground'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-white/[0.04]">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
