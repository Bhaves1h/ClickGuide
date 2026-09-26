import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp } from '../lib/utils';
import {
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Sparkles,
  GitBranch,
  GitPullRequest,
  CheckCircle2,
  ArrowRight,
  FolderGit2,
  MousePointer,
  Languages,
  Layers,
  Compass
} from 'lucide-react';

interface QuestStep {
  targetId: string;
  cursorPos: { x: number; y: number }; // percentage inside github mock
  narrationEn: string;
  narrationHi: string;
  actionText: string;
  duration: number; // ms
}

interface Quest {
  id: string;
  title: string;
  steps: QuestStep[];
}

const QUESTS: Quest[] = [
  {
    id: 'create-repo',
    title: 'Create my first repository',
    steps: [
      {
        targetId: 'btn-new',
        cursorPos: { x: 88, y: 16 },
        narrationEn: "Click the green 'New' button on the top right to start a brand new repository.",
        narrationHi: "नया रिपॉजिटरी शुरू करने के लिए ऊपर दाईं ओर दिए गए हरे 'New' बटन पर क्लिक करें।",
        actionText: "Click 'New' repository",
        duration: 3500,
      },
      {
        targetId: 'input-name',
        cursorPos: { x: 35, y: 46 },
        narrationEn: "Now type a simple, memorable name for your project like 'my-first-app'.",
        narrationHi: "अब अपने प्रोजेक्ट के लिए 'my-first-app' जैसा एक सरल और याद रखने योग्य नाम लिखें।",
        actionText: "Entering repository name...",
        duration: 3500,
      },
      {
        targetId: 'btn-create',
        cursorPos: { x: 26, y: 78 },
        narrationEn: "Scroll down and click 'Create repository'. You're officially on GitHub!",
        narrationHi: "नीचे स्क्रॉल करें और 'Create repository' पर क्लिक करें। आपका पहला प्रोजेक्ट तैयार है!",
        actionText: "Click 'Create repository'",
        duration: 3500,
      },
    ],
  },
  {
    id: 'first-pr',
    title: 'Open my first pull request',
    steps: [
      {
        targetId: 'btn-compare',
        cursorPos: { x: 74, y: 22 },
        narrationEn: "Click 'Compare & pull request' to review your branch changes against main.",
        narrationHi: "अपनी ब्रांच के बदलावों की मुख्य कोड से तुलना करने के लिए 'Compare & pull request' पर क्लिक करें।",
        actionText: "Click 'Compare & pull request'",
        duration: 3500,
      },
      {
        targetId: 'input-pr-title',
        cursorPos: { x: 42, y: 50 },
        narrationEn: "Summarize what you built or fixed in the title box for your teammates.",
        narrationHi: "टाइटल बॉक्स में संक्षेप में बताएं कि आपने क्या नया फीचर या फिक्स जोड़ा है।",
        actionText: "Writing PR title & description",
        duration: 3500,
      },
      {
        targetId: 'btn-submit-pr',
        cursorPos: { x: 82, y: 80 },
        narrationEn: "Hit 'Create pull request'. The maintainers will now review your code!",
        narrationHi: "'Create pull request' दबाएं। अब मेंटेनर्स आपके कोड का रिव्यू करेंगे!",
        actionText: "Click 'Create pull request'",
        duration: 3500,
      },
    ],
  },
  {
    id: 'fork-sync',
    title: 'Fork and clone an open-source project',
    steps: [
      {
        targetId: 'btn-fork',
        cursorPos: { x: 85, y: 15 },
        narrationEn: "Click 'Fork' at the top right to make your own independent copy of the repo.",
        narrationHi: "रिपॉजिटरी की अपनी स्वतंत्र कॉपी बनाने के लिए ऊपर दाईं ओर 'Fork' पर क्लिक करें।",
        actionText: "Click 'Fork' button",
        duration: 3500,
      },
      {
        targetId: 'btn-code-modal',
        cursorPos: { x: 70, y: 38 },
        narrationEn: "Click the green 'Code' button to copy your clone URL or open in VS Code.",
        narrationHi: "क्लोन URL कॉपी करने या VS Code में खोलने के लिए हरे 'Code' बटन पर क्लिक करें।",
        actionText: "Open Code dropdown",
        duration: 3500,
      },
      {
        targetId: 'btn-sync',
        cursorPos: { x: 50, y: 72 },
        narrationEn: "Click 'Sync fork' whenever you want to pull the latest upstream updates.",
        narrationHi: "जब भी आपको नए अपडेट्स लाने हों, 'Sync fork' बटन पर क्लिक करें।",
        actionText: "Sync with Upstream",
        duration: 3500,
      },
    ],
  },
];

export const Solution: React.FC = () => {
  const [activeQuestIndex, setActiveQuestIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeQuest = QUESTS[activeQuestIndex];
  const currentStep = activeQuest.steps[currentStepIndex];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const q = query.toLowerCase();
    if (q.includes('repo') || q.includes('create') || q.includes('new') || q.includes('banao') || q.includes('project')) {
      setActiveQuestIndex(0);
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else if (q.includes('pr') || q.includes('pull') || q.includes('commit') || q.includes('request') || q.includes('bhejo')) {
      setActiveQuestIndex(1);
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else if (q.includes('fork') || q.includes('clone') || q.includes('sync')) {
      setActiveQuestIndex(2);
      setCurrentStepIndex(0);
      setIsPlaying(true);
    }
  };

  // Speech synthesis for actual voice guidance
  const speakStep = (text: string, lang: 'en' | 'hi') => {
    if (!soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Fallback gracefully
    }
  };

  useEffect(() => {
    if (isPlaying) {
      const narrationText = language === 'hi' ? currentStep.narrationHi : currentStep.narrationEn;
      if (soundEnabled) {
        speakStep(narrationText, language);
      }

      const timer = setTimeout(() => {
        setCurrentStepIndex((prev) => (prev + 1) % activeQuest.steps.length);
      }, currentStep.duration);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStepIndex, activeQuestIndex, language, soundEnabled]);

  const handleQuestSelect = (idx: number) => {
    setActiveQuestIndex(idx);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  return (
    <section
      id="solution"
      className="relative w-full py-32 md:py-44 px-6 sm:px-8 md:px-28 bg-background border-t border-border/30 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Label: "SOLUTION" in text-xs tracking-[3px] uppercase text-muted-foreground */}
        <motion.div {...fadeUp(0.1)} className="text-center mb-4">
          <span className="text-xs uppercase tracking-[3px] text-muted-foreground font-mono">
            SOLUTION
          </span>
        </motion.div>

        {/* Heading: text-4xl md:text-6xl — "The platform for meaningful content" (serif italic on "meaningful") */}
        {/* Adapted for GitGuide: "The platform for effortless GitHub" with "effortless" in serif italic */}
        <motion.h2
          {...fadeUp(0.2)}
          className="text-4xl md:text-6xl font-medium tracking-tight text-center text-foreground mb-16"
        >
          The platform for{' '}
          <span className="font-serif italic font-normal text-white">
            effortless
          </span>{' '}
          GitHub.
        </motion.h2>

        {/* Video: Rounded rounded-2xl, aspect-[3/1] object-cover */}
        <motion.div
          {...fadeUp(0.3)}
          className="w-full aspect-[3/1] rounded-2xl overflow-hidden liquid-glass border border-white/10 mb-16 shadow-2xl relative"
        >
          {!videoError ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              onError={() => setVideoError(true)}
              className="w-full h-full object-cover filter contrast-125 brightness-95"
            >
              <source
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4"
                type="video/mp4"
              />
            </video>
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-black via-zinc-900 to-black flex items-center justify-center">
              <span className="font-mono text-xs text-muted-foreground">ClickGuide Visual Stream</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
        </motion.div>

        {/* ======================================================== */}
        {/* Interactive GitHub Virtual Cursor Simulator Showcase    */}
        {/* ======================================================== */}
        <motion.div
          {...fadeUp(0.4)}
          className="mb-24 liquid-glass rounded-2xl border border-white/15 overflow-hidden shadow-2xl"
        >
          {/* Top Control Bar */}
          <div className="p-4 md:p-6 border-b border-white/10 flex flex-col gap-4 bg-zinc-950/70">
            {/* Natural Language Task Search Input */}
            <div className="w-full flex items-center gap-2.5 liquid-glass rounded-full px-4 py-2 border border-white/15 focus-within:border-white/40 transition-colors">
              <Sparkles className="w-4 h-4 text-white/60 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Ask what to do (e.g. 'create a repository', 'open pull request', 'fork project')..."
                className="bg-transparent border-none outline-none text-xs sm:text-sm text-white placeholder:text-muted-foreground w-full font-normal"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-muted-foreground hover:text-white px-2 py-0.5"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Quest Selector Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase font-mono text-muted-foreground mr-1 hidden sm:inline">
                  Quest:
                </span>
                {QUESTS.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => handleQuestSelect(idx)}
                    className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                      activeQuestIndex === idx
                        ? 'bg-white text-black shadow-md'
                        : 'liquid-glass text-muted-foreground hover:text-white hover:border-white/30'
                    }`}
                  >
                    {q.title}
                  </button>
                ))}
              </div>

            {/* Language & Voice Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center liquid-glass rounded-full p-1 border border-white/10">
                <button
                  onClick={() => setLanguage('en')}
                  className={`text-xs px-3 py-1 rounded-full font-mono transition-all ${
                    language === 'en'
                      ? 'bg-white/20 text-white font-semibold'
                      : 'text-muted-foreground hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`text-xs px-3 py-1 rounded-full font-mono transition-all ${
                    language === 'hi'
                      ? 'bg-white/20 text-white font-semibold'
                      : 'text-muted-foreground hover:text-white'
                  }`}
                >
                  हिन्दी
                </button>
              </div>

              {/* Sound Toggle */}
              <button
                onClick={() => {
                  const nextState = !soundEnabled;
                  setSoundEnabled(nextState);
                  if (nextState) {
                    const text = language === 'hi' ? currentStep.narrationHi : currentStep.narrationEn;
                    speakStep(text, language);
                  }
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center liquid-glass transition-colors ${
                  soundEnabled ? 'text-white border-white/40' : 'text-muted-foreground'
                }`}
                title={soundEnabled ? 'Mute voiceover' : 'Enable voiceover'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Play / Pause */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-full flex items-center justify-center liquid-glass text-foreground hover:border-white/40 transition-colors"
                title={isPlaying ? 'Pause simulation' : 'Play simulation'}
              >
                {isPlaying ? <span className="w-2.5 h-2.5 bg-white rounded-xs" /> : <Play className="w-3 h-3 ml-0.5 fill-current" />}
              </button>

              {/* Reset */}
              <button
                onClick={() => setCurrentStepIndex(0)}
                className="w-8 h-8 rounded-full flex items-center justify-center liquid-glass text-muted-foreground hover:text-white transition-colors"
                title="Restart quest"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

          {/* Realistic GitHub UI Surface (Injected Extension View) */}
          <div className="relative w-full bg-[#0d1117] min-h-[380px] md:min-h-[460px] p-4 md:p-8 font-sans select-none overflow-hidden border-b border-white/5">
            {/* Mock GitHub Header */}
            <div className="w-full flex items-center justify-between pb-4 border-b border-[#30363d] text-xs text-[#c9d1d9] mb-6">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                  <FolderGit2 className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-semibold text-white">github.com</span>
                <span className="text-[#8b949e]">/ alex-dev / my-awesome-project</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-[#161b22] border border-[#30363d] px-2.5 py-1 rounded-md text-xs text-[#8b949e]">
                  <span>Search or jump to...</span>
                  <span className="border border-[#30363d] px-1 rounded text-[10px]">/</span>
                </div>
                {/* Mock New / Fork buttons */}
                <div
                  id="btn-new"
                  className={`px-3 py-1 rounded-md font-semibold text-xs transition-all flex items-center gap-1.5 ${
                    currentStep.targetId === 'btn-new'
                      ? 'bg-[#238636] text-white ring-4 ring-white ring-offset-2 ring-offset-black scale-105 shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                      : 'bg-[#238636] text-white opacity-80'
                  }`}
                >
                  <span>New</span>
                </div>
                <div
                  id="btn-fork"
                  className={`px-3 py-1 rounded-md border text-xs transition-all flex items-center gap-1 ${
                    currentStep.targetId === 'btn-fork'
                      ? 'bg-[#21262d] border-white text-white ring-4 ring-white ring-offset-2 ring-offset-black scale-105 shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                      : 'bg-[#21262d] border-[#30363d] text-[#c9d1d9]'
                  }`}
                >
                  <GitBranch className="w-3 h-3" />
                  <span>Fork</span>
                </div>
              </div>
            </div>

            {/* Mock GitHub Repository Sub-nav & Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4 text-xs text-[#8b949e]">
                <span className="text-white font-medium border-b-2 border-[#f78166] pb-1">Code</span>
                <span>Issues (2)</span>
                <span className="flex items-center gap-1">
                  <GitPullRequest className="w-3 h-3" /> Pull requests (0)
                </span>
                <span>Actions</span>
                <span>Settings</span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  id="btn-compare"
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                    currentStep.targetId === 'btn-compare'
                      ? 'bg-white text-black border-white ring-4 ring-white/80 ring-offset-2 ring-offset-black scale-105 shadow-[0_0_25px_rgba(255,255,255,0.5)]'
                      : 'bg-[#21262d] border-[#30363d] text-[#c9d1d9]'
                  }`}
                >
                  <span>Compare &amp; pull request</span>
                </div>

                <div
                  id="btn-code-modal"
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    currentStep.targetId === 'btn-code-modal'
                      ? 'bg-[#238636] text-white ring-4 ring-white ring-offset-2 ring-offset-black scale-105 shadow-[0_0_20px_rgba(255,255,255,0.5)]'
                      : 'bg-[#238636] text-white'
                  }`}
                >
                  <span>Code ▼</span>
                </div>
              </div>
            </div>

            {/* Mock Content Card / Form Workspace */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 max-w-2xl mx-auto shadow-inner relative">
              <div className="text-xs uppercase font-mono text-[#8b949e] mb-4 flex items-center justify-between">
                <span>Active Workspace</span>
                <span className="text-emerald-400 font-sans flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ClickGuide Active
                </span>
              </div>

              {/* Form Input 1 (Repo Name / PR Title) */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-[#c9d1d9] mb-2">
                  {activeQuestIndex === 0
                    ? 'Repository name *'
                    : activeQuestIndex === 1
                    ? 'Pull Request Title *'
                    : 'Upstream Remote Name'}
                </label>
                <div
                  id="input-name"
                  className={`w-full bg-[#0d1117] border px-3.5 py-2 rounded-md text-xs text-white font-mono flex items-center justify-between transition-all ${
                    currentStep.targetId === 'input-name' || currentStep.targetId === 'input-pr-title'
                      ? 'border-white ring-4 ring-white/70 scale-[1.01] shadow-[0_0_25px_rgba(255,255,255,0.2)]'
                      : 'border-[#30363d]'
                  }`}
                >
                  <span>
                    {activeQuestIndex === 0
                      ? 'my-first-repository'
                      : activeQuestIndex === 1
                      ? 'feat: add interactive landing page components'
                      : 'upstream/main'}
                  </span>
                  <span className="text-[#8b949e] text-[10px]">✓ Available</span>
                </div>
              </div>

              {/* Action Buttons inside Card */}
              <div className="flex items-center justify-between pt-4 border-t border-[#30363d]">
                <div className="flex items-center gap-2 text-xs text-[#8b949e]">
                  <span>Public repository</span>
                  <span>•</span>
                  <span>Add README: Checked</span>
                </div>

                <div
                  id="btn-create"
                  className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${
                    currentStep.targetId === 'btn-create' || currentStep.targetId === 'btn-submit-pr' || currentStep.targetId === 'btn-sync'
                      ? 'bg-white text-black ring-4 ring-white/80 ring-offset-2 ring-offset-black scale-105 shadow-[0_0_25px_rgba(255,255,255,0.6)]'
                      : 'bg-[#238636] text-white opacity-85'
                  }`}
                >
                  {activeQuestIndex === 0
                    ? 'Create repository'
                    : activeQuestIndex === 1
                    ? 'Create pull request'
                    : 'Sync fork now'}
                </div>
              </div>
            </div>

            {/* =================================================== */}
            {/* The Virtual Ghost Cursor & Real-time Click Highlight */}
            {/* =================================================== */}
            <motion.div
              animate={{
                left: `${currentStep.cursorPos.x}%`,
                top: `${currentStep.cursorPos.y}%`,
              }}
              transition={{
                duration: 1.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute pointer-events-none z-30 transform -translate-x-1.5 -translate-y-1.5"
            >
              {/* Ghost Cursor Ripple Ring */}
              <div className="relative">
                <span className="absolute -inset-6 rounded-full bg-white/20 blur-md animate-pulse" />
                <span className="absolute -inset-3 rounded-full bg-white/30 animate-ping" />
                
                {/* Modern Ghost Cursor Pointer */}
                <div className="relative flex items-center">
                  <div className="w-8 h-8 rounded-full bg-black/80 border border-white/60 shadow-[0_0_20px_rgba(255,255,255,0.8)] flex items-center justify-center backdrop-blur-sm">
                    <MousePointer className="w-4 h-4 text-white fill-white transform -rotate-12" />
                  </div>
                  
                  {/* Floating Action Pill Next to Cursor */}
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 8 }}
                    key={currentStep.actionText}
                    className="ml-2 bg-white text-black text-[11px] font-bold px-3 py-1 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.8)] flex items-center gap-1.5 whitespace-nowrap border border-black/20"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-black" />
                    <span>{currentStep.actionText}</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Step Narration & Subtitle Banner */}
          <div className="p-6 md:p-8 bg-black/90 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              {/* Step Counter Indicator */}
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center shrink-0 text-white font-mono text-xs font-semibold">
                0{currentStepIndex + 1}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                    Voice Narration &bull; {language === 'en' ? 'English' : 'हिन्दी'}
                  </span>
                  {soundEnabled && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Audio
                    </span>
                  )}
                </div>

                {/* Subtitle Text with smooth transitions */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`${activeQuest.id}-${currentStepIndex}-${language}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="text-base md:text-lg font-medium text-white max-w-2xl leading-relaxed"
                  >
                    {language === 'hi' ? currentStep.narrationHi : currentStep.narrationEn}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Quick Next Step Action */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => setCurrentStepIndex((prev) => (prev + 1) % activeQuest.steps.length)}
                className="liquid-glass text-xs font-medium px-4 py-2 rounded-full text-foreground hover:text-white flex items-center gap-2 hover:border-white/40 transition-colors"
              >
                <span>Next step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ======================================================== */}
        {/* 4-column Feature Grid (md:grid-cols-4 gap-8)            */}
        {/* ======================================================== */}
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              icon: MousePointer,
              title: 'Ghost Cursor Navigation',
              description:
                'An intelligent virtual pointer glides directly across GitHub and live web DOMs, showing you the exact button or dropdown without guessing.',
            },
            {
              icon: Languages,
              title: 'Bilingual Narration',
              description:
                'Crystal-clear audio explanations and subtitles in plain English and Hindi, breaking down complex workflows step by step.',
            },
            {
              icon: Layers,
              title: 'Zero Context-Switching',
              description:
                'Embedded as a seamless Chrome extension. Never alt-tab back and forth to YouTube or ChatGPT windows ever again.',
            },
            {
              icon: Compass,
              title: 'Step-by-Step Quests',
              description:
                'Curated walkthroughs for Chrome users to master repositories, complex web tools, and browser workflows with total confidence.',
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                {...fadeUp(0.1 + i * 0.1)}
                whileHover={{ y: -4 }}
                className="liquid-glass p-6 rounded-2xl border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl border border-white/15 flex items-center justify-center mb-5 text-foreground bg-white/[0.02]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-base text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
