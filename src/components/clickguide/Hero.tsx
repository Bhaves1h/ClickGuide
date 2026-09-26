import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, CheckCircle2, Sparkles, Volume2, Globe, MousePointer } from 'lucide-react';
import { ChromeIcon } from '../icons/BrandIcons';

interface HeroProps {
  onOpenInstallModal?: () => void;
  onOpenDemo?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenInstallModal, onOpenDemo }) => {
  // Pure CSS/JS walkthrough loop simulation state
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [heroLang, setHeroLang] = useState<'en' | 'hi'>('en');

  // 3-step walkthrough loop
  const walkthroughSteps = [
    {
      titleEn: "Step 1: Name your repository",
      titleHi: "चरण 1: अपने रिपॉजिटरी का नाम लिखें",
      descEn: "Type a clean, memorable name like 'portfolio-app'.",
      descHi: "अपने प्रोजेक्ट के लिए 'portfolio-app' जैसा एक सरल नाम दर्ज करें।",
      target: 'input',
      cursor: { x: 38, y: 44 }, // percentage in mock browser
      pill: "Enter project name",
    },
    {
      titleEn: "Step 2: Select repository visibility",
      titleHi: "चरण 2: रिपॉजिटरी की दृश्यता चुनें",
      descEn: "Choose 'Public' so your friends and recruiters can see your work.",
      descHi: "'Public' चुनें ताकि अन्य लोग और रिक्रूटर्स आपका काम देख सकें।",
      target: 'visibility',
      cursor: { x: 34, y: 64 },
      pill: "Choose Public",
    },
    {
      titleEn: "Step 3: Click 'Create repository'",
      titleHi: "चरण 3: 'Create repository' पर क्लिक करें",
      descEn: "Click the green button. ClickGuide handles the rest!",
      descHi: "हरे बटन पर क्लिक करें। आपका पहला प्रोजेक्ट ऑनलाइन तैयार है!",
      target: 'button',
      cursor: { x: 26, y: 84 },
      pill: "Click to create",
    },
  ];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % walkthroughSteps.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [isPaused, walkthroughSteps.length]);

  const currentStep = walkthroughSteps[activeStep];

  return (
    <section id="home" className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-6 sm:px-8 overflow-hidden bg-grid">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-accent/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Badge: "Your AI visual guide for the web" */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-white/10 mb-8 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs sm:text-sm font-medium text-white/90">
            Your AI visual guide for the web
          </span>
          <span className="text-muted-foreground text-xs">•</span>
          <span className="text-[11px] font-mono text-accent">Works on any site</span>
        </motion.div>

        {/* H1: "Stop reading tutorials. Start clicking." */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white max-w-4xl leading-[1.08] mb-6 text-balance"
        >
          Stop reading tutorials.{' '}
          <span className="text-accent underline decoration-accent/30 underline-offset-8">
            Start clicking.
          </span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-3xl leading-relaxed mb-10 text-balance font-normal"
        >
          Ask how to do anything &mdash; ClickGuide walks you through it on the{' '}
          <span className="text-white font-medium">real website</span>, highlighting every click and narrating each step in{' '}
          <span className="text-white font-medium">English or Hindi</span>.
        </motion.p>

        {/* CTAs: "Add to Chrome" + "Watch the 60-sec demo" + Waitlist Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-md flex flex-col items-center gap-4 mb-16"
        >
          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenInstallModal}
              className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-[#0d1117] font-semibold text-sm sm:text-base px-7 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(63,185,80,0.35)] transition-all"
            >
              <ChromeIcon className="w-5 h-5 text-[#0d1117]" />
              <span>Add to Chrome &mdash; Free</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenDemo ? onOpenDemo : () => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto glass-card hover:bg-surface-raised text-white font-medium text-sm sm:text-base px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 border border-white/10 hover:border-white/25 transition-all"
            >
              <Play className="w-4 h-4 fill-current text-white/80" />
              <span>Watch 60-sec demo</span>
            </motion.button>
          </div>

          {/* Quick email entry wired to Firebase waitlist backend */}
          <form
            id="waitlist-form"
            className="w-full mt-2 glass-card rounded-full p-1.5 pl-4 flex items-center justify-between border border-white/10 focus-within:border-accent/50 transition-colors shadow-lg"
          >
            <input
              type="email"
              name="email"
              id="waitlist-email"
              placeholder="Or enter email for early beta access..."
              aria-label="Email address"
              required
              className="bg-transparent border-none outline-none text-white placeholder:text-muted-foreground text-xs sm:text-sm w-full pr-2 font-normal"
            />
            <button
              type="submit"
              className="bg-surface-raised hover:bg-white/10 text-white font-medium text-xs px-4 py-2 rounded-full shrink-0 border border-white/10 transition-colors flex items-center gap-1.5"
            >
              <span>Notify me</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
            </button>
          </form>

          <p className="text-[11px] text-muted-foreground flex items-center gap-2">
            <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-accent" /> Manifest V3</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-accent" /> English &amp; हिन्दी</span>
            <span>•</span>
            <span>Zero Tracking</span>
          </p>
        </motion.div>

        {/* ========================================================================= */}
        {/* Large Animated Mock Browser Window (Pure CSS/JS - NO VIDEO)             */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-5xl rounded-2xl glass-card border border-white/15 shadow-2xl overflow-hidden text-left relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Top Browser Chrome Bar */}
          <div className="bg-[#161b22] px-4 py-3 border-b border-white/[0.08] flex items-center justify-between gap-4 select-none">
            {/* Window control dots */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#f85149]/80 border border-[#f85149]" />
              <span className="w-3 h-3 rounded-full bg-[#e3b341]/80 border border-[#e3b341]" />
              <span className="w-3 h-3 rounded-full bg-[#3fb950]/80 border border-[#3fb950]" />
              <span className="ml-3 hidden sm:inline-block text-xs font-mono text-muted-foreground">
                GitHub &bull; New Repository
              </span>
            </div>

            {/* Address Bar */}
            <div className="flex-1 max-w-md bg-[#0d1117] border border-white/10 px-3 py-1.5 rounded-lg text-xs font-mono text-muted-foreground flex items-center justify-between">
              <span className="flex items-center gap-2 truncate">
                <span className="text-accent text-[11px]">🔒</span>
                <span className="text-white">github.com</span>
                <span className="text-muted-foreground/80">/new</span>
              </span>
              <span className="text-[10px] text-accent/80 font-sans uppercase tracking-wider hidden sm:inline">
                Live DOM
              </span>
            </div>

            {/* Language & Pause Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setHeroLang(heroLang === 'en' ? 'hi' : 'en')}
                className="text-[11px] font-mono px-2 py-1 rounded bg-[#21262d] text-white hover:bg-white/10 transition-colors"
                title="Toggle language"
              >
                {heroLang === 'en' ? 'EN' : 'हिन्दी'}
              </button>
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span>ClickGuide Active</span>
              </div>
            </div>
          </div>

          {/* Realistic GitHub Web DOM Interface */}
          <div className="relative bg-[#0d1117] p-6 sm:p-8 min-h-[380px] sm:min-h-[460px] font-sans overflow-hidden select-none">
            {/* Header in simulated site */}
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-4 mb-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">Create a new repository</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    A repository contains all project files, including the revision history.
                  </p>
                </div>
                <span className="text-xs text-muted-foreground bg-[#21262d] px-2.5 py-1 rounded-md border border-[#30363d] hidden sm:inline">
                  Step {activeStep + 1} of 3
                </span>
              </div>

              {/* Form Input 1: Repository Name */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-[#c9d1d9] mb-1.5">
                  Repository name <span className="text-accent">*</span>
                </label>
                <div
                  className={`w-full max-w-sm bg-[#161b22] border px-3 py-2 rounded-md text-xs font-mono transition-all duration-300 flex items-center justify-between ${
                    currentStep.target === 'input'
                      ? 'border-accent shadow-[0_0_20px_rgba(63,185,80,0.3)] ring-2 ring-accent/30'
                      : 'border-[#30363d] text-muted-foreground'
                  }`}
                >
                  <span className={currentStep.target === 'input' ? 'text-white' : 'text-muted-foreground'}>
                    {currentStep.target === 'input' ? 'my-portfolio-app' : 'my-awesome-project'}
                  </span>
                  {currentStep.target === 'input' && (
                    <span className="text-accent text-[11px] flex items-center gap-1 font-sans">
                      <CheckCircle2 className="w-3 h-3" /> Great name
                    </span>
                  )}
                </div>
              </div>

              {/* Form Input 2: Visibility Radios */}
              <div className="mb-6 space-y-2.5">
                <div
                  className={`p-3 rounded-lg border transition-all duration-300 flex items-start gap-3 ${
                    currentStep.target === 'visibility'
                      ? 'bg-[#161b22] border-accent ring-2 ring-accent/30 shadow-[0_0_20px_rgba(63,185,80,0.25)]'
                      : 'border-[#30363d]/60 bg-transparent'
                  }`}
                >
                  <input
                    type="radio"
                    name="vis"
                    checked={true}
                    readOnly
                    className="mt-1 accent-accent"
                  />
                  <div>
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <span>Public</span>
                      <span className="text-[10px] text-accent bg-accent/10 px-1.5 py-0.2 rounded">Recommended</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Anyone on the internet can see this repository. You choose who can commit.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-[#30363d]/40 bg-transparent flex items-start gap-3 opacity-60">
                  <input type="radio" name="vis" checked={false} readOnly className="mt-1" />
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">Private</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      You choose who can see and commit to this repository.
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Button: Create Repository */}
              <div className="pt-4 border-t border-[#30363d] flex items-center justify-between">
                <div
                  className={`px-5 py-2.5 rounded-md text-xs font-semibold text-[#0d1117] transition-all duration-300 flex items-center gap-2 ${
                    currentStep.target === 'button'
                      ? 'bg-accent shadow-[0_0_30px_rgba(63,185,80,0.5)] ring-4 ring-accent/40 scale-105'
                      : 'bg-[#238636] text-white opacity-85'
                  }`}
                >
                  <span>Create repository</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>

                <span className="text-[11px] text-muted-foreground hidden sm:inline">
                  Guided by ClickGuide &bull; verified steps
                </span>
              </div>
            </div>

            {/* =============================================================== */}
            {/* Pure CSS/JS Animated Virtual Cursor with Pulse Rings & Tooltips */}
            {/* =============================================================== */}
            <motion.div
              animate={{
                left: `${currentStep.cursor.x}%`,
                top: `${currentStep.cursor.y}%`,
              }}
              transition={{
                duration: 1.1,
                ease: [0.25, 1, 0.5, 1],
              }}
              className="absolute pointer-events-none z-30"
            >
              {/* Expanding click pulse rings */}
              <div className="relative">
                <span className="absolute -inset-4 rounded-full bg-accent/30 animate-ping" />
                <span className="absolute -inset-2 rounded-full bg-accent/40 blur-xs" />

                {/* Cursor Arrow with Shadow */}
                <div className="relative flex items-start">
                  <div className="relative">
                    <MousePointer className="w-7 h-7 text-white fill-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]" />
                    <span className="absolute top-0 left-0 w-2 h-2 rounded-full bg-accent animate-pulse" />
                  </div>

                  {/* Floating Action Pill */}
                  <motion.div
                    key={currentStep.pill}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 8 }}
                    className="bg-accent text-[#0d1117] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xl whitespace-nowrap ml-2 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-[#0d1117]" />
                    <span>{currentStep.pill}</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Floating Narrating Tooltip Box inside browser */}
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-5 right-5 sm:bottom-6 sm:right-6 max-w-xs sm:max-w-sm glass-card bg-[#161b22]/95 border border-white/20 p-4 rounded-xl shadow-2xl z-20"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mb-1.5">
                <span className="flex items-center gap-1.5 text-accent font-semibold">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Narration ({heroLang === 'en' ? 'English' : 'हिन्दी'})</span>
                </span>
                <span>{activeStep + 1} / 3</span>
              </div>
              <h4 className="text-xs sm:text-sm font-semibold text-white mb-1">
                {heroLang === 'en' ? currentStep.titleEn : currentStep.titleHi}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {heroLang === 'en' ? currentStep.descEn : currentStep.descHi}
              </p>
            </motion.div>
          </div>

          {/* Browser Footer Navigation helper */}
          <div className="px-6 py-2.5 bg-[#161b22] border-t border-white/[0.08] flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>Auto-playing real walkthrough &bull; hover to pause</span>
            </span>
            <div className="flex items-center gap-1.5">
              {walkthroughSteps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeStep === idx ? 'w-6 bg-accent' : 'bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Jump to step ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
