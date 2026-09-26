import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  MousePointer,
  FolderGit2,
  CheckCircle2
} from 'lucide-react';

interface DemoStep {
  id: number;
  label: string;
  narrationEn: string;
  narrationHi: string;
  targetId: string;
  cursorCoord: { x: number; y: number }; // percentage inside mock window
  tip: string;
}

export const InteractiveDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [soundEnabled, setSoundEnabled] = useState(false);

  const steps: DemoStep[] = [
    {
      id: 1,
      label: "Click the 'New' repository button",
      narrationEn: "Click the green 'New' button in the top navigation bar to create a brand new repository.",
      narrationHi: "नया प्रोजेक्ट शुरू करने के लिए ऊपर दिए गए हरे 'New' बटन पर क्लिक करें।",
      targetId: 'btn-new',
      cursorCoord: { x: 86, y: 15 },
      tip: "Target: Top-right action button",
    },
    {
      id: 2,
      label: 'Enter a clean repository name',
      narrationEn: "Type a short, memorable name like 'my-first-repo'. GitHub checks availability instantly.",
      narrationHi: "अपने प्रोजेक्ट के लिए 'my-first-repo' जैसा एक सरल नाम टाइप करें।",
      targetId: 'input-name',
      cursorCoord: { x: 38, y: 44 },
      tip: "Target: Repository name field",
    },
    {
      id: 3,
      label: 'Set visibility: Public or Private',
      narrationEn: "Choose 'Public' so your colleagues or recruiters can view your code, or 'Private' for confidential work.",
      narrationHi: "'Public' चुनें ताकि सब लोग आपका कोड देख सकें, या 'Private' गुप्त फाइलों के लिए।",
      targetId: 'radio-public',
      cursorCoord: { x: 32, y: 64 },
      tip: "Target: Visibility radio selection",
    },
    {
      id: 4,
      label: 'Add a README documentation file',
      narrationEn: "Check 'Add a README file'. This initializes your project with a document explaining what it does.",
      narrationHi: "'Add a README file' बॉक्स को टिक करें ताकि प्रोजेक्ट के बारे में जानकारी लिखी जा सके।",
      targetId: 'check-readme',
      cursorCoord: { x: 28, y: 78 },
      tip: "Target: Initialize repository checkbox",
    },
    {
      id: 5,
      label: "Final step: Click 'Create repository'",
      narrationEn: "Click 'Create repository'. You are officially live on GitHub with your first repository!",
      narrationHi: "'Create repository' पर क्लिक करें। आपका पहला प्रोजेक्ट अब आधिकारिक रूप से लाइव है!",
      targetId: 'btn-submit',
      cursorCoord: { x: 25, y: 92 },
      tip: "Target: Confirmation button",
    },
  ];

  const activeStepData = steps[currentStep - 1];

  const speak = (text: string, currentLanguage: 'en' | 'hi') => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    } catch {}
  };

  const handleNext = () => {
    if (currentStep < 5) {
      const nextStepNum = currentStep + 1;
      setCurrentStep(nextStepNum);
      const nextText = lang === 'hi' ? steps[nextStepNum - 1].narrationHi : steps[nextStepNum - 1].narrationEn;
      speak(nextText, lang);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const prevStepNum = currentStep - 1;
      setCurrentStep(prevStepNum);
      const prevText = lang === 'hi' ? steps[prevStepNum - 1].narrationHi : steps[prevStepNum - 1].narrationEn;
      speak(prevText, lang);
    }
  };

  const handleLangToggle = (newLang: 'en' | 'hi') => {
    setLang(newLang);
    const text = newLang === 'hi' ? activeStepData.narrationHi : activeStepData.narrationEn;
    speak(text, newLang);
  };

  return (
    <section id="demo" className="relative py-28 md:py-36 px-6 sm:px-8 border-t border-white/[0.08] bg-[#0d1117]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono uppercase tracking-[2px] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Demo</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4">
            See the cursor in action.
          </h2>

          <p className="text-sm sm:text-base font-mono text-accent">
            Example: creating a repository on GitHub
          </p>
        </div>

        {/* Demo Container */}
        <div className="glass-card rounded-2xl border border-white/15 overflow-hidden shadow-2xl">
          {/* Top Demo Bar Controls */}
          <div className="p-4 sm:p-5 bg-[#161b22] border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
            {/* Step Counter Indicator */}
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-semibold font-mono text-accent bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/20">
                Step {currentStep} of 5
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {activeStepData.label}
              </span>
            </div>

            {/* Language & Voice toggles */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center bg-[#0d1117] rounded-lg p-1 border border-white/10">
                <button
                  onClick={() => handleLangToggle('en')}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                    lang === 'en' ? 'bg-accent text-[#0d1117] font-semibold' : 'text-muted-foreground hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => handleLangToggle('hi')}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                    lang === 'hi' ? 'bg-accent text-[#0d1117] font-semibold' : 'text-muted-foreground hover:text-white'
                  }`}
                >
                  हिन्दी
                </button>
              </div>

              {/* Sound Toggle */}
              <button
                onClick={() => {
                  const n = !soundEnabled;
                  setSoundEnabled(n);
                  if (n) {
                    const t = lang === 'hi' ? activeStepData.narrationHi : activeStepData.narrationEn;
                    speak(t, lang);
                  }
                }}
                className={`p-2 rounded-lg border transition-colors ${
                  soundEnabled
                    ? 'bg-accent/15 border-accent text-accent'
                    : 'bg-[#0d1117] border-white/10 text-muted-foreground hover:text-white'
                }`}
                title={soundEnabled ? 'Mute voice' : 'Enable voice speech'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Restart */}
              <button
                onClick={() => setCurrentStep(1)}
                className="p-2 rounded-lg bg-[#0d1117] border border-white/10 text-muted-foreground hover:text-white transition-colors"
                title="Restart demo"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Realistic GitHub Workspace Surface */}
          <div className="relative bg-[#0d1117] p-6 sm:p-10 min-h-[440px] sm:min-h-[500px] overflow-hidden select-none">
            {/* Mock GitHub Navigation Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#30363d] text-xs text-muted-foreground mb-8">
              <div className="flex items-center gap-3">
                <FolderGit2 className="w-4 h-4 text-white" />
                <span className="font-semibold text-white">github.com</span>
                <span>/ new</span>
              </div>
              <div
                id="btn-new"
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all duration-300 ${
                  activeStepData.targetId === 'btn-new'
                    ? 'bg-accent text-[#0d1117] ring-4 ring-accent/40 shadow-[0_0_25px_rgba(63,185,80,0.5)] scale-105'
                    : 'bg-[#238636] text-white opacity-80'
                }`}
              >
                + New
              </div>
            </div>

            {/* Form Workspace Content */}
            <div className="max-w-xl mx-auto space-y-6">
              {/* Form Input: Repo Name */}
              <div>
                <label className="block text-xs font-semibold text-white mb-2">
                  Repository name <span className="text-accent">*</span>
                </label>
                <div
                  id="input-name"
                  className={`bg-[#161b22] border px-3.5 py-2.5 rounded-lg text-xs font-mono transition-all duration-300 flex items-center justify-between ${
                    activeStepData.targetId === 'input-name'
                      ? 'border-accent ring-4 ring-accent/30 shadow-[0_0_25px_rgba(63,185,80,0.3)]'
                      : 'border-[#30363d] text-muted-foreground'
                  }`}
                >
                  <span className={currentStep >= 2 ? 'text-white' : 'text-muted-foreground'}>
                    {currentStep >= 2 ? 'my-first-repo' : 'e.g. awesome-website'}
                  </span>
                  {currentStep >= 2 && (
                    <span className="text-accent text-[11px] font-sans flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Valid
                    </span>
                  )}
                </div>
              </div>

              {/* Form Option: Public / Private */}
              <div
                id="radio-public"
                className={`p-4 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
                  activeStepData.targetId === 'radio-public'
                    ? 'bg-[#161b22] border-accent ring-4 ring-accent/30 shadow-[0_0_25px_rgba(63,185,80,0.25)]'
                    : 'border-[#30363d]/50 bg-transparent'
                }`}
              >
                <input type="radio" checked={true} readOnly className="mt-1 accent-accent" />
                <div>
                  <div className="text-xs font-semibold text-white flex items-center gap-2">
                    <span>Public</span>
                    <span className="text-[10px] text-accent bg-accent/15 px-1.5 py-0.2 rounded font-mono">
                      Selected
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Anyone on the internet can see this repository. You choose who can commit.
                  </div>
                </div>
              </div>

              {/* Form Option: README Checkbox */}
              <div
                id="check-readme"
                className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center gap-3 ${
                  activeStepData.targetId === 'check-readme'
                    ? 'bg-[#161b22] border-accent ring-4 ring-accent/30 shadow-[0_0_25px_rgba(63,185,80,0.25)]'
                    : 'border-[#30363d]/50 bg-transparent'
                }`}
              >
                <input
                  type="checkbox"
                  checked={currentStep >= 4}
                  readOnly
                  className="accent-accent w-4 h-4 rounded"
                />
                <div className="text-xs text-white font-medium">
                  Add a README file{' '}
                  <span className="text-muted-foreground font-normal text-[11px]">
                    (Includes a welcome overview of your project)
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-[#30363d] flex items-center justify-between">
                <div
                  id="btn-submit"
                  className={`px-5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center gap-2 ${
                    activeStepData.targetId === 'btn-submit'
                      ? 'bg-accent text-[#0d1117] ring-4 ring-accent/40 shadow-[0_0_30px_rgba(63,185,80,0.6)] scale-105'
                      : 'bg-[#238636] text-white opacity-85'
                  }`}
                >
                  <span>Create repository</span>
                  {currentStep === 5 && <CheckCircle2 className="w-4 h-4" />}
                </div>

                {currentStep === 5 && (
                  <span className="text-xs font-medium text-accent flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Ready to publish!
                  </span>
                )}
              </div>
            </div>

            {/* ========================================================= */}
            {/* Animated Cursor Pointer that Glides to Step Coordinates   */}
            {/* ========================================================= */}
            <motion.div
              animate={{
                left: `${activeStepData.cursorCoord.x}%`,
                top: `${activeStepData.cursorCoord.y}%`,
              }}
              transition={{
                duration: 0.9,
                ease: [0.25, 1, 0.5, 1],
              }}
              className="absolute pointer-events-none z-30 -translate-x-2 -translate-y-2"
            >
              <div className="relative">
                <span className="absolute -inset-4 rounded-full bg-accent/30 animate-ping" />
                <span className="absolute -inset-2 rounded-full bg-accent/40 blur-xs" />
                <div className="relative flex items-center">
                  <MousePointer className="w-7 h-7 text-white fill-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]" />
                  <div className="ml-2 bg-accent text-[#0d1117] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg whitespace-nowrap">
                    Click here
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Interactive Step Controller Bar */}
          <div className="p-6 bg-[#161b22] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            {/* Narration Explanation Box */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5 text-xs text-muted-foreground font-mono">
                <span className="text-accent font-semibold">Narrator ({lang === 'en' ? 'English' : 'हिन्दी'}):</span>
                <span>{activeStepData.tip}</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={`${currentStep}-${lang}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-base sm:text-lg font-medium text-white leading-relaxed"
                >
                  {lang === 'hi' ? activeStepData.narrationHi : activeStepData.narrationEn}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Back / Next Controls */}
            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-4 py-2.5 rounded-lg border border-white/15 text-xs font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleNext}
                disabled={currentStep === 5}
                className="px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-[#0d1117] text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(63,185,80,0.25)]"
              >
                <span>{currentStep === 5 ? 'Completed' : 'Next Step'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
