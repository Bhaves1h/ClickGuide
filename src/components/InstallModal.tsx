import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  MousePointer,
  FolderGit2,
  GitBranch,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Search,
  Copy,
  Zap,
  Globe,
  Layers,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LiveStep {
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

interface LiveQuest {
  id: string;
  platform: 'github' | 'linear' | 'vercel' | 'notion' | 'custom';
  title: string;
  titleHi: string;
  description: string;
  steps: LiveStep[];
}

const PREBUILT_QUESTS: LiveQuest[] = [
  // ================= GitHub =================
  {
    id: 'create-repo',
    platform: 'github',
    title: 'Create my first repository',
    titleHi: 'अपनी पहली रिपॉजिटरी बनाएं',
    description: 'Set up a new GitHub repo with a README and public visibility in 5 guided steps.',
    steps: [
      {
        id: 'gh-new',
        targetId: 'btn-new',
        cursorPos: { x: 88, y: 15 },
        titleEn: "Click 'New' repository button",
        titleHi: "'New' रिपॉजिटरी बटन पर क्लिक करें",
        narrationEn: "Click the green 'New' button in the top navigation bar to create a brand new repository.",
        narrationHi: "नया प्रोजेक्ट शुरू करने के लिए ऊपर दिए गए हरे 'New' बटन पर क्लिक करें।",
        actionText: "Click 'New' button",
        duration: 3500,
      },
      {
        id: 'gh-name',
        targetId: 'input-name',
        cursorPos: { x: 38, y: 44 },
        titleEn: 'Enter repository name',
        titleHi: 'रिपॉजिटरी का नाम लिखें',
        narrationEn: "Now type a short, memorable name for your project like 'my-first-app'.",
        narrationHi: "अब अपने प्रोजेक्ट के लिए 'my-first-app' जैसा एक सरल और याद रखने योग्य नाम लिखें।",
        actionText: "Entering 'my-first-app'...",
        typedValue: 'my-first-app',
        duration: 3800,
      },
      {
        id: 'gh-visibility',
        targetId: 'radio-public',
        cursorPos: { x: 32, y: 64 },
        titleEn: 'Set visibility to Public',
        titleHi: 'पब्लिक विजिबिलिटी चुनें',
        narrationEn: "Select 'Public' so teammates, mentors, and the open-source community can view your code.",
        narrationHi: "'Public' चुनें ताकि अन्य लोग और मेंटर्स आपका कोड देख सकें।",
        actionText: "Select 'Public' visibility",
        duration: 3500,
      },
      {
        id: 'gh-readme',
        targetId: 'check-readme',
        cursorPos: { x: 32, y: 74 },
        titleEn: 'Initialize with a README',
        titleHi: 'README फ़ाइल जोड़ें',
        narrationEn: 'Check this box to automatically initialize your project with a README.md documentation file.',
        narrationHi: 'अपने प्रोजेक्ट के विवरण के लिए README फ़ाइल अपने आप जोड़ने के लिए यह बॉक्स चुनें।',
        actionText: 'Check README checkbox',
        duration: 3500,
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
        duration: 4000,
      },
    ],
  },
  {
    id: 'first-pr',
    platform: 'github',
    title: 'Open my first pull request',
    titleHi: 'पहला पुल रिक्वेस्ट खोलें',
    description: 'Propose your branch changes, summarize edits, and request maintainer review.',
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
        duration: 3500,
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
        duration: 3800,
      },
      {
        id: 'gh-submit-pr',
        targetId: 'btn-submit-pr',
        cursorPos: { x: 80, y: 82 },
        titleEn: "Click 'Create pull request'",
        titleHi: "'Create pull request' पर क्लिक करें",
        narrationEn: "Hit 'Create pull request'. The maintainers will now review and merge your code!",
        narrationHi: "'Create pull request' दबाएं। अब मेंटेनर्स आपके कोड का रिव्यू करेंगे!",
        actionText: "Click 'Create pull request'",
        duration: 4000,
      },
    ],
  },

  // ================= Linear =================
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
        cursorPos: { x: 88, y: 15 },
        titleEn: "Click 'New Issue' (C)",
        titleHi: "'New Issue' पर क्लिक करें",
        narrationEn: "Click the 'New Issue' button or press shortcut 'C' on Linear to open the task creator.",
        narrationHi: "Linear में नया टास्क बनाने के लिए 'New Issue' बटन पर क्लिक करें।",
        actionText: "Click 'New Issue'",
        duration: 3500,
      },
      {
        id: 'lin-title',
        targetId: 'input-lin-title',
        cursorPos: { x: 40, y: 42 },
        titleEn: 'Enter issue title',
        titleHi: 'इशू का नाम लिखें',
        narrationEn: "Type a descriptive title for what needs to be solved (e.g., 'Fix responsive navigation bug').",
        narrationHi: "जो समस्या हल करनी है उसका स्पष्ट नाम लिखें।",
        actionText: 'Typing issue title...',
        typedValue: 'Fix responsive navigation bug on mobile',
        duration: 3800,
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
        duration: 3500,
      },
      {
        id: 'lin-submit',
        targetId: 'btn-lin-submit',
        cursorPos: { x: 82, y: 84 },
        titleEn: "Click 'Create Issue'",
        titleHi: "'Create Issue' पर क्लिक करें",
        narrationEn: "Hit 'Create Issue' to publish the ticket directly onto your active sprint board!",
        narrationHi: "'Create Issue' दबाएं ताकि यह तुरंत आपकी स्प्रिंट बोर्ड पर जुड़ जाए!",
        actionText: "Click 'Create Issue'",
        duration: 4000,
      },
    ],
  },

  // ================= Vercel =================
  {
    id: 'vercel-deploy',
    platform: 'vercel',
    title: 'Deploy Git project on Vercel',
    titleHi: 'Vercel पर गिट प्रोजेक्ट डिप्लॉय करें',
    description: 'Import a GitHub repository, configure environment variables, and publish globally.',
    steps: [
      {
        id: 'ver-import',
        targetId: 'btn-ver-import',
        cursorPos: { x: 84, y: 22 },
        titleEn: "Click 'Import' next to your repo",
        titleHi: "रिपॉजिटरी के पास 'Import' पर क्लिक करें",
        narrationEn: "Click 'Import' next to your GitHub repository to link it to Vercel.",
        narrationHi: "अपने GitHub प्रोजेक्ट को Vercel से जोड़ने के लिए 'Import' पर क्लिक करें।",
        actionText: "Click 'Import' repository",
        duration: 3500,
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
        duration: 3800,
      },
      {
        id: 'ver-deploy',
        targetId: 'btn-ver-deploy',
        cursorPos: { x: 78, y: 82 },
        titleEn: "Hit 'Deploy' to go live worldwide",
        titleHi: "'Deploy' दबाएं और लाइव करें",
        narrationEn: "Click 'Deploy'. Vercel automatically builds and provides a fast public HTTPS domain!",
        narrationHi: "'Deploy' पर क्लिक करें। Vercel इसे बिल्ड करके तुरंत लाइव लिंक तैयार कर देगा!",
        actionText: "Click 'Deploy'",
        duration: 4000,
      },
    ],
  },

  // ================= Notion =================
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
        cursorPos: { x: 22, y: 26 },
        titleEn: "Click '+ New page'",
        titleHi: "'+ New page' पर क्लिक करें",
        narrationEn: "Click '+ New page' in the left sidebar to start your new Notion document.",
        narrationHi: "बाईं साइडबार में '+ New page' पर क्लिक करके नया पेज शुरू करें।",
        actionText: "Click '+ New page'",
        duration: 3500,
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
        duration: 3500,
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
        duration: 4000,
      },
    ],
  },

  // ================= Command Error Fix =================
  {
    id: 'command-error',
    platform: 'custom',
    title: 'Fix Terminal / Git Command Error',
    titleHi: 'टर्मिनल / Git कमांड एरर ठीक करें',
    description: 'Resolve push rejections, detached HEAD, and merge conflicts live.',
    steps: [
      {
        id: 'cmd-1',
        targetId: 'btn-cmd-check',
        cursorPos: { x: 35, y: 30 },
        titleEn: 'Inspect Git status and branch state',
        titleHi: 'Git स्टेटस की जांच करें',
        narrationEn: 'First, check git status to inspect uncommitted changes or divergent branches.',
        narrationHi: 'पहले git status चलाकर अनकमिटेड बदलावों की जांच करें।',
        actionText: 'Run: git status',
        typedValue: 'git status',
        duration: 3500,
      },
      {
        id: 'cmd-2',
        targetId: 'btn-cmd-rebase',
        cursorPos: { x: 50, y: 55 },
        titleEn: 'Fetch and rebase remote branch cleanly',
        titleHi: 'रिमोट ब्रांच को रीबेस करें',
        narrationEn: 'Run git fetch and rebase on origin main to cleanly incorporate upstream changes.',
        narrationHi: 'git pull --rebase चलाकर रिमोट कोड को सुरक्षित रूप से मर्ज करें।',
        actionText: 'Run: git pull --rebase origin main',
        typedValue: 'git pull --rebase origin main',
        duration: 3800,
      },
      {
        id: 'cmd-3',
        targetId: 'btn-cmd-push',
        cursorPos: { x: 75, y: 80 },
        titleEn: 'Push changes with verified lease',
        titleHi: 'बदलावों को पुश करें',
        narrationEn: 'Now push your resolved commits cleanly with --force-with-lease.',
        narrationHi: 'अब अपने कमिट्स को सुरक्षित तरीके से पुश करें।',
        actionText: 'Run: git push origin HEAD',
        typedValue: 'git push origin HEAD',
        duration: 4000,
      },
    ],
  },

  // ================= Calculation Error Fix =================
  {
    id: 'calculation-error',
    platform: 'custom',
    title: 'Fix Calculation & Formula Error',
    titleHi: 'कैलकुलेशन और फार्मूला एरर ठीक करें',
    description: 'Diagnose formula discrepancies, floating-point rounding, and metric errors.',
    steps: [
      {
        id: 'calc-1',
        targetId: 'btn-calc-input',
        cursorPos: { x: 30, y: 35 },
        titleEn: 'Identify formula input discrepancy',
        titleHi: 'फार्मूला इनपुट एरर की पहचान करें',
        narrationEn: 'Locate the metric calculation cell or formula input producing incorrect outputs.',
        narrationHi: 'गलत परिणाम देने वाले इनपुट या सेल की पहचान करें।',
        actionText: 'Select Formula Input',
        typedValue: '((val - min) / (max - min)) * 100',
        duration: 3500,
      },
      {
        id: 'calc-2',
        targetId: 'btn-calc-precision',
        cursorPos: { x: 55, y: 58 },
        titleEn: 'Apply precision rounding fix',
        titleHi: 'सटीक राउंडिंग फार्मूला लागू करें',
        narrationEn: 'Wrap computation in Math.round with bounded range clamping to prevent NaN.',
        narrationHi: 'NaN और फ्लोटिंग पॉइंट एरर से बचने के लिए सही राउंडिंग फार्मूला लागू करें।',
        actionText: 'Apply Math.round Clamp',
        typedValue: 'Math.round(((v - min) / (max - min || 1)) * 100)',
        duration: 3800,
      },
      {
        id: 'calc-3',
        targetId: 'btn-calc-save',
        cursorPos: { x: 78, y: 82 },
        titleEn: 'Verify output & save calculation',
        titleHi: 'परिणाम सत्यापित करें और सेव करें',
        narrationEn: 'Confirm the calculated metric matches the expected output and save.',
        narrationHi: 'सत्यापित करें कि परिणाम सही है और सेव करें।',
        actionText: 'Click Confirm & Save',
        duration: 4000,
      },
    ],
  },
];

// Dynamic Problem Solver Engine: Generates practical live steps for ANY custom problem
function solveCustomProblem(problemText: string): LiveQuest {
  const p = problemText.toLowerCase();

  if (p.includes('command') || p.includes('git') || p.includes('terminal') || p.includes('push') || p.includes('conflict')) {
    return {
      id: 'custom-command',
      platform: 'custom',
      title: `Command Fix: ${problemText}`,
      titleHi: `कमांड समाधान: ${problemText}`,
      description: `Step-by-step verified terminal fix for: "${problemText}".`,
      steps: PREBUILT_QUESTS.find((q) => q.id === 'command-error')!.steps,
    };
  }

  if (p.includes('calc') || p.includes('math') || p.includes('formula') || p.includes('number') || p.includes('percentage')) {
    return {
      id: 'custom-calc',
      platform: 'custom',
      title: `Calculation Fix: ${problemText}`,
      titleHi: `कैलकुलेशन समाधान: ${problemText}`,
      description: `Step-by-step formula and logic fix for: "${problemText}".`,
      steps: PREBUILT_QUESTS.find((q) => q.id === 'calculation-error')!.steps,
    };
  }

  if (p.includes('linear') || p.includes('sprint') || p.includes('ticket') || p.includes('bug')) {
    return {
      id: 'custom-linear',
      platform: 'linear',
      title: `Linear: ${problemText}`,
      titleHi: `Linear समाधान: ${problemText}`,
      description: `Step-by-step practical guide to: "${problemText}" on Linear.`,
      steps: PREBUILT_QUESTS.find((q) => q.platform === 'linear')!.steps,
    };
  }

  if (p.includes('vercel') || p.includes('deploy') || p.includes('hosting') || p.includes('domain')) {
    return {
      id: 'custom-vercel',
      platform: 'vercel',
      title: `Vercel: ${problemText}`,
      titleHi: `Vercel समाधान: ${problemText}`,
      description: `Step-by-step practical guide to: "${problemText}" on Vercel.`,
      steps: PREBUILT_QUESTS.find((q) => q.platform === 'vercel')!.steps,
    };
  }

  if (p.includes('notion') || p.includes('table') || p.includes('notes') || p.includes('kanban') || p.includes('database')) {
    return {
      id: 'custom-notion',
      platform: 'notion',
      title: `Notion: ${problemText}`,
      titleHi: `Notion समाधान: ${problemText}`,
      description: `Step-by-step practical guide to: "${problemText}" on Notion.`,
      steps: PREBUILT_QUESTS.find((q) => q.platform === 'notion')!.steps,
    };
  }

  // Universal Problem Solver for any website/problem
  return {
    id: 'custom-problem',
    platform: 'custom',
    title: `Live Solution: ${problemText}`,
    titleHi: `लाइव समाधान: ${problemText}`,
    description: `AI-synthesized walkthrough for: "${problemText}" with virtual cursor guidance.`,
    steps: [
      {
        id: 'cust-1',
        targetId: 'btn-cust-action-1',
        cursorPos: { x: 82, y: 18 },
        titleEn: `Locate primary action for "${problemText}"`,
        titleHi: `शुरुआती बटन खोजें: "${problemText}"`,
        narrationEn: `Click the primary action or settings button to initiate "${problemText}".`,
        narrationHi: `"${problemText}" शुरू करने के लिए मुख्य एक्शन बटन पर क्लिक करें।`,
        actionText: 'Click Action Button',
        duration: 3600,
      },
      {
        id: 'cust-2',
        targetId: 'input-cust-field',
        cursorPos: { x: 42, y: 48 },
        titleEn: `Configure parameters for "${problemText}"`,
        titleHi: `ज़रूरी विवरण भरें`,
        narrationEn: `Enter required names, configurations, or parameters in the active workspace.`,
        narrationHi: `ज़रूरी नाम और सेटिंग्स को इनपुट बॉक्स में भरें।`,
        actionText: 'Entering configuration...',
        typedValue: problemText,
        duration: 3800,
      },
      {
        id: 'cust-3',
        targetId: 'btn-cust-confirm',
        cursorPos: { x: 76, y: 82 },
        titleEn: `Save and execute "${problemText}"`,
        titleHi: `सेव करें और लागू करें`,
        narrationEn: `Click Confirm / Save to finalize "${problemText}" successfully.`,
        narrationHi: `कार्य पूरा करने के लिए 'Confirm & Save' पर क्लिक करें।`,
        actionText: 'Click Confirm & Save',
        duration: 4000,
      },
    ],
  };
}

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuest?: string;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose, initialQuest }) => {
  const [activeTab, setActiveTab] = useState<'simulator' | 'real-website'>('simulator');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'github' | 'linear' | 'vercel' | 'notion'>('all');
  const [activeQuest, setActiveQuest] = useState<LiveQuest>(PREBUILT_QUESTS[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [problemQuery, setProblemQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [questFinished, setQuestFinished] = useState(false);
  const [isFindingSolution, setIsFindingSolution] = useState(false);
  const [findingMessage, setFindingMessage] = useState('');

  const currentStep = activeQuest.steps[currentStepIndex] || activeQuest.steps[0];

  // Set initial quest if requested
  useEffect(() => {
    if (initialQuest) {
      const match = PREBUILT_QUESTS.find(
        (q) => q.title.toLowerCase().includes(initialQuest.toLowerCase()) || q.id === initialQuest
      );
      if (match) {
        setActiveQuest(match);
        setCurrentStepIndex(0);
      } else {
        const solved = solveCustomProblem(initialQuest);
        setActiveQuest(solved);
        setCurrentStepIndex(0);
      }
    }
  }, [initialQuest, isOpen]);

  // Web Speech API Voiceover
  const speakStep = (text: string, lang: 'en' | 'hi') => {
    if (!soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {}
  };

  // Auto-glide cursor & step progression
  useEffect(() => {
    if (!isOpen || !isPlaying || practiceMode || activeTab !== 'simulator' || isFindingSolution) return;

    const clickTimer = setTimeout(() => {
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 500);
    }, 1200);

    const narrationText = language === 'hi' ? currentStep.narrationHi : currentStep.narrationEn;
    if (soundEnabled) {
      speakStep(narrationText, language);
    }

    const nextStepTimer = setTimeout(() => {
      if (currentStepIndex + 1 < activeQuest.steps.length) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setQuestFinished(true);
        try {
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.5 },
            colors: ['#ffffff', '#888888', '#22c55e', '#3b82f6'],
          });
        } catch {}
      }
    }, currentStep.duration);

    return () => {
      clearTimeout(clickTimer);
      clearTimeout(nextStepTimer);
    };
  }, [isOpen, isPlaying, currentStepIndex, activeQuest, language, soundEnabled, practiceMode, activeTab, isFindingSolution]);

  const handleProblemSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!problemQuery.trim()) return;

    setIsFindingSolution(true);
    setFindingMessage(`⚡ ClickGuide AI analyzing problem: "${problemQuery.trim()}"...`);

    setTimeout(() => {
      setFindingMessage(`🔍 Scanning web platform interface & synthesizing practical steps...`);
    }, 450);

    setTimeout(() => {
      const solved = solveCustomProblem(problemQuery.trim());
      setActiveQuest(solved);
      setCurrentStepIndex(0);
      setQuestFinished(false);
      setIsFindingSolution(false);
      setIsPlaying(true);
      if (soundEnabled) {
        speakStep(language === 'hi' ? solved.steps[0].narrationHi : solved.steps[0].narrationEn, language);
      }
    }, 900);
  };

  const handleQuestSelect = (q: LiveQuest) => {
    setActiveQuest(q);
    setCurrentStepIndex(0);
    setQuestFinished(false);
    setIsPlaying(true);
  };

  const handleTargetClick = (targetId: string) => {
    if (currentStep.targetId === targetId) {
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 400);
      if (currentStepIndex + 1 < activeQuest.steps.length) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setQuestFinished(true);
        try {
          confetti({ particleCount: 75, spread: 70, origin: { y: 0.5 } });
        } catch {}
      }
    }
  };

  // Self-Contained Zero-CSP Bookmarklet (Runs on GitHub without CSP blocking)
  const selfContainedBookmarklet = `javascript:(function(){ try { var oldHud = document.getElementById('cg-hud'); if (oldHud && oldHud.parentNode) oldHud.parentNode.removeChild(oldHud); var oldCur = document.getElementById('cg-cur'); if (oldCur && oldCur.parentNode) oldCur.parentNode.removeChild(oldCur); var oldStyle = document.getElementById('cg-styles'); if (oldStyle && oldStyle.parentNode) oldStyle.parentNode.removeChild(oldStyle); window.__CG_HUD__ = null; window.__CG_CUR__ = null; } catch(e) {} var host = window.location.hostname || 'this website'; var shortHost = host.replace(/^www\./, ''); var currentLang = 'en'; var activeSolution = null; var currentStepIdx = 0; var hl = null; var s = document.createElement('style'); s.id = 'cg-styles'; s.textContent = [ '#cg-cur{position:fixed;left:calc(100vw - 360px);top:calc(100vh - 420px);pointer-events:none;z-index:2147483647;transition:left .7s cubic-bezier(.22,1,.36,1),top .7s cubic-bezier(.22,1,.36,1),opacity .3s ease;transform:translate(-14px,-14px);display:block!important;}', '.cg-p{width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,.92);border:2px solid #fff;box-shadow:0 0 25px rgba(255,255,255,.9);display:flex;align-items:center;justify-content:center;position:relative;}', '.cg-ring{position:absolute;inset:-12px;border-radius:50%;background:rgba(34,197,94,.45);box-shadow:0 0 20px rgba(34,197,94,.8);animation:cgP 1.4s infinite;}', '@keyframes cgP{0%{transform:scale(.7);opacity:1}100%{transform:scale(2.2);opacity:0}}', '.cg-pill{position:absolute;left:42px;top:4px;background:#fff;color:#000;font-size:11px;font-weight:700;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;padding:4px 12px;border-radius:999px;white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,.6);border:1px solid rgba(0,0,0,.15);}', '.cg-glow{outline:3px solid #22c55e!important;outline-offset:3px!important;box-shadow:0 0 25px rgba(34,197,94,.85)!important;transition:all .3s!important;}', '#cg-hud{position:fixed;bottom:24px;right:24px;width:380px;max-width:calc(100vw - 32px);background:#09090b;color:#f4f4f5;border:1px solid rgba(255,255,255,.2);border-radius:16px;box-shadow:0 25px 60px rgba(0,0,0,.9),0 0 30px rgba(34,197,94,.2);z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;overflow:hidden;box-sizing:border-box;}', '.cg-h-hdr{padding:12px 16px;background:rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:space-between;cursor:move;user-select:none;}', '.cg-chip{background:rgba(255,255,255,.08);color:#e4e4e7;border:1px solid rgba(255,255,255,.15);padding:5px 10px;border-radius:999px;font-size:11px;font-weight:600;cursor:pointer;transition:all .2s;white-space:nowrap;}', '.cg-chip:hover{background:#fff;color:#000;border-color:#fff;}', '.cg-inp{width:100%;box-sizing:border-box;background:#18181b;border:1px solid rgba(255,255,255,.2);border-radius:8px;padding:8px 12px;color:#fff;font-size:12px;outline:none;}', '.cg-inp:focus{border-color:#22c55e;}', '.cg-btn{cursor:pointer;border:none;border-radius:8px;padding:6px 14px;font-size:11px;font-weight:700;transition:all .2s;display:inline-flex;align-items:center;gap:4px;}', '.cg-btn-pri{background:#fff;color:#000;}', '.cg-btn-pri:hover{background:#e4e4e7;}', '.cg-btn-sec{background:rgba(255,255,255,.1);color:#fff;}', '.cg-btn-sec:hover{background:rgba(255,255,255,.2);}', '.cg-code-box{background:#18181b;border:1px solid rgba(34,197,94,.4);border-radius:8px;padding:8px 12px;font-family:monospace;font-size:11px;color:#4ade80;margin:8px 0;display:flex;align-items:center;justify-content:space-between;}' ].join(''); document.head.appendChild(s); var cur = document.createElement('div'); cur.id = 'cg-cur'; cur.innerHTML = '<div class="cg-ring"></div><div class="cg-p"><svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M3 3l7 18 3-7 7-3L3 3z"/></svg><div class="cg-pill" id="cg-pill">⚡ Choose Problem Area</div></div>'; document.body.appendChild(cur); window.__CG_CUR__ = cur; var hud = document.createElement('div'); hud.id = 'cg-hud'; window.__CG_HUD__ = hud; document.body.appendChild(hud); function makeDraggable() { var hdr = document.getElementById('cg-hud-drag'); if (!hdr) return; hdr.onmousedown = function(e) { if (e.target.tagName === 'BUTTON') return; var startX = e.clientX; var startY = e.clientY; var rect = hud.getBoundingClientRect(); var initX = rect.left; var initY = rect.top; function onMouseMove(ev) { hud.style.left = (initX + (ev.clientX - startX)) + 'px'; hud.style.top = (initY + (ev.clientY - startY)) + 'px'; hud.style.bottom = 'auto'; hud.style.right = 'auto'; } function onMouseUp() { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); } document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp); }; } function clearHighlight() { if (hl) { hl.classList.remove('cg-glow'); hl = null; } } function pointCursor(el, pillText, narration) { clearHighlight(); var pill = document.getElementById('cg-pill'); if (pill) pill.textContent = pillText || '⚡ Click here'; cur.style.display = 'block'; if (!el) { var hudR = hud.getBoundingClientRect(); cur.style.left = Math.max(20, hudR.left + 50) + 'px'; cur.style.top = Math.max(20, hudR.top - 25) + 'px'; if (narration && 'speechSynthesis' in window) { try { window.speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(narration); u.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US'; window.speechSynthesis.speak(u); } catch(e) {} } return; } el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.classList.add('cg-glow'); hl = el; setTimeout(function() { var r = el.getBoundingClientRect(); cur.style.display = 'block'; var targetX = Math.max(16, Math.min(window.innerWidth - 30, r.left + r.width / 2)); var targetY = Math.max(16, Math.min(window.innerHeight - 30, r.top + r.height / 2)); cur.style.left = targetX + 'px'; cur.style.top = targetY + 'px'; }, 200); if (narration && 'speechSynthesis' in window) { try { window.speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(narration); u.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US'; u.rate = 0.95; window.speechSynthesis.speak(u); } catch (err) {} } } function sq(selector) { try { return document.querySelector(selector); } catch(e) { return null; } } function getProblemAreas() { var list = [ { label: '💻 Command Error', q: 'git terminal command error fix' }, { label: '🔢 Calculation Error', q: 'calculation formula math error fix' } ]; if (host.includes('github.com')) { list.push( { label: '⚡ Create Repo', q: 'create new repository' }, { label: '🔀 Pull Request', q: 'open pull request' }, { label: '🍴 Fork Repo', q: 'fork repository' }, { label: '⭐ Star Repo', q: 'star repository' }, { label: '🔍 Search Code', q: 'search repositories' }, { label: '⚙️ Settings', q: 'repository settings' }, { label: '👥 Collaborators', q: 'invite team collaborators' }, { label: '📦 Clone / Download', q: 'clone download repo code' } ); } else if (host.includes('vercel.com')) { list.push( { label: '🚀 Deploy Project', q: 'import and deploy project' }, { label: '🔑 Env Variables', q: 'environment variables' }, { label: '🌐 Domains', q: 'custom domains' } ); } else if (host.includes('linear.app')) { list.push( { label: '➕ New Issue', q: 'create new issue ticket' }, { label: '📋 Active Cycle', q: 'active sprint cycle' }, { label: '🏷️ Labels', q: 'issue labels' } ); } else { list.push( { label: '🔍 Search Site', q: 'search' }, { label: '🔑 Sign In / Sign Up', q: 'sign in login' }, { label: '⚙️ Settings / Profile', q: 'account settings profile' }, { label: '💬 Help & Support', q: 'help contact faq' } ); } return list; } function renderInitialView() { var areas = getProblemAreas(); var chipsHtml = areas.map(function(a){ return '<button class="cg-chip" data-q="' + a.q + '">' + a.label + '</button>'; }).join(''); hud.innerHTML = [ '<div class="cg-h-hdr" id="cg-hud-drag">', '  <div style="display:flex;align-items:center;gap:6px;">', '    <span style="background:#22c55e;color:#000;border-radius:50%;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:900;">⚡</span>', '    <span style="font-weight:700;font-size:12px;letter-spacing:-0.2px;">ClickGuide Copilot</span>', '    <span style="font-size:10px;background:rgba(255,255,255,.1);padding:1px 6px;border-radius:999px;color:#a1a1aa;">' + shortHost + '</span>', '  </div>', '  <div style="display:flex;align-items:center;gap:4px;">', '    <button id="cg-lang-btn" style="background:none;border:none;color:#a1a1aa;cursor:pointer;font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;">' + (currentLang === 'hi' ? 'हिन्दी' : 'EN') + '</button>', '    <button id="cg-x" style="background:none;border:none;color:#71717a;cursor:pointer;font-size:14px;padding:0 4px;">✕</button>', '  </div>', '</div>', '<div style="padding:14px 16px;">', '  <div style="font-size:13px;font-weight:700;margin-bottom:3px;color:#fff;">Choose Area of Problem:</div>', '  <div style="font-size:11px;color:#a1a1aa;margin-bottom:12px;line-height:1.4;">Select a problem area or type your custom error:</div>', '  <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;" id="cg-chips-container">' + chipsHtml + '</div>', '  <div style="display:flex;gap:6px;margin-bottom:6px;">', '    <input id="cg-q-input" class="cg-inp" placeholder="Describe ANY error (e.g. calculation error, git conflict, fork)..." />', '    <button id="cg-solve-btn" class="cg-btn cg-btn-pri" style="shrink:0;">Solve ⚡</button>', '  </div>', '</div>' ].join(''); bindInitialEvents(); makeDraggable(); setTimeout(function() { var hudR = hud.getBoundingClientRect(); cur.style.display = 'block'; cur.style.left = (hudR.left + 50) + 'px'; cur.style.top = Math.max(10, hudR.top - 20) + 'px'; var pill = document.getElementById('cg-pill'); if (pill) pill.textContent = '⚡ Select Problem Area Below'; if ('speechSynthesis' in window) { try { window.speechSynthesis.cancel(); var welcome = new SpeechSynthesisUtterance("Welcome to ClickGuide. Please select your problem area first."); welcome.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US'; welcome.rate = 1.0; window.speechSynthesis.speak(welcome); } catch(e) {} } }, 150); } function bindInitialEvents() { var xBtn = document.getElementById('cg-x'); if (xBtn) xBtn.onclick = function() { clearHighlight(); cur.style.display = 'none'; hud.style.display = 'none'; }; var langBtn = document.getElementById('cg-lang-btn'); if (langBtn) langBtn.onclick = function() { currentLang = currentLang === 'en' ? 'hi' : 'en'; langBtn.textContent = currentLang === 'hi' ? 'हिन्दी' : 'EN'; }; var solveBtn = document.getElementById('cg-solve-btn'); var input = document.getElementById('cg-q-input'); if (solveBtn && input) { solveBtn.onclick = function() { if (input.value.trim()) analyzeProblemAndSolve(input.value.trim()); }; input.onkeydown = function(e) { if (e.key === 'Enter' && input.value.trim()) analyzeProblemAndSolve(input.value.trim()); }; } var chips = document.querySelectorAll('.cg-chip'); chips.forEach(function(c) { c.onclick = function() { var query = c.getAttribute('data-q'); analyzeProblemAndSolve(query); }; }); } function analyzeProblemAndSolve(query) { hud.innerHTML = [ '<div class="cg-h-hdr" id="cg-hud-drag">', '  <div style="display:flex;align-items:center;gap:6px;">', '    <span style="background:#22c55e;color:#000;border-radius:50%;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:900;">⚡</span>', '    <span style="font-weight:700;font-size:12px;">ClickGuide AI Analyzer</span>', '  </div>', '</div>', '<div style="padding:20px;text-align:center;">', '  <div style="font-size:20px;margin-bottom:8px;">🤖</div>', '  <div style="font-size:13px;font-weight:600;color:#fff;margin-bottom:4px;">Analyzing Problem on ' + shortHost + '...</div>', '  <div style="font-size:11px;color:#22c55e;font-family:monospace;">&ldquo;' + query + '&rdquo;</div>', '  <div style="font-size:10px;color:#71717a;margin-top:8px;">Scanning DOM elements & generating live solution flow...</div>', '</div>' ].join(''); makeDraggable(); var pill = document.getElementById('cg-pill'); if (pill) pill.textContent = '🤖 Analyzing...'; setTimeout(function() { var q = query.toLowerCase(); var steps = []; if (q.includes('command') || q.includes('git') || q.includes('terminal') || q.includes('push') || q.includes('pull error') || q.includes('conflict')) { var fixCommand = 'git fetch origin && git pull --rebase origin main && git push'; if (q.includes('push')) fixCommand = 'git push -u origin HEAD --force-with-lease'; if (q.includes('conflict')) fixCommand = 'git status && git merge --abort'; steps.push({ title: "Live Fix: Resolve Git / Command Error", titleHi: "कमांड एरर का लाइव समाधान", narration: "Identified command error. Here is the verified command fix to resolve it cleanly.", narrationHi: "कमांड एरर का लाइव समाधान मिल गया है। टर्मिनल में यह कमांड चलाएं।", pill: "⚡ Click to Copy Command Fix", codeFix: fixCommand, pointToHudCopy: true }); } else if (q.includes('calc') || q.includes('math') || q.includes('number') || q.includes('formula') || q.includes('percentage') || q.includes('nan')) { steps.push({ title: "Live Fix: Calculation & Formula Error", titleHi: "कैलकुलेशन एरर का समाधान", narration: "Identified calculation error. The corrected precision formula has been generated to fix the discrepancy.", narrationHi: "कैलकुलेशन का सही फार्मूला तैयार कर दिया गया है।", pill: "⚡ Click to Copy Calculation Fix", codeFix: 'const corrected = Math.round(((value - min) / (max - min || 1)) * 100);', pointToHudCopy: true }); } else if (host.includes('github.com')) { if (q.includes('repo') || q.includes('create') || q.includes('new')) { steps.push({ title: "Click 'New' repository button", titleHi: "'New' बटन पर क्लिक करें", narration: "Click the green 'New' button to create your repository.", narrationHi: "नया प्रोजेक्ट बनाने के लिए हरे 'New' बटन पर क्लिक करें।", pill: "⚡ Click 'New' Repo", selector: 'a[href="/new"], a[href*="/new"], button[aria-label*="Create"], a[aria-label*="Create"], .Header-item a[href="/new"]', fallbackText: 'New' }); } else if (q.includes('pr') || q.includes('pull')) { steps.push({ title: "Open 'Pull requests' tab", titleHi: "'Pull requests' टैब खोलें", narration: "Click the Pull Requests tab to view active proposals or create a new PR.", narrationHi: "'Pull requests' टैब पर क्लिक करें।", pill: "⚡ Click Pull Requests", selector: 'a[href*="pulls"], [data-tab-item="pull-requests"], a[data-testid*="pr"], a#pull-requests-tab', fallbackText: 'Pull request' }); } else if (q.includes('fork')) { steps.push({ title: "Click 'Fork' button", titleHi: "'Fork' बटन पर क्लिक करें", narration: "Click the Fork button to create your personal copy of this repository.", narrationHi: "इस प्रोजेक्ट की कॉपी बनाने के लिए 'Fork' बटन पर क्लिक करें।", pill: "⚡ Click Fork", selector: 'a[href*="/fork"], button[aria-label*="fork" i], button.fork-button, #fork-button, a[data-hydro-click*="fork"]', fallbackText: 'Fork' }); } else if (q.includes('star') || q.includes('watch')) { steps.push({ title: "Click 'Star' button", titleHi: "'Star' बटन पर क्लिक करें", narration: "Click Star to bookmark and save this repository to your profile.", narrationHi: "इस प्रोजेक्ट को बुकमार्क करने के लिए 'Star' पर क्लिक करें।", pill: "⚡ Click Star", selector: 'button[aria-label*="star" i], a[href*="/star"], button.starring-container', fallbackText: 'Star' }); } else if (q.includes('setting')) { steps.push({ title: "Go to Repository Settings", titleHi: "सेटिंग्स खोलें", narration: "Click the Settings tab to configure repository visibility, branches, and webhooks.", narrationHi: "रिपॉजिटरी की सेटिंग्स बदलने के लिए यहाँ क्लिक करें।", pill: "⚡ Click Settings", selector: 'a[href*="/settings"], a#settings-tab, [data-tab-item="settings"]', fallbackText: 'Settings' }); } else if (q.includes('collab') || q.includes('member') || q.includes('invite') || q.includes('team')) { steps.push({ title: "Navigate to Collaborators & Access", titleHi: "मेंबर्स और एक्सेस सेटिंग्स खोलें", narration: "Click Settings to manage team collaborators and repository access.", narrationHi: "टीम मेंबर्स को इनवाइट करने के लिए सेटिंग्स पर क्लिक करें।", pill: "⚡ Click Settings", selector: 'a[href*="/settings"], a#settings-tab', fallbackText: 'Settings' }); } else if (q.includes('code') || q.includes('clone') || q.includes('download')) { steps.push({ title: "Click 'Code' dropdown to Clone", titleHi: "'Code' बटन पर क्लिक करें", narration: "Click the green Code button to copy the Git URL or download ZIP.", narrationHi: "Git URL कॉपी करने के लिए 'Code' बटन पर क्लिक करें।", pill: "⚡ Click Code", selector: 'button.get-repo-btn, summary.btn-primary, [data-testid="get-repo-btn"]', fallbackText: 'Code' }); } } if (steps.length === 0) { if (q.includes('search')) { steps.push({ title: "Open Search Bar", titleHi: "सर्च बार खोलें", narration: "Click the search bar to query anything on this page.", narrationHi: "यहाँ सर्च बार पर क्लिक करें।", pill: "⚡ Click Search", selector: 'input[name="q"], input[type="search"], input[placeholder*="search" i], button[aria-label*="search" i]', fallbackText: 'Search' }); } else if (q.includes('sign') || q.includes('login') || q.includes('account')) { steps.push({ title: "Click Sign In / Login", titleHi: "लॉगिन बटन पर क्लिक करें", narration: "Click here to sign in or access your account.", narrationHi: "अपने अकाउंट में लॉगिन करने के लिए यहाँ क्लिक करें।", pill: "⚡ Click Sign In", selector: 'a[href*="login"], a[href*="signin"], [data-testid*="login"], #login, button[aria-label*="Sign in" i]', fallbackText: 'Sign in' }); } else { var allInteractive = Array.from(document.querySelectorAll('a, button, input, summary, [role="button"]')); var words = q.split(/\s+/).filter(function(w){ return w.length > 2; }); var bestEl = null; var bestScore = 0; allInteractive.forEach(function(el) { if (el.closest('#cg-hud') || el.closest('#cg-cur')) return; var text = (el.textContent || '').toLowerCase(); var aria = (el.getAttribute('aria-label') || '').toLowerCase(); var title = (el.getAttribute('title') || '').toLowerCase(); var href = (el.getAttribute('href') || '').toLowerCase(); var score = 0; words.forEach(function(w) { if (text.includes(w)) score += 3; if (aria.includes(w)) score += 4; if (title.includes(w)) score += 2; if (href.includes(w)) score += 1; }); if (score > bestScore && el.offsetParent !== null) { bestScore = score; bestEl = el; } }); if (bestEl) { var label = (bestEl.textContent || bestEl.getAttribute('aria-label') || 'Target').trim().slice(0, 25); steps.push({ title: "Click '" + label + "'", titleHi: "'" + label + "' पर क्लिक करें", narration: "Click the highlighted '" + label + "' element to resolve your task.", narrationHi: "अपनी समस्या हल करने के लिए हाइलाइट किए गए बटन पर क्लिक करें।", pill: "⚡ Click " + label, targetElement: bestEl }); } else { steps.push({ title: "Primary Action on " + shortHost, titleHi: "मुख्य एक्शन पर क्लिक करें", narration: "Click the primary button to get started with " + query + ".", narrationHi: "आगे बढ़ने के लिए इस बटन पर क्लिक करें।", pill: "⚡ Click Here", selector: 'a.btn-primary, button.btn-primary, a[href*="new"], button[type="submit"]', fallbackText: 'New' }); } } } activeSolution = { query: query, steps: steps }; currentStepIdx = 0; renderSolutionStep(); }, 450); } function renderSolutionStep() { if (!activeSolution || !activeSolution.steps.length) return; var step = activeSolution.steps[currentStepIdx]; var title = currentLang === 'hi' ? (step.titleHi || step.title) : step.title; var narration = currentLang === 'hi' ? (step.narrationHi || step.narration) : step.narration; var codeBoxHtml = ''; if (step.codeFix) { codeBoxHtml = [ '<div class="cg-code-box">', '  <span id="cg-code-text" style="word-break:break-all;">' + step.codeFix + '</span>', '  <button id="cg-copy-code-btn" style="background:#22c55e;color:#000;border:none;border-radius:4px;padding:4px 10px;font-size:10px;font-weight:700;cursor:pointer;shrink:0;margin-left:8px;">Copy 📋</button>', '</div>' ].join(''); } hud.innerHTML = [ '<div class="cg-h-hdr" id="cg-hud-drag">', '  <div style="display:flex;align-items:center;gap:6px;">', '    <span style="background:#22c55e;color:#000;border-radius:50%;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:900;">✓</span>', '    <span style="font-weight:700;font-size:12px;">Live Solution Active</span>', '  </div>', '  <div style="display:flex;align-items:center;gap:4px;">', '    <button id="cg-sol-back" style="background:rgba(255,255,255,.1);border:none;color:#fff;cursor:pointer;font-size:10px;font-weight:600;padding:3px 8px;border-radius:6px;">↺ Ask Another</button>', '    <button id="cg-x" style="background:none;border:none;color:#71717a;cursor:pointer;font-size:14px;padding:0 4px;">✕</button>', '  </div>', '</div>', '<div style="padding:14px 16px;">', '  <div style="font-size:11px;color:#a1a1aa;margin-bottom:6px;">Problem: <span style="color:#fff;font-weight:600;">&ldquo;' + activeSolution.query + '&rdquo;</span></div>', '  <div style="background:#18181b;border-left:3px solid #22c55e;border-radius:6px;padding:10px 12px;margin-bottom:10px;">', '    <div style="font-size:12px;font-weight:700;color:#22c55e;margin-bottom:4px;">' + title + '</div>', '    <div style="font-size:11px;color:#d4d4d8;line-height:1.4;">' + narration + '</div>', '    ' + codeBoxHtml, '  </div>', '  <div style="display:flex;justify-content:space-between;align-items:center;">', '    <span style="font-size:10px;color:#71717a;">Step ' + (currentStepIdx + 1) + ' of ' + activeSolution.steps.length + '</span>', '    <div style="display:flex;gap:6px;">', '      <button id="cg-replay-btn" class="cg-btn cg-btn-sec">🔊 Speak</button>', '      <button id="cg-done-btn" class="cg-btn cg-btn-pri">Complete 🎉</button>', '    </div>', '  </div>', '</div>' ].join(''); makeDraggable(); var copyBtn = document.getElementById('cg-copy-code-btn'); if (copyBtn && step.codeFix) { copyBtn.onclick = function() { if (navigator.clipboard) { navigator.clipboard.writeText(step.codeFix); copyBtn.textContent = '✓ Copied!'; var pill = document.getElementById('cg-pill'); if (pill) pill.textContent = '✓ Fix Copied to Clipboard!'; setTimeout(function(){ copyBtn.textContent = 'Copy 📋'; }, 2000); } }; } var target = null; if (step.pointToHudCopy && copyBtn) { target = copyBtn; } else { if (step.targetElement) target = step.targetElement; else if (step.selector) target = sq(step.selector); if (!target && step.fallbackText) { var all = Array.from(document.querySelectorAll('a, button, input, [role="button"]')); target = all.find(function(e){ return e.textContent && e.textContent.toLowerCase().includes(step.fallbackText.toLowerCase()); }); } if (!target) target = sq('a.btn-primary, button.btn-primary, a[href*="new"], a, button'); } pointCursor(target, step.pill, narration); document.getElementById('cg-x').onclick = function() { clearHighlight(); cur.style.display = 'none'; hud.style.display = 'none'; }; document.getElementById('cg-sol-back').onclick = function() { clearHighlight(); renderInitialView(); }; document.getElementById('cg-replay-btn').onclick = function() { pointCursor(target, step.pill, narration); }; document.getElementById('cg-done-btn').onclick = function() { clearHighlight(); hud.innerHTML = [ '<div class="cg-h-hdr" id="cg-hud-drag"><span style="font-weight:700;font-size:12px;">🎉 Solution Complete!</span><button id="cg-x" style="background:none;border:none;color:#aaa;cursor:pointer;">✕</button></div>', '<div style="padding:20px;text-align:center;">', '  <div style="font-size:24px;margin-bottom:8px;">🏆</div>', '  <div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:6px;">Task Resolved Successfully!</div>', '  <div style="font-size:11px;color:#a1a1aa;margin-bottom:14px;">ClickGuide guided you live on ' + shortHost + '.</div>', '  <button id="cg-another-btn" class="cg-btn cg-btn-pri">Solve Another Problem ⚡</button>', '</div>' ].join(''); makeDraggable(); document.getElementById('cg-x').onclick = function(){ cur.style.display = 'none'; hud.style.display = 'none'; }; document.getElementById('cg-another-btn').onclick = renderInitialView; }; } function ensureMounted() { if (!document.getElementById('cg-hud') || !document.getElementById('cg-cur')) { if (document.body) { if (!document.getElementById('cg-styles')) document.head.appendChild(s); if (!document.getElementById('cg-cur')) document.body.appendChild(cur); if (!document.getElementById('cg-hud')) document.body.appendChild(hud); renderInitialView(); } } } window.addEventListener('turbo:load', ensureMounted); window.addEventListener('pjax:end', ensureMounted); window.addEventListener('popstate', ensureMounted); renderInitialView(); })();`;

  const copyBookmarkletCode = () => {
    navigator.clipboard.writeText(selfContainedBookmarklet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Filtered Quests
  const filteredQuests =
    selectedPlatform === 'all'
      ? PREBUILT_QUESTS
      : PREBUILT_QUESTS.filter((q) => q.platform === selectedPlatform);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Web App Modal Surface */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-5xl bg-zinc-950 border border-white/20 rounded-2xl shadow-2xl z-10 text-foreground overflow-hidden flex flex-col my-auto max-h-[96vh]"
          >
            {/* Top Bar Header */}
            <div className="p-3.5 sm:p-4 border-b border-white/10 bg-black/60 flex flex-wrap items-center justify-between gap-3">
              {/* Brand and Status */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center bg-white/10">
                  <Zap className="w-4 h-4 text-white fill-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm sm:text-base text-white tracking-tight">ClickGuide</span>
                    <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Practical Solution
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-mono hidden sm:block">
                    AI Virtual Cursor &bull; Works on GitHub, Linear, Vercel, Notion &amp; Any Real Website
                  </p>
                </div>
              </div>

              {/* Mode Tabs: In-App Simulator vs Run on Real Websites */}
              <div className="flex items-center liquid-glass rounded-full p-1 border border-white/15 text-xs">
                <button
                  onClick={() => setActiveTab('simulator')}
                  className={`px-3 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'simulator'
                      ? 'bg-white text-black font-semibold shadow-md'
                      : 'text-muted-foreground hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>In-App Simulator</span>
                </button>
                <button
                  onClick={() => setActiveTab('real-website')}
                  className={`px-3 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'real-website'
                      ? 'bg-white text-black font-semibold shadow-md'
                      : 'text-muted-foreground hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Use on Real Websites</span>
                </button>
              </div>

              {/* Top Controls */}
              <div className="flex items-center gap-2">
                {/* Language Toggle */}
                <div className="flex items-center liquid-glass rounded-full p-0.5 border border-white/15 text-xs">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-0.5 rounded-full font-mono transition-all ${
                      language === 'en' ? 'bg-white text-black font-semibold' : 'text-muted-foreground hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage('hi')}
                    className={`px-2 py-0.5 rounded-full font-mono transition-all ${
                      language === 'hi' ? 'bg-white text-black font-semibold' : 'text-muted-foreground hover:text-white'
                    }`}
                  >
                    हिन्दी
                  </button>
                </div>

                {/* Voice Narration */}
                <button
                  onClick={() => {
                    const next = !soundEnabled;
                    setSoundEnabled(next);
                    if (next) {
                      const text = language === 'hi' ? currentStep.narrationHi : currentStep.narrationEn;
                      speakStep(text, language);
                    }
                  }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center liquid-glass transition-colors ${
                    soundEnabled ? 'text-white border-white/50' : 'text-muted-foreground'
                  }`}
                  title={soundEnabled ? 'Mute voice' : 'Enable voice'}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-full flex items-center justify-center liquid-glass text-muted-foreground hover:text-white transition-colors cursor-pointer"
                  title="Close Web App"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* TAB 1: IN-APP LIVE SOLUTION SIMULATOR */}
            {activeTab === 'simulator' && (
              <>
                {/* Natural Language Problem Description Bar */}
                <div className="p-3 bg-black/40 border-b border-white/10 flex flex-col gap-2">
                  <div className="flex flex-col md:flex-row items-center gap-3">
                    <form onSubmit={handleProblemSubmit} className="flex-1 w-full flex items-center gap-2.5 liquid-glass rounded-full px-4 py-2 border border-white/20 focus-within:border-white/50 transition-colors">
                      <Search className="w-4 h-4 text-white/60 shrink-0" />
                      <input
                        type="text"
                        value={problemQuery}
                        onChange={(e) => setProblemQuery(e.target.value)}
                        placeholder="Describe ANY problem (e.g. 'how to invite team members', 'deploy next.js app', 'create bug ticket')..."
                        className="bg-transparent border-none outline-none text-xs sm:text-sm text-white placeholder:text-muted-foreground w-full font-normal"
                      />
                      <button
                        type="submit"
                        disabled={isFindingSolution}
                        className="bg-white text-black text-xs font-semibold px-4 py-1.5 rounded-full shrink-0 hover:bg-white/90 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-black" />
                        <span>{isFindingSolution ? 'Finding Solution...' : 'Find Live Solution'}</span>
                      </button>
                    </form>

                    {/* Platform Filter Buttons */}
                    <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                      <span className="text-[11px] font-mono text-muted-foreground uppercase mr-1 hidden lg:inline">Sites:</span>
                      {(['all', 'github', 'linear', 'vercel', 'notion'] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setSelectedPlatform(p)}
                          className={`text-xs px-2.5 py-1 rounded-full font-mono transition-all capitalize cursor-pointer ${
                            selectedPlatform === p
                              ? 'bg-white/20 text-white font-semibold border border-white/30'
                              : 'liquid-glass text-muted-foreground hover:text-white'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Finding Solution Animation Banner */}
                  <AnimatePresence>
                    {isFindingSolution && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-mono flex items-center justify-between overflow-hidden"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                          <span className="truncate">{findingMessage}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0 hidden sm:inline">Synthesizing live cursor pathway...</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Suggested Problem Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-0.5">
                    <span className="text-muted-foreground font-mono">Quick Problems:</span>
                    {[
                      { text: 'Fix Terminal / Git command error', label: '💻 Command Error' },
                      { text: 'Fix Calculation & formula error', label: '🔢 Calculation Error' },
                      { text: 'Create my first repository', label: 'GitHub: New Repo' },
                      { text: 'Open my first pull request', label: 'GitHub: Open PR' },
                      { text: 'Deploy Git project on Vercel', label: 'Vercel: Deploy' },
                      { text: 'Create issue & assign sprint on Linear', label: 'Linear: Sprint Issue' },
                      { text: 'Build a Kanban Database on Notion', label: 'Notion: Kanban' },
                    ].map((chip) => (
                      <button
                        key={chip.label}
                        onClick={() => {
                          setProblemQuery(chip.text);
                          setIsFindingSolution(true);
                          setFindingMessage(`⚡ ClickGuide AI analyzing: "${chip.text}"...`);
                          setTimeout(() => {
                            const solved = solveCustomProblem(chip.text);
                            setActiveQuest(solved);
                            setCurrentStepIndex(0);
                            setIsFindingSolution(false);
                            setIsPlaying(true);
                          }, 650);
                        }}
                        className="px-2.5 py-0.5 rounded-full liquid-glass text-muted-foreground hover:text-white hover:border-white/30 transition-all cursor-pointer font-mono"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Task Selection Ribbon */}
                <div className="px-4 py-2 bg-black/30 border-b border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-mono text-muted-foreground uppercase mr-1">Walkthroughs:</span>
                    {filteredQuests.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => handleQuestSelect(q)}
                        className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                          activeQuest.id === q.id
                            ? 'bg-white text-black shadow-md'
                            : 'liquid-glass text-muted-foreground hover:text-white hover:border-white/30'
                        }`}
                      >
                        {language === 'hi' ? q.titleHi : q.title}
                      </button>
                    ))}
                  </div>

                  {/* Mode Toggle: Auto Cursor vs Interactive Click */}
                  <button
                    onClick={() => setPracticeMode(!practiceMode)}
                    className={`text-[11px] font-mono px-2.5 py-1 rounded-full border transition-all ${
                      practiceMode
                        ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                        : 'border-white/20 text-muted-foreground hover:text-white'
                    }`}
                  >
                    {practiceMode ? 'Mode: Interactive Click' : 'Mode: Auto-Guide Cursor'}
                  </button>
                </div>

                {/* Simulated Live Interface Surface for Selected Website */}
                <div className="relative w-full bg-[#0d1117] min-h-[380px] sm:min-h-[420px] p-4 sm:p-7 font-sans select-none overflow-hidden border-b border-white/10 flex-1">
                  {/* Platform Header Ribbon */}
                  <div className="w-full flex items-center justify-between pb-3.5 border-b border-[#30363d] text-xs text-[#c9d1d9] mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center font-bold text-white text-[11px]">
                        {activeQuest.platform === 'github' && <FolderGit2 className="w-3.5 h-3.5 text-white" />}
                        {activeQuest.platform === 'linear' && 'L'}
                        {activeQuest.platform === 'vercel' && '▲'}
                        {activeQuest.platform === 'notion' && 'N'}
                        {activeQuest.platform === 'custom' && <Globe className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className="font-semibold text-white">
                        {activeQuest.platform === 'github' && 'github.com'}
                        {activeQuest.platform === 'linear' && 'linear.app'}
                        {activeQuest.platform === 'vercel' && 'vercel.com'}
                        {activeQuest.platform === 'notion' && 'notion.so'}
                        {activeQuest.platform === 'custom' && 'live-app.com'}
                      </span>
                      <span className="text-[#8b949e] hidden sm:inline">
                        / workspace / {activeQuest.id}
                      </span>
                    </div>

                    {/* Action Header Target Elements */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* GitHub Buttons */}
                      {activeQuest.platform === 'github' && (
                        <>
                          <div
                            id="btn-new"
                            onClick={() => handleTargetClick('btn-new')}
                            className={`px-3 py-1 rounded-md font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                              currentStep.targetId === 'btn-new'
                                ? 'bg-[#238636] text-white ring-4 ring-white/90 ring-offset-2 ring-offset-black scale-105 shadow-[0_0_25px_rgba(35,134,54,0.7)] animate-pulse'
                                : 'bg-[#238636] text-white opacity-80'
                            }`}
                          >
                            <span>+ New</span>
                          </div>
                          <div
                            id="btn-fork"
                            onClick={() => handleTargetClick('btn-fork')}
                            className={`px-3 py-1 rounded-md border text-xs transition-all flex items-center gap-1 cursor-pointer ${
                              currentStep.targetId === 'btn-fork'
                                ? 'bg-[#21262d] border-white text-white ring-4 ring-white/90 ring-offset-2 ring-offset-black scale-105 shadow-[0_0_25px_rgba(255,255,255,0.6)] animate-pulse'
                                : 'bg-[#21262d] border-[#30363d] text-[#c9d1d9]'
                            }`}
                          >
                            <GitBranch className="w-3 h-3" />
                            <span>Fork</span>
                          </div>
                        </>
                      )}

                      {/* Linear Buttons */}
                      {activeQuest.platform === 'linear' && (
                        <div
                          id="btn-lin-new"
                          onClick={() => handleTargetClick('btn-lin-new')}
                          className={`px-3.5 py-1 rounded-md font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                            currentStep.targetId === 'btn-lin-new'
                              ? 'bg-blue-600 text-white ring-4 ring-white/90 scale-105 shadow-[0_0_25px_rgba(59,130,246,0.7)] animate-pulse'
                              : 'bg-blue-600/80 text-white'
                          }`}
                        >
                          <span>+ New Issue</span>
                        </div>
                      )}

                      {/* Vercel Buttons */}
                      {activeQuest.platform === 'vercel' && (
                        <div
                          id="btn-ver-import"
                          onClick={() => handleTargetClick('btn-ver-import')}
                          className={`px-3.5 py-1 rounded-md font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                            currentStep.targetId === 'btn-ver-import'
                              ? 'bg-white text-black ring-4 ring-white/90 scale-105 shadow-[0_0_25px_rgba(255,255,255,0.8)] animate-pulse'
                              : 'bg-white/80 text-black'
                          }`}
                        >
                          <span>Import Git Repo</span>
                        </div>
                      )}

                      {/* Notion Buttons */}
                      {activeQuest.platform === 'notion' && (
                        <div
                          id="btn-not-new"
                          onClick={() => handleTargetClick('btn-not-new')}
                          className={`px-3 py-1 rounded-md font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                            currentStep.targetId === 'btn-not-new'
                              ? 'bg-white text-black ring-4 ring-white/90 scale-105 shadow-[0_0_25px_rgba(255,255,255,0.8)] animate-pulse'
                              : 'bg-white/10 text-white'
                          }`}
                        >
                          <span>+ New Page</span>
                        </div>
                      )}

                      {/* Custom Problem Action */}
                      {activeQuest.platform === 'custom' && (
                        <div
                          id="btn-cust-action-1"
                          onClick={() => handleTargetClick('btn-cust-action-1')}
                          className={`px-3 py-1 rounded-md font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                            currentStep.targetId === 'btn-cust-action-1'
                              ? 'bg-emerald-500 text-black ring-4 ring-white/90 scale-105 shadow-[0_0_25px_rgba(34,197,94,0.8)] animate-pulse'
                              : 'bg-white/20 text-white'
                          }`}
                        >
                          <span>⚡ Primary Action</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sub-bar / Navigation Tabs */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3 sm:gap-4 text-xs text-[#8b949e]">
                      <span className="text-white font-medium border-b-2 border-[#f78166] pb-1">
                        {activeQuest.platform === 'github' && 'Code'}
                        {activeQuest.platform === 'linear' && 'Active Sprint Cycle'}
                        {activeQuest.platform === 'vercel' && 'Deployments & Analytics'}
                        {activeQuest.platform === 'notion' && 'Product Roadmap Database'}
                        {activeQuest.platform === 'custom' && 'Solution Overview'}
                      </span>
                      <span>Overview</span>
                      <span>Settings</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        id="btn-compare"
                        onClick={() => handleTargetClick('btn-compare')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all cursor-pointer ${
                          currentStep.targetId === 'btn-compare'
                            ? 'bg-white text-black border-white ring-4 ring-white/90 scale-105 shadow-[0_0_25px_rgba(255,255,255,0.6)] animate-pulse'
                            : 'bg-[#21262d] border-[#30363d] text-[#c9d1d9]'
                        }`}
                      >
                        <span>Compare &amp; pull request</span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Form / Workspace Area */}
                  <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 sm:p-6 max-w-2xl mx-auto shadow-2xl relative">
                    <div className="text-xs uppercase font-mono text-[#8b949e] mb-4 flex items-center justify-between">
                      <span className="capitalize">{activeQuest.platform} Live Canvas</span>
                      <span className="text-emerald-400 font-sans flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Practical AI Solution Active
                      </span>
                    </div>

                    {/* Input Field (Repo Name / PR Title / Linear Issue / Vercel Env) */}
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-[#c9d1d9] mb-1.5">
                        {activeQuest.platform === 'github' && (activeQuest.id === 'create-repo' ? 'Repository name *' : 'Pull Request Title *')}
                        {activeQuest.platform === 'linear' && 'Issue Title & Description *'}
                        {activeQuest.platform === 'vercel' && 'Environment Key & Value *'}
                        {activeQuest.platform === 'notion' && 'Database View Title *'}
                        {activeQuest.platform === 'custom' && 'Configuration Details *'}
                      </label>
                      <div
                        id="input-name"
                        onClick={() => handleTargetClick(currentStep.targetId)}
                        className={`w-full bg-[#0d1117] border px-3.5 py-2 rounded-md text-xs text-white font-mono flex items-center justify-between transition-all cursor-pointer ${
                          currentStep.targetId.includes('input') || currentStep.targetId.includes('name') || currentStep.targetId.includes('title') || currentStep.targetId.includes('env')
                            ? 'border-white ring-4 ring-white/80 scale-[1.01] shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                            : 'border-[#30363d]'
                        }`}
                      >
                        <span className="flex items-center gap-1 truncate max-w-md">
                          {currentStep.typedValue ? currentStep.typedValue : activeQuest.title}
                          {(currentStep.targetId.includes('input') || currentStep.targetId.includes('name') || currentStep.targetId.includes('title')) && (
                            <span className="w-1.5 h-4 bg-white animate-pulse inline-block" />
                          )}
                        </span>
                        <span className="text-emerald-400 text-[10px] shrink-0">✓ Validated</span>
                      </div>
                    </div>

                    {/* Intermediate Options (Public Radio / Assignee / README / Template) */}
                    <div
                      id="radio-public"
                      onClick={() => handleTargetClick('radio-public')}
                      className={`p-2.5 rounded-lg border mb-3.5 flex items-start gap-3 transition-all cursor-pointer ${
                        currentStep.targetId === 'radio-public' || currentStep.targetId === 'btn-lin-assign' || currentStep.targetId === 'btn-not-board'
                          ? 'border-white bg-white/5 ring-4 ring-white/80 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                          : 'border-[#30363d]/60 bg-[#0d1117]/40'
                      }`}
                    >
                      <input type="radio" checked readOnly className="mt-0.5 accent-white cursor-pointer" />
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {activeQuest.platform === 'github' && 'Public Visibility'}
                          {activeQuest.platform === 'linear' && 'Assignee: Alex Dev • Priority: Urgent'}
                          {activeQuest.platform === 'vercel' && 'Production Branch: main • Auto-Deploy Enabled'}
                          {activeQuest.platform === 'notion' && 'Board View (To Do / In Progress / Done)'}
                          {activeQuest.platform === 'custom' && 'Default Configuration Settings'}
                        </div>
                        <div className="text-[11px] text-[#8b949e]">
                          Verified workflow recommendation for practical execution.
                        </div>
                      </div>
                    </div>

                    {/* Checkbox (README / Auto-Sync) */}
                    <div
                      id="check-readme"
                      onClick={() => handleTargetClick('check-readme')}
                      className={`p-2.5 rounded-lg border mb-4 flex items-start gap-3 transition-all cursor-pointer ${
                        currentStep.targetId === 'check-readme'
                          ? 'border-white bg-white/5 ring-4 ring-white/80 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                          : 'border-[#30363d]/60 bg-[#0d1117]/40'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={currentStepIndex >= 3 || currentStep.targetId === 'check-readme'}
                        readOnly
                        className="mt-0.5 accent-white cursor-pointer"
                      />
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {activeQuest.platform === 'github' && 'Add a README.md file'}
                          {activeQuest.platform === 'linear' && 'Link to GitHub Pull Request automatically'}
                          {activeQuest.platform === 'vercel' && 'Automatically create preview deployments on PRs'}
                          {activeQuest.platform === 'notion' && 'Include default task templates & tags'}
                          {activeQuest.platform === 'custom' && 'Initialize with default documentation'}
                        </div>
                        <div className="text-[11px] text-[#8b949e]">Recommended for high code quality.</div>
                      </div>
                    </div>

                    {/* Bottom Submit Action */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#30363d]">
                      <div className="text-[11px] text-[#8b949e]">
                        Step {currentStepIndex + 1} of {activeQuest.steps.length}
                      </div>

                      <div
                        id="btn-create"
                        onClick={() => handleTargetClick(currentStep.targetId)}
                        className={`px-4 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                          currentStep.targetId.includes('submit') || currentStep.targetId.includes('create') || currentStep.targetId.includes('deploy') || currentStep.targetId.includes('card') || currentStep.targetId.includes('confirm')
                            ? 'bg-white text-black ring-4 ring-white/90 ring-offset-2 ring-offset-black scale-105 shadow-[0_0_30px_rgba(255,255,255,0.7)] animate-pulse'
                            : 'bg-[#238636] text-white opacity-85'
                        }`}
                      >
                        {activeQuest.platform === 'github' && 'Create repository'}
                        {activeQuest.platform === 'linear' && 'Create Issue'}
                        {activeQuest.platform === 'vercel' && 'Deploy to Production'}
                        {activeQuest.platform === 'notion' && 'Add Task Card'}
                        {activeQuest.platform === 'custom' && 'Save & Apply Solution'}
                      </div>
                    </div>
                  </div>

                  {/* ========================================================= */}
                  {/* THE NEW CLICKGUIDE VIRTUAL GHOST CURSOR ICON & SPOTLIGHT  */}
                  {/* ========================================================= */}
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
                    <div className="relative">
                      {/* Spotlight Halo Beam */}
                      <span className="absolute -inset-6 rounded-full bg-white/20 blur-md animate-pulse" />
                      <span className="absolute -inset-3 rounded-full bg-white/30 animate-ping" />

                      {/* Click Ripple Effect */}
                      {isClicking && (
                        <motion.span
                          initial={{ scale: 0.5, opacity: 1 }}
                          animate={{ scale: 2.2, opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="absolute -inset-4 rounded-full border-2 border-emerald-400 bg-emerald-400/30"
                        />
                      )}

                      {/* THE CURSOR ICON (Distinctive High-Tech Ghost Cursor) */}
                      <div className="relative flex items-center">
                        <div className="w-8 h-8 rounded-full bg-black/80 border border-white/60 shadow-[0_0_20px_rgba(255,255,255,0.8)] flex items-center justify-center backdrop-blur-sm">
                          <MousePointer className="w-4 h-4 text-white fill-white transform -rotate-12" />
                        </div>

                        {/* Floating Step Action Pill Attached to Cursor */}
                        <motion.div
                          key={currentStep.actionText}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 8 }}
                          transition={{ duration: 0.3 }}
                          className="ml-2 bg-white text-black text-[11px] font-bold px-3 py-1 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.8)] flex items-center gap-1.5 whitespace-nowrap border border-black/20"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-black" />
                          <span>{currentStep.actionText}</span>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Completion Celebration Overlay */}
                  {questFinished && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 bg-black/85 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-6 text-center"
                    >
                      <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mb-4 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">Practical Solution Complete!</h4>
                      <p className="text-sm text-muted-foreground max-w-md mb-6">
                        You successfully resolved &ldquo;{activeQuest.title}&rdquo; with ClickGuide&apos;s AI Virtual Cursor guidance.
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setQuestFinished(false);
                            setCurrentStepIndex(0);
                            setIsPlaying(true);
                          }}
                          className="bg-white text-black font-semibold px-5 py-2.5 rounded-lg text-xs flex items-center gap-2 hover:bg-white/90 transition-all cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Replay Solution
                        </button>
                        <button
                          onClick={() => setActiveTab('real-website')}
                          className="liquid-glass text-white font-medium px-5 py-2.5 rounded-lg text-xs flex items-center gap-2 hover:border-white/40 transition-all cursor-pointer"
                        >
                          <Globe className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Run on Real Website</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Bottom Subtitle & Step Narration Bar */}
                <div className="p-4 sm:p-5 bg-black/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center shrink-0 text-white font-mono text-xs font-semibold bg-white/5">
                      0{currentStepIndex + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                          Practical Step &bull; {language === 'en' ? 'English' : 'हिन्दी'}
                        </span>
                        {soundEnabled && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Live Voice Audio
                          </span>
                        )}
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={`${activeQuest.id}-${currentStepIndex}-${language}`}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="text-sm sm:text-base font-medium text-white max-w-2xl leading-relaxed"
                        >
                          {language === 'hi' ? currentStep.narrationHi : currentStep.narrationEn}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Step Navigation Controls */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentStepIndex === 0}
                      className="w-8 h-8 rounded-full flex items-center justify-center liquid-glass text-muted-foreground hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
                      title="Previous Step"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-8 h-8 rounded-full flex items-center justify-center liquid-glass text-white hover:border-white/50 transition-colors cursor-pointer"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <span className="w-2.5 h-2.5 bg-white rounded-xs" /> : <Play className="w-3 h-3 ml-0.5 fill-current" />}
                    </button>

                    <button
                      onClick={() => {
                        if (currentStepIndex + 1 < activeQuest.steps.length) {
                          setCurrentStepIndex((prev) => prev + 1);
                        } else {
                          setQuestFinished(true);
                        }
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center liquid-glass text-muted-foreground hover:text-white transition-colors cursor-pointer"
                      title="Next Step"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setCurrentStepIndex(0);
                        setQuestFinished(false);
                        setIsPlaying(true);
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center liquid-glass text-muted-foreground hover:text-white transition-colors cursor-pointer"
                      title="Restart"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: USE CLICKGUIDE ON REAL WEBSITES (BOOKMARKLET & INJECTOR) */}
            {activeTab === 'real-website' && (
              <div className="p-6 md:p-8 bg-zinc-950 overflow-y-auto space-y-6">
                <div className="max-w-3xl mx-auto space-y-6">
                  {/* Hero Box */}
                  <div className="liquid-glass rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          Run the ClickGuide Virtual Cursor on ANY Live Website
                        </h3>
                        <p className="text-xs text-muted-foreground font-mono">
                          Zero Installation &bull; Works on Real GitHub, Linear, Notion, Vercel &amp; Beyond
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      You can summon the ClickGuide AI Virtual Cursor directly on real websites. The ghost cursor will physically glide across the real webpage, point to live buttons, highlight inputs, and narrate solutions in real time.
                    </p>
                  </div>

                  {/* Method 1: Drag to Bookmarks (One-Click Bookmarklet) */}
                  <div className="liquid-glass rounded-2xl p-6 border border-white/15 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center text-xs font-mono font-bold">1</span>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                          Method 1: One-Click Bookmarklet (Instant)
                        </h4>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-mono">Easiest Method</span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Drag this button to your browser&apos;s Bookmarks bar (<kbd className="bg-white/10 px-1 py-0.5 rounded text-white font-mono">Ctrl+Shift+B</kbd>).
                    </p>

                    {/* Notice for Brave / Chrome drag-and-drop security */}
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 text-xs flex flex-col gap-2">
                      <div className="flex items-center gap-2 font-semibold text-amber-400">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Seeing &quot;about:blank#blocked&quot; after clicking the dragged bookmark?</span>
                      </div>
                      <p className="text-[11px] text-zinc-300 leading-relaxed">
                        Brave and Chromium browsers block dragging script links directly for security and replace the URL with <code className="bg-black/60 px-1.5 py-0.5 rounded text-amber-300">about:blank#blocked</code>.
                      </p>
                      <div className="text-[11px] text-zinc-200 space-y-1">
                        <div><strong>1.</strong> Click <span className="text-emerald-400 font-semibold">&ldquo;Copy Bookmarklet Code&rdquo;</span> below.</div>
                        <div><strong>2.</strong> Right-click your bookmark <span className="text-white font-mono bg-white/10 px-1.5 py-0.5 rounded">⚡ Drag Me: ClickGuide...</span> in the bookmarks bar &rarr; click <strong>Edit</strong>.</div>
                        <div><strong>3.</strong> In the <strong>URL</strong> field, delete <code className="text-red-400">about:blank#blocked</code>, paste the copied code, and click <strong>Save</strong>!</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <a
                        href={selfContainedBookmarklet}
                        onClick={(e) => {
                          e.preventDefault();
                          alert('Drag this button to your browser Bookmarks Bar (Ctrl+Shift+B), or copy the code below and paste it into the bookmark URL!');
                        }}
                        className="bg-white text-black font-bold px-5 py-3 rounded-full text-xs flex items-center gap-2 hover:bg-white/90 shadow-xl cursor-grab active:cursor-grabbing"
                        title="Drag me to your Bookmarks Bar!"
                      >
                        <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                        <span>⚡ Drag Me: ClickGuide Copilot</span>
                      </a>

                      <button
                        onClick={copyBookmarkletCode}
                        className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-3 rounded-full text-xs flex items-center gap-2 cursor-pointer transition-all shadow-xl"
                      >
                        {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode ? '✓ Copied Bookmarklet Code!' : 'Copy Bookmarklet Code'}</span>
                      </button>

                      <button
                        onClick={() => {
                          try {
                            const raw = selfContainedBookmarklet.replace(/^javascript:/, '');
                            const fn = new Function(decodeURIComponent(raw));
                            fn();
                          } catch (err) {
                            console.error('Bookmarklet execution test:', err);
                          }
                        }}
                        className="liquid-glass border border-white/20 hover:border-white/40 text-white font-medium px-4 py-3 rounded-full text-xs flex items-center gap-2 cursor-pointer transition-colors"
                        title="Test the Virtual Cursor and HUD immediately on your current screen"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Test on This Screen Now</span>
                      </button>
                    </div>
                  </div>

                  {/* Method 2: Browser Developer Tools Console Snippet */}
                  <div className="liquid-glass rounded-2xl p-6 border border-white/15 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center text-xs font-mono font-bold">2</span>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                        Method 2: Run via Browser Console on Any Tab (100% Reliable &amp; Bypasses CSP)
                      </h4>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Open ANY website (e.g. <span className="text-white font-mono">https://github.com/new</span>), press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white font-mono">F12</kbd> (or right-click &rarr; Inspect &rarr; Console), paste this code, and hit Enter:
                    </p>

                    <div className="bg-black/80 rounded-xl p-3.5 border border-white/15 font-mono text-xs text-emerald-400 flex items-center justify-between gap-4 overflow-x-auto">
                      <code className="truncate max-w-xl">
                        {selfContainedBookmarklet.replace(/^javascript:/, '')}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selfContainedBookmarklet.replace(/^javascript:/, ''));
                          setCopiedCode(true);
                          setTimeout(() => setCopiedCode(false), 2000);
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode ? 'Copied Console Code!' : 'Copy Console Code'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Live Verification Try It Now */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setActiveTab('simulator')}
                      className="bg-white text-black font-semibold px-5 py-2.5 rounded-lg text-xs flex items-center gap-2 hover:bg-white/90 transition-all cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Back to In-App Simulator</span>
                    </button>

                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noreferrer"
                      className="liquid-glass text-muted-foreground hover:text-white px-4 py-2.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <span>Open Real GitHub</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
