import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  MousePointer,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  FolderGit2,
  GitBranch,
  Terminal,
  Calculator,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface LiveStep {
  id: string;
  targetId: string;
  cursorPos: { x: number; y: number };
  titleEn: string;
  titleHi: string;
  narrationEn: string;
  narrationHi: string;
  actionText: string;
  typedValue?: string;
  duration: number;
}

export interface LiveQuest {
  id: string;
  platform: 'github' | 'linear' | 'vercel' | 'notion' | 'terminal' | 'math';
  title: string;
  titleHi: string;
  description: string;
  steps: LiveStep[];
}

export const QUESTS: LiveQuest[] = [
  // 1. Create my first repository
  {
    id: 'create-repo',
    platform: 'github',
    title: 'Create my first repository',
    titleHi: 'अपनी पहली रिपॉजिटरी बनाएं',
    description: 'Set up a new GitHub repo with a README and public visibility.',
    steps: [
      {
        id: 'gh-new',
        targetId: 'btn-new',
        cursorPos: { x: 86, y: 15 },
        titleEn: "Click 'New' repository button",
        titleHi: "'New' रिपॉजिटरी बटन पर क्लिक करें",
        narrationEn: "Click the green 'New' button in the top navigation bar to create a brand new repository.",
        narrationHi: "नया प्रोजेक्ट शुरू करने के लिए ऊपर दिए गए हरे 'New' बटन पर क्लिक करें।",
        actionText: "Click 'New' button",
        duration: 3200,
      },
      {
        id: 'gh-name',
        targetId: 'input-name',
        cursorPos: { x: 38, y: 44 },
        titleEn: 'Enter repository name',
        titleHi: 'रिपॉजिटरी का नाम लिखें',
        narrationEn: "Now type a short, memorable name for your project like 'my-first-app'.",
        narrationHi: "अब अपने प्रोजेक्ट के लिए 'my-first-app' जैसा एक सरल नाम लिखें।",
        actionText: "Entering 'my-first-app'...",
        typedValue: 'my-first-app',
        duration: 3400,
      },
      {
        id: 'gh-visibility',
        targetId: 'radio-public',
        cursorPos: { x: 32, y: 64 },
        titleEn: 'Set visibility to Public',
        titleHi: 'पब्लिक विजिबिलिटी चुनें',
        narrationEn: "Select 'Public' so teammates, mentors, and the community can view your code.",
        narrationHi: "'Public' चुनें ताकि अन्य लोग और मेंटर्स आपका कोड देख सकें।",
        actionText: "Select 'Public' visibility",
        duration: 3200,
      },
      {
        id: 'gh-readme',
        targetId: 'check-readme',
        cursorPos: { x: 32, y: 74 },
        titleEn: 'Initialize with a README',
        titleHi: 'README फ़ाइल जोड़ें',
        narrationEn: 'Check this box to automatically initialize your project with a README.md file.',
        narrationHi: 'अपने प्रोजेक्ट के विवरण के लिए README फ़ाइल जोड़ने के लिए यह बॉक्स चुनें।',
        actionText: 'Check README checkbox',
        duration: 3200,
      },
      {
        id: 'gh-submit',
        targetId: 'btn-create',
        cursorPos: { x: 26, y: 86 },
        titleEn: "Click 'Create repository'",
        titleHi: "'Create repository' पर क्लिक करें",
        narrationEn: "Hit 'Create repository'. You are officially live on GitHub!",
        narrationHi: "'Create repository' दबाएं। आपका पहला प्रोजेक्ट अब GitHub पर तैयार है!",
        actionText: "Click 'Create repository'",
        duration: 3600,
      },
    ],
  },

  // 2. Open my first pull request
  {
    id: 'first-pr',
    platform: 'github',
    title: 'Open my first pull request',
    titleHi: 'पहला पुल रिक्वेस्ट खोलें',
    description: 'Propose your branch changes and request maintainer review.',
    steps: [
      {
        id: 'gh-compare',
        targetId: 'btn-compare',
        cursorPos: { x: 74, y: 22 },
        titleEn: "Click 'Compare & pull request'",
        titleHi: "'Compare & pull request' पर क्लिक करें",
        narrationEn: "Click 'Compare & pull request' to review your branch changes against the main branch.",
        narrationHi: "अपनी ब्रांच के बदलावों की मुख्य कोड से तुलना करने के लिए 'Compare & pull request' पर क्लिक करें।",
        actionText: "Click 'Compare & pull request'",
        duration: 3400,
      },
      {
        id: 'gh-pr-title',
        targetId: 'input-pr-title',
        cursorPos: { x: 42, y: 50 },
        titleEn: 'Write PR Title & Summary',
        titleHi: 'पुल रिक्वेस्ट का टाइटल लिखें',
        narrationEn: "Summarize what you built or fixed in the title box for your teammates.",
        narrationHi: "टाइटल बॉक्स में संक्षेप में बताएं कि आपने क्या नया फीचर या फिक्स जोड़ा है।",
        actionText: 'Entering PR title...',
        typedValue: 'feat: add interactive landing page components',
        duration: 3500,
      },
      {
        id: 'gh-submit-pr',
        targetId: 'btn-submit-pr',
        cursorPos: { x: 78, y: 82 },
        titleEn: "Click 'Create pull request'",
        titleHi: "'Create pull request' पर क्लिक करें",
        narrationEn: "Hit 'Create pull request'. The maintainers will now review and merge your code!",
        narrationHi: "'Create pull request' दबाएं। अब मेंटेनर्स आपके कोड का रिव्यू करेंगे!",
        actionText: "Click 'Create pull request'",
        duration: 3600,
      },
    ],
  },

  // 3. Create issue & assign sprint on Linear
  {
    id: 'linear-issue',
    platform: 'linear',
    title: 'Create issue & assign sprint on Linear',
    titleHi: 'Linear पर इशू बनाएं और स्प्रिंट असाइन करें',
    description: 'Track software bugs or features and link them to your current cycle.',
    steps: [
      {
        id: 'lin-new',
        targetId: 'btn-lin-new',
        cursorPos: { x: 84, y: 15 },
        titleEn: "Click 'New Issue' (C)",
        titleHi: "'New Issue' पर क्लिक करें",
        narrationEn: "Click the 'New Issue' button or press shortcut 'C' on Linear to open the task creator.",
        narrationHi: "Linear में नया टास्क बनाने के लिए 'New Issue' बटन पर क्लिक करें।",
        actionText: "Click 'New Issue'",
        duration: 3400,
      },
      {
        id: 'lin-title',
        targetId: 'input-lin-title',
        cursorPos: { x: 40, y: 42 },
        titleEn: 'Enter issue title',
        titleHi: 'इशू का नाम लिखें',
        narrationEn: "Type a descriptive title for what needs to be solved.",
        narrationHi: "जो समस्या हल करनी है उसका स्पष्ट नाम लिखें।",
        actionText: 'Typing issue title...',
        typedValue: 'Fix responsive navigation bug on mobile',
        duration: 3500,
      },
      {
        id: 'lin-assign',
        targetId: 'btn-lin-assign',
        cursorPos: { x: 30, y: 64 },
        titleEn: 'Assign to engineer & set Priority: Urgent',
        titleHi: 'इंजीनियर को असाइन करें और प्राथमिकता चुनें',
        narrationEn: "Assign this ticket to yourself or a teammate, and set the priority to Urgent.",
        narrationHi: "यह टास्क खुद को या टीम के साथी को असाइन करें और प्राथमिकता 'Urgent' चुनें।",
        actionText: 'Assign & set Urgent',
        duration: 3400,
      },
      {
        id: 'lin-submit',
        targetId: 'btn-lin-submit',
        cursorPos: { x: 78, y: 84 },
        titleEn: "Click 'Create Issue'",
        titleHi: "'Create Issue' पर क्लिक करें",
        narrationEn: "Hit 'Create Issue' to publish the ticket directly onto your active sprint board!",
        narrationHi: "'Create Issue' दबाएं ताकि यह तुरंत आपकी स्प्रिंट बोर्ड पर जुड़ जाए!",
        actionText: "Click 'Create Issue'",
        duration: 3600,
      },
    ],
  },

  // 4. Deploy Git project on Vercel
  {
    id: 'vercel-deploy',
    platform: 'vercel',
    title: 'Deploy Git project on Vercel',
    titleHi: 'Vercel पर गिट प्रोजेक्ट डिप्लॉय करें',
    description: 'Import a GitHub repository and publish globally.',
    steps: [
      {
        id: 'ver-import',
        targetId: 'btn-ver-import',
        cursorPos: { x: 82, y: 18 },
        titleEn: "Click 'Import' next to your repo",
        titleHi: "रिपॉजिटरी के पास 'Import' पर क्लिक करें",
        narrationEn: "Click 'Import' next to your GitHub repository to link it to Vercel.",
        narrationHi: "अपने GitHub प्रोजेक्ट को Vercel से जोड़ने के लिए 'Import' पर क्लिक करें।",
        actionText: "Click 'Import' repository",
        duration: 3400,
      },
      {
        id: 'ver-env',
        targetId: 'input-ver-env',
        cursorPos: { x: 42, y: 52 },
        titleEn: 'Configure Environment Variables',
        titleHi: 'एनवायरनमेंट वैरिएबल्स जोड़ें',
        narrationEn: "Expand 'Environment Variables' and enter secret keys or database connection strings.",
        narrationHi: "'Environment Variables' खोलकर अपनी सीक्रेट कीज़ या डेटाबेस लिंक जोड़ें।",
        actionText: 'Add API_SECRET_KEY',
        typedValue: 'DATABASE_URL=postgres://prod...',
        duration: 3500,
      },
      {
        id: 'ver-deploy',
        targetId: 'btn-ver-deploy',
        cursorPos: { x: 76, y: 82 },
        titleEn: "Hit 'Deploy' to go live worldwide",
        titleHi: "'Deploy' दबाएं और लाइव करें",
        narrationEn: "Click 'Deploy'. Vercel automatically builds and provides a fast public HTTPS domain!",
        narrationHi: "'Deploy' पर क्लिक करें। Vercel इसे बिल्ड करके तुरंत लाइव लिंक तैयार कर देगा!",
        actionText: "Click 'Deploy'",
        duration: 3600,
      },
    ],
  },

  // 5. Build a Kanban Database on Notion
  {
    id: 'notion-database',
    platform: 'notion',
    title: 'Build a Kanban Database on Notion',
    titleHi: 'Notion पर कानबान डेटाबेस बनाएं',
    description: 'Create an interactive project board with custom tags and progress columns.',
    steps: [
      {
        id: 'not-new',
        targetId: 'btn-not-new',
        cursorPos: { x: 22, y: 22 },
        titleEn: "Click '+ New page'",
        titleHi: "'+ New page' पर क्लिक करें",
        narrationEn: "Click '+ New page' in the left sidebar to start your new Notion document.",
        narrationHi: "बाईं साइडबार में '+ New page' पर क्लिक करके नया पेज शुरू करें।",
        actionText: "Click '+ New page'",
        duration: 3400,
      },
      {
        id: 'not-board',
        targetId: 'btn-not-board',
        cursorPos: { x: 46, y: 52 },
        titleEn: "Select 'Board database' template",
        titleHi: "'Board database' चुनें",
        narrationEn: "Choose 'Board' view to organize your tasks into To Do, In Progress, and Done columns.",
        narrationHi: "टास्क को 'To Do', 'In Progress' और 'Done' में व्यवस्थित करने के लिए 'Board' चुनें।",
        actionText: 'Select Board View',
        duration: 3400,
      },
      {
        id: 'not-card',
        targetId: 'btn-not-card',
        cursorPos: { x: 38, y: 76 },
        titleEn: "Click '+ New' to add your first task card",
        titleHi: "पहला टास्क कार्ड जोड़ने के लिए '+ New' दबाएं",
        narrationEn: "Click '+ New' under the To Do column and name your first deliverable.",
        narrationHi: "'To Do' कॉलम के नीचे '+ New' पर क्लिक करें और अपने पहले टास्क का नाम लिखें।",
        actionText: 'Add Task Card',
        duration: 3600,
      },
    ],
  },

  // 6. Fix Terminal / Git Command Error
  {
    id: 'command-error',
    platform: 'terminal',
    title: 'Fix Terminal / Git Command Error',
    titleHi: 'टर्मिनल / Git कमांड एरर ठीक करें',
    description: 'Resolve push rejections, detached HEAD, and merge conflicts cleanly.',
    steps: [
      {
        id: 'cmd-1',
        targetId: 'btn-cmd-check',
        cursorPos: { x: 35, y: 32 },
        titleEn: 'Inspect Git status & branch state',
        titleHi: 'Git स्टेटस की जांच करें',
        narrationEn: 'First, check git status to inspect uncommitted changes or divergent branches.',
        narrationHi: 'पहले git status चलाकर अनकमिटेड बदलावों की जांच करें।',
        actionText: 'Run: git status',
        typedValue: '$ git status',
        duration: 3400,
      },
      {
        id: 'cmd-2',
        targetId: 'btn-cmd-rebase',
        cursorPos: { x: 45, y: 56 },
        titleEn: 'Fetch & rebase upstream changes cleanly',
        titleHi: 'रिमोट ब्रांच को रीबेस करें',
        narrationEn: 'Run git fetch and rebase on origin main to cleanly incorporate upstream changes.',
        narrationHi: 'git pull --rebase चलाकर रिमोट कोड को सुरक्षित रूप से सिंक करें।',
        actionText: 'Run: git pull --rebase',
        typedValue: '$ git pull --rebase origin main',
        duration: 3500,
      },
      {
        id: 'cmd-3',
        targetId: 'btn-cmd-push',
        cursorPos: { x: 70, y: 82 },
        titleEn: 'Push changes with verified lease',
        titleHi: 'बदलावों को सुरक्षित रूप से पुश करें',
        narrationEn: 'Now push your resolved commits cleanly with --force-with-lease.',
        narrationHi: 'अब अपने कमिट्स को सुरक्षित तरीके से पुश करें।',
        actionText: 'Run: git push --force-with-lease',
        typedValue: '$ git push --force-with-lease origin HEAD',
        duration: 3600,
      },
    ],
  },

  // 7. Fix Calculation & Formula Error
  {
    id: 'calculation-error',
    platform: 'math',
    title: 'Fix Calculation & Formula Error',
    titleHi: 'कैलकुलेशन और फार्मूला एरर ठीक करें',
    description: 'Diagnose formula discrepancies, floating-point rounding, and metric errors.',
    steps: [
      {
        id: 'calc-1',
        targetId: 'btn-calc-input',
        cursorPos: { x: 35, y: 35 },
        titleEn: 'Identify formula input discrepancy',
        titleHi: 'फार्मूला इनपुट एरर की पहचान करें',
        narrationEn: 'Locate the metric calculation cell or formula input producing incorrect outputs.',
        narrationHi: 'गलत परिणाम देने वाले इनपुट या सेल की पहचान करें।',
        actionText: 'Select Formula Input',
        typedValue: '((score - min) / (max - min)) * 100',
        duration: 3400,
      },
      {
        id: 'calc-2',
        targetId: 'btn-calc-precision',
        cursorPos: { x: 45, y: 58 },
        titleEn: 'Apply precision rounding & clamping fix',
        titleHi: 'सटीक राउंडिंग फार्मूला लागू करें',
        narrationEn: 'Wrap computation in Math.round with bounded range clamping to prevent NaN.',
        narrationHi: 'NaN और फ्लोटिंग पॉइंट एरर से बचने के लिए सही राउंडिंग फार्मूला लागू करें।',
        actionText: 'Apply Math.round Clamp',
        typedValue: 'Math.round(((score - min) / (max - min || 1)) * 100)',
        duration: 3500,
      },
      {
        id: 'calc-3',
        targetId: 'btn-calc-save',
        cursorPos: { x: 72, y: 82 },
        titleEn: 'Verify output & save calculation',
        titleHi: 'परिणाम सत्यापित करें और सेव करें',
        narrationEn: 'Confirm the calculated metric matches the expected output and save.',
        narrationHi: 'सत्यापित करें कि परिणाम सही है और सेव करें।',
        actionText: 'Click Confirm & Save',
        duration: 3600,
      },
    ],
  },
];

export const CommandCenter: React.FC = () => {
  const [activeQuest, setActiveQuest] = useState<LiveQuest>(QUESTS[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isClicking, setIsClicking] = useState(false);
  const [questFinished, setQuestFinished] = useState(false);

  // Initial cursor position: starts at an offset so it visibly glides to step 0 on load
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 25, y: 65 });

  const currentStep = activeQuest.steps[currentStepIndex] || activeQuest.steps[0];

  // Auto-glide cursor on mount or step change
  useEffect(() => {
    // Visibly glide cursor to current step target location shortly after load
    const glideTimer = setTimeout(() => {
      setCursorPos(currentStep.cursorPos);
    }, 120);

    return () => clearTimeout(glideTimer);
  }, [currentStepIndex, activeQuest]);

  // Step progression timer
  useEffect(() => {
    if (!isPlaying || questFinished) return;

    // Simulate click near the middle of step duration
    const clickTimer = setTimeout(() => {
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 450);
    }, 1100);

    // Advance to next step
    const advanceTimer = setTimeout(() => {
      if (currentStepIndex + 1 < activeQuest.steps.length) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setQuestFinished(true);
        try {
          confetti({
            particleCount: 75,
            spread: 80,
            origin: { y: 0.5 },
            colors: ['#ffffff', '#22c55e', '#3b82f6', '#eab308'],
          });
        } catch {}
      }
    }, currentStep.duration);

    return () => {
      clearTimeout(clickTimer);
      clearTimeout(advanceTimer);
    };
  }, [isPlaying, questFinished, currentStepIndex, activeQuest, currentStep.duration]);

  // Handle task pill click: loads walkthrough and auto-plays from step 1
  const handleSelectTask = (quest: LiveQuest) => {
    setActiveQuest(quest);
    setCurrentStepIndex(0);
    setQuestFinished(false);
    setIsPlaying(true);
    // Reset cursor slightly so the user sees fresh movement
    setCursorPos({ x: 25, y: 65 });
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setQuestFinished(false);
    }
  };

  const handleNext = () => {
    if (currentStepIndex + 1 < activeQuest.steps.length) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setQuestFinished(true);
      try {
        confetti({ particleCount: 70, spread: 75, origin: { y: 0.5 } });
      } catch {}
    }
  };

  const handleReplay = () => {
    setCurrentStepIndex(0);
    setQuestFinished(false);
    setIsPlaying(true);
    setCursorPos({ x: 25, y: 65 });
  };

  // Flip tooltip to left if cursor is towards right side of canvas (prevents right-edge clipping!)
  const isNearRightEdge = cursorPos.x > 50;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 selection:text-white flex flex-col justify-between overflow-x-hidden">
      {/* 1. SLIM HEADER */}
      <header className="w-full border-b border-white/10 bg-zinc-950/80 backdrop-blur-md px-4 sm:px-8 py-3 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Left: ClickGuide logo + "AI Virtual Cursor" tagline */}
          <div className="flex items-center gap-3">
            <div className="relative w-6 h-6 rounded-full border-2 border-white/80 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full border border-white/80 bg-white/20" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white">ClickGuide</span>
              <span className="text-xs text-zinc-400 font-mono hidden sm:inline">AI Virtual Cursor</span>
            </div>
          </div>

          {/* Right: EN / हिन्दी toggle. Nothing else. */}
          <div className="flex items-center bg-white/5 p-0.5 rounded-full border border-white/15 text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-full font-mono transition-all cursor-pointer ${
                language === 'en' ? 'bg-white text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1 rounded-full font-mono transition-all cursor-pointer ${
                language === 'hi' ? 'bg-white text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col justify-center min-w-0">
        {/* 2. TASK PICKER — ONE row of pills */}
        <div className="w-full mb-4 sm:mb-5">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none min-w-0">
            {QUESTS.map((q) => {
              const isSelected = activeQuest.id === q.id;
              return (
                <button
                  key={q.id}
                  onClick={() => handleSelectTask(q)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-[1.02]'
                      : 'bg-zinc-900 text-zinc-400 border border-white/10 hover:text-white hover:border-white/30'
                  }`}
                >
                  {language === 'hi' ? q.titleHi : q.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. THE CANVAS (Mock browser + ghost cursor animation) */}
        <div className="relative w-full bg-[#0d1117] rounded-xl border border-white/15 overflow-hidden shadow-2xl min-h-[380px] sm:min-h-[440px] flex flex-col justify-between p-4 sm:p-6 select-none min-w-0">
          {/* Mock Browser Top Ribbon */}
          <div className="w-full flex items-center justify-between pb-3 border-b border-[#30363d] text-xs text-[#c9d1d9] gap-2 min-w-0">
            <div className="flex items-center gap-2.5 min-w-0 truncate">
              <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center font-bold text-white text-[11px] shrink-0">
                {activeQuest.platform === 'github' && <FolderGit2 className="w-3.5 h-3.5 text-white" />}
                {activeQuest.platform === 'linear' && 'L'}
                {activeQuest.platform === 'vercel' && '▲'}
                {activeQuest.platform === 'notion' && 'N'}
                {activeQuest.platform === 'terminal' && <Terminal className="w-3.5 h-3.5 text-white" />}
                {activeQuest.platform === 'math' && <Calculator className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className="font-semibold text-white truncate">
                {activeQuest.platform === 'github' && 'github.com'}
                {activeQuest.platform === 'linear' && 'linear.app'}
                {activeQuest.platform === 'vercel' && 'vercel.com'}
                {activeQuest.platform === 'notion' && 'notion.so'}
                {activeQuest.platform === 'terminal' && 'terminal.local'}
                {activeQuest.platform === 'math' && 'calculator.app'}
              </span>
              <span className="text-[#8b949e] hidden sm:inline truncate">
                / workspace / {activeQuest.id}
              </span>
            </div>

            {/* Platform Header Action Target Elements */}
            <div className="flex items-center gap-2 shrink-0">
              {activeQuest.platform === 'github' && (
                <>
                  <div
                    id="btn-new"
                    className={`px-3 py-1 rounded-md font-semibold text-xs transition-all flex items-center gap-1.5 ${
                      currentStep.targetId === 'btn-new'
                        ? 'bg-[#238636] text-white ring-4 ring-white/90 shadow-[0_0_25px_rgba(35,134,54,0.7)] animate-pulse'
                        : 'bg-[#238636] text-white opacity-85'
                    }`}
                  >
                    <span>+ New</span>
                  </div>
                  <div
                    id="btn-fork"
                    className="px-2.5 py-1 rounded-md border border-[#30363d] text-[#c9d1d9] bg-[#21262d] text-xs hidden sm:flex items-center gap-1"
                  >
                    <GitBranch className="w-3 h-3" />
                    <span>Fork</span>
                  </div>
                </>
              )}

              {activeQuest.platform === 'linear' && (
                <div
                  id="btn-lin-new"
                  className={`px-3.5 py-1 rounded-md font-semibold text-xs transition-all ${
                    currentStep.targetId === 'btn-lin-new'
                      ? 'bg-blue-600 text-white ring-4 ring-white/90 shadow-[0_0_25px_rgba(59,130,246,0.7)] animate-pulse'
                      : 'bg-blue-600/85 text-white'
                  }`}
                >
                  <span>+ New Issue</span>
                </div>
              )}

              {activeQuest.platform === 'vercel' && (
                <div
                  id="btn-ver-import"
                  className={`px-3.5 py-1 rounded-md font-semibold text-xs transition-all ${
                    currentStep.targetId === 'btn-ver-import'
                      ? 'bg-white text-black ring-4 ring-white/90 shadow-[0_0_25px_rgba(255,255,255,0.8)] animate-pulse'
                      : 'bg-white/80 text-black'
                  }`}
                >
                  <span>Import Git Repo</span>
                </div>
              )}

              {activeQuest.platform === 'notion' && (
                <div
                  id="btn-not-new"
                  className={`px-3 py-1 rounded-md font-semibold text-xs transition-all ${
                    currentStep.targetId === 'btn-not-new'
                      ? 'bg-white text-black ring-4 ring-white/90 shadow-[0_0_25px_rgba(255,255,255,0.8)] animate-pulse'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  <span>+ New Page</span>
                </div>
              )}

              {activeQuest.platform === 'terminal' && (
                <div
                  id="btn-cmd-check"
                  className={`px-3 py-1 rounded-md font-mono text-xs transition-all ${
                    currentStep.targetId === 'btn-cmd-check'
                      ? 'bg-emerald-500 text-black font-bold ring-4 ring-white/90 shadow-[0_0_25px_rgba(16,185,129,0.8)] animate-pulse'
                      : 'bg-zinc-800 text-zinc-300'
                  }`}
                >
                  <span>git status</span>
                </div>
              )}

              {activeQuest.platform === 'math' && (
                <div
                  id="btn-calc-input"
                  className={`px-3 py-1 rounded-md font-mono text-xs transition-all ${
                    currentStep.targetId === 'btn-calc-input'
                      ? 'bg-amber-400 text-black font-bold ring-4 ring-white/90 shadow-[0_0_25px_rgba(251,191,36,0.8)] animate-pulse'
                      : 'bg-zinc-800 text-zinc-300'
                  }`}
                >
                  <span>fx formula</span>
                </div>
              )}
            </div>
          </div>

          {/* Sub-bar / Section Title */}
          <div className="flex items-center justify-between py-2 text-xs text-[#8b949e] border-b border-[#30363d]/40 min-w-0">
            <span className="text-white font-medium truncate">
              {activeQuest.platform === 'github' && (activeQuest.id === 'create-repo' ? 'Repository Details' : 'Open a pull request')}
              {activeQuest.platform === 'linear' && 'Sprint Board · Active Cycle'}
              {activeQuest.platform === 'vercel' && 'Project Configuration'}
              {activeQuest.platform === 'notion' && 'Project Management Database'}
              {activeQuest.platform === 'terminal' && 'Bash / Zsh Terminal Environment'}
              {activeQuest.platform === 'math' && 'Metrics & Mathematical Computation'}
            </span>

            {activeQuest.id === 'first-pr' && (
              <div
                id="btn-compare"
                className={`px-2.5 py-1 rounded text-xs transition-all ${
                  currentStep.targetId === 'btn-compare'
                    ? 'bg-white text-black font-semibold ring-4 ring-white/90 shadow-[0_0_20px_rgba(255,255,255,0.7)] animate-pulse'
                    : 'bg-[#21262d] text-[#c9d1d9]'
                }`}
              >
                <span>Compare & pull request</span>
              </div>
            )}
          </div>

          {/* Dynamic Form / Workspace Area */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 sm:p-5 w-full max-w-xl mx-auto shadow-2xl my-auto min-w-0">
            <div className="text-[11px] uppercase font-mono text-[#8b949e] mb-3 flex items-center justify-between">
              <span className="capitalize">{activeQuest.platform} Live Canvas</span>
              <span className="text-emerald-400 font-sans flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Virtual AI Active
              </span>
            </div>

            {/* Input Field / Terminal Block / Formula Block */}
            {activeQuest.platform === 'terminal' ? (
              <div className="bg-black/90 rounded-lg p-3 border border-zinc-800 font-mono text-xs space-y-2 mb-3">
                <div className="text-zinc-500"># Terminal output log</div>
                <div className="text-emerald-400">
                  {currentStep.typedValue || '$ git status'}
                  <span className="w-1.5 h-3.5 bg-emerald-400 inline-block ml-1 animate-pulse" />
                </div>
                <div
                  id="btn-cmd-rebase"
                  className={`p-2 rounded transition-all ${
                    currentStep.targetId === 'btn-cmd-rebase'
                      ? 'bg-white/10 text-white border border-white ring-4 ring-white/80 shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                      : 'text-zinc-400'
                  }`}
                >
                  $ git pull --rebase origin main (fast-forward)
                </div>
              </div>
            ) : activeQuest.platform === 'math' ? (
              <div className="bg-black/90 rounded-lg p-3 border border-zinc-800 font-mono text-xs space-y-2 mb-3">
                <div className="text-zinc-500"># Computed Metric Formula</div>
                <div
                  id="btn-calc-precision"
                  className={`p-2 rounded transition-all ${
                    currentStep.targetId === 'btn-calc-precision'
                      ? 'bg-white/10 text-white border border-white ring-4 ring-white/80 shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                      : 'text-zinc-300'
                  }`}
                >
                  {currentStep.typedValue || 'Math.round(((score - min) / (max - min || 1)) * 100)'}
                  <span className="w-1.5 h-3.5 bg-white inline-block ml-1 animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="mb-3.5 min-w-0">
                <label className="block text-xs font-semibold text-[#c9d1d9] mb-1.5 truncate">
                  {activeQuest.platform === 'github' && (activeQuest.id === 'create-repo' ? 'Repository name *' : 'Pull Request Title *')}
                  {activeQuest.platform === 'linear' && 'Issue Title *'}
                  {activeQuest.platform === 'vercel' && 'Environment Key & Value *'}
                  {activeQuest.platform === 'notion' && 'Database View Title *'}
                </label>
                <div
                  id="input-name"
                  className={`w-full bg-[#0d1117] border px-3.5 py-2 rounded-md text-xs text-white font-mono flex items-center justify-between transition-all min-w-0 ${
                    currentStep.targetId.includes('input') || currentStep.targetId.includes('name') || currentStep.targetId.includes('title') || currentStep.targetId.includes('env')
                      ? 'border-white ring-4 ring-white/80 shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                      : 'border-[#30363d]'
                  }`}
                >
                  <span className="flex items-center gap-1 truncate min-w-0">
                    {currentStep.typedValue || activeQuest.title}
                    {(currentStep.targetId.includes('input') || currentStep.targetId.includes('name') || currentStep.targetId.includes('title')) && (
                      <span className="w-1.5 h-3.5 bg-white animate-pulse inline-block shrink-0" />
                    )}
                  </span>
                  <span className="text-emerald-400 text-[10px] shrink-0 ml-2">✓ Validated</span>
                </div>
              </div>
            )}

            {/* Intermediate Action (Radio / Assignee / Template) */}
            <div
              id="radio-public"
              className={`p-2.5 rounded-lg border mb-3 flex items-start gap-2.5 transition-all min-w-0 ${
                currentStep.targetId === 'radio-public' || currentStep.targetId === 'btn-lin-assign' || currentStep.targetId === 'btn-not-board'
                  ? 'border-white bg-white/5 ring-4 ring-white/80 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                  : 'border-[#30363d]/60 bg-[#0d1117]/40'
              }`}
            >
              <input type="radio" checked readOnly className="mt-0.5 accent-white shrink-0" />
              <div className="min-w-0 truncate">
                <div className="text-xs font-semibold text-white truncate">
                  {activeQuest.platform === 'github' && 'Public Visibility'}
                  {activeQuest.platform === 'linear' && 'Assignee: Alex Dev • Priority: Urgent'}
                  {activeQuest.platform === 'vercel' && 'Branch: main • Auto-Deploy'}
                  {activeQuest.platform === 'notion' && 'Board View (To Do / In Progress / Done)'}
                  {activeQuest.platform === 'terminal' && 'Resolved Rebase Tree'}
                  {activeQuest.platform === 'math' && 'Normalized Clamped Output'}
                </div>
                <div className="text-[11px] text-[#8b949e] truncate">Recommended workflow configuration</div>
              </div>
            </div>

            {/* Bottom Submit Action */}
            <div className="flex items-center justify-between pt-2.5 border-t border-[#30363d]">
              <div className="text-[11px] text-[#8b949e] font-mono">
                Step {currentStepIndex + 1} of {activeQuest.steps.length}
              </div>

              <div
                id="btn-create"
                className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${
                  currentStep.targetId.includes('submit') || currentStep.targetId.includes('create') || currentStep.targetId.includes('deploy') || currentStep.targetId.includes('card') || currentStep.targetId.includes('push') || currentStep.targetId.includes('save')
                    ? 'bg-white text-black ring-4 ring-white/90 shadow-[0_0_30px_rgba(255,255,255,0.7)] animate-pulse'
                    : 'bg-[#238636] text-white opacity-85'
                }`}
              >
                {activeQuest.platform === 'github' && (activeQuest.id === 'create-repo' ? 'Create repository' : 'Create pull request')}
                {activeQuest.platform === 'linear' && 'Create Issue'}
                {activeQuest.platform === 'vercel' && 'Deploy to Production'}
                {activeQuest.platform === 'notion' && 'Add Task Card'}
                {activeQuest.platform === 'terminal' && 'git push'}
                {activeQuest.platform === 'math' && 'Confirm & Save'}
              </div>
            </div>
          </div>

          <motion.div
            id="ghost-cursor"
            animate={{
              left: `${cursorPos.x}%`,
              top: `${cursorPos.y}%`,
            }}
            transition={{
              duration: 1.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute pointer-events-none z-30 transform -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative flex items-center justify-center">
              {/* Spotlight Halo Beam */}
              <span className="absolute -inset-6 rounded-full bg-white/20 blur-md animate-pulse" />
              <span className="absolute -inset-3 rounded-full bg-white/30 animate-ping" />

              {/* Click Ripple Effect */}
              {isClicking && (
                <motion.span
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  className="absolute -inset-4 rounded-full border-2 border-emerald-400 bg-emerald-400/30"
                />
              )}

              {/* Cursor circle centered exactly on target */}
              <div className="w-8 h-8 rounded-full bg-black/85 border border-white/70 shadow-[0_0_20px_rgba(255,255,255,0.85)] flex items-center justify-center backdrop-blur-sm shrink-0 relative z-10">
                <MousePointer className="w-4 h-4 text-white fill-white transform -rotate-12" />
              </div>

              {/* Floating Action Pill Tooltip - flips left or right based on edge */}
              <motion.div
                key={`${activeQuest.id}-${currentStepIndex}-${currentStep.actionText}`}
                initial={{ opacity: 0, x: isNearRightEdge ? 8 : -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className={`absolute top-1/2 -translate-y-1/2 ${
                  isNearRightEdge ? 'right-full mr-2.5' : 'left-full ml-2.5'
                } bg-white text-black text-[11px] font-bold px-3 py-1 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.8)] flex items-center gap-1.5 whitespace-nowrap border border-black/20 shrink-0 z-20`}
              >
                <Sparkles className="w-3.5 h-3.5 text-black shrink-0" />
                <span>{currentStep.actionText}</span>
              </motion.div>
            </div>
          </motion.div>

          {/* 5. COMPLETION STATE OVERLAY (Confetti + Checkmark + Replay) */}
          {questFinished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-4 text-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.6)]">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Practical Solution Complete!</h3>
              <p className="text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">
                You successfully mastered &ldquo;{activeQuest.title}&rdquo; with ClickGuide AI virtual cursor guidance.
              </p>
              {/* ONE button: "Replay". Nothing else. */}
              <button
                onClick={handleReplay}
                className="bg-white text-black font-bold px-6 py-2.5 rounded-full text-xs sm:text-sm flex items-center gap-2 hover:bg-white/90 shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Replay
              </button>
            </motion.div>
          )}
        </div>

        {/* 4. PLAYER CONTROLS UNDER THE CANVAS (Previous, Play/Pause, Next, Replay, Step X of Y) */}
        <div className="w-full bg-zinc-950 border border-white/10 rounded-xl p-3.5 sm:p-4 mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
          {/* Left: Step X of Y + narration */}
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-0.5">
              Step {currentStepIndex + 1} of {activeQuest.steps.length}
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={`${activeQuest.id}-${currentStepIndex}-${language}`}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                className="text-xs sm:text-sm font-medium text-white truncate max-w-2xl"
              >
                {language === 'hi' ? currentStep.narrationHi : currentStep.narrationEn}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Right: Player Controls ONLY */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {/* Previous */}
            <button
              onClick={handlePrevious}
              disabled={currentStepIndex === 0}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Previous"
              aria-label="Previous step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white text-black font-bold hover:bg-white/90 shadow-md transition-colors cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
            </button>

            {/* Next */}
            <button
              onClick={handleNext}
              disabled={questFinished}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Next"
              aria-label="Next step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Replay */}
            <button
              onClick={handleReplay}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Replay"
              aria-label="Replay walkthrough"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Slim Footer Brand */}
      <footer className="w-full py-3 px-4 text-center text-[11px] text-zinc-600 font-mono shrink-0">
        ClickGuide &bull; The AI Virtual Cursor Command Center
      </footer>
    </div>
  );
};
