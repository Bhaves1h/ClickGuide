import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RequestToolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestToolModal: React.FC<RequestToolModalProps> = ({ isOpen, onClose }) => {
  const [toolName, setToolName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<'student' | 'bootcamp' | 'other'>('student');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName.trim()) return;

    setSubmitted(true);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#3fb950', '#2ea043', '#ffffff'],
      });
    } catch {}
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg bg-[#161b22] border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 text-white overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center gap-2 text-accent text-xs font-mono uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Community Roadmap</span>
                </div>

                <h3 className="font-heading text-xl sm:text-2xl font-bold tracking-tight">
                  Request a website or tool
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  We build verified walkthroughs based on community demand. Tell us which site you want visual guidance for next.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-white/90 mb-1.5">
                    Website or Software Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    placeholder="e.g. Canva, IRCTC, Jira, Salesforce, Excel Online..."
                    className="w-full bg-[#0d1117] border border-white/15 px-3.5 py-2.5 rounded-lg text-sm text-white placeholder:text-muted-foreground focus:border-accent outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/90 mb-1.5">
                    Your Role / Category
                  </label>
                  <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value as any)}
                    className="w-full bg-[#0d1117] border border-white/15 px-3.5 py-2.5 rounded-lg text-sm text-white focus:border-accent outline-none transition-colors"
                  >
                    <option value="student">Student / Learner</option>
                    <option value="bootcamp">Working Professional</option>
                    <option value="other">First-Time User / Everyday Citizen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/90 mb-1.5">
                    Your Email (to notify you when it launches)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#0d1117] border border-white/15 px-3.5 py-2.5 rounded-lg text-sm text-white placeholder:text-muted-foreground focus:border-accent outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-accent hover:bg-accent-hover text-[#0d1117] font-semibold text-sm py-3 rounded-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(63,185,80,0.3)] transition-all"
                >
                  <Send className="w-4 h-4 text-[#0d1117]" />
                  <span>Submit Request &amp; Vote</span>
                </button>
              </form>
            ) : (
              <div className="py-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full border border-accent/40 bg-accent/10 text-accent mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-heading text-xl font-bold text-white">
                  Vote Received!
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  We added <span className="text-white font-semibold">{toolName}</span> to our verified walkthrough roadmap. We&apos;ll notify you as soon as it goes live.
                </p>
                <div className="pt-2">
                  <button
                    onClick={onClose}
                    className="bg-accent text-[#0d1117] text-xs font-semibold px-6 py-2.5 rounded-lg"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
