import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MousePointer } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SearchChanged } from './components/SearchChanged';
import { Mission } from './components/Mission';
import { Solution } from './components/Solution';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { InstallModal } from './components/InstallModal';
import { CommandCenter } from './components/CommandCenter';

export function App() {
  const [isMissionPage, setIsMissionPage] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash.startsWith('#/mission');
    }
    return false;
  });

  useEffect(() => {
    const handleHashChange = () => {
      setIsMissionPage(window.location.hash.startsWith('#/mission'));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<string | undefined>(undefined);

  if (isMissionPage) {
    return <CommandCenter />;
  }

  const handleOpenDemo = (questName?: string) => {
    if (questName) {
      setSelectedQuest(questName);
      setInstallModalOpen(true);
    } else {
      const solutionEl = document.getElementById('solution');
      if (solutionEl) {
        solutionEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOpenInstall = () => {
    setSelectedQuest(undefined);
    setInstallModalOpen(true);
  };

  useEffect(() => {
    const handleOpenLiveSolution = (e: any) => {
      setSelectedQuest(e?.detail?.quest || undefined);
      setInstallModalOpen(true);
    };

    window.addEventListener('clickguide:open-live-solution', handleOpenLiveSolution);
    return () => {
      window.removeEventListener('clickguide:open-live-solution', handleOpenLiveSolution);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans relative selection:bg-white/20 selection:text-white">
      {/* 1. Header Navigation */}
      <Navbar onOpenInstallModal={handleOpenInstall} />

      <main className="w-full">
        {/* 2. Hero Section with Video Background, Avatars, Task Pointers & Waitlist Form */}
        <Hero
          onOpenDemo={handleOpenDemo}
          onOpenInstallModal={handleOpenInstall}
        />

        {/* 3. Search Changed / 3 Platform Cards */}
        <SearchChanged />

        {/* 4. Philosophy & Mission with Word-by-Word Scroll Reveal */}
        <Mission />

        {/* 5. Solution with 3:1 Video, Live Virtual Cursor Simulator & 4 Features */}
        <Solution />

        {/* 6. CTA with Mux Streaming Video & Chrome Install Buttons */}
        <CTA
          onOpenInstallModal={handleOpenInstall}
          onOpenDemo={handleOpenDemo}
        />
      </main>

      {/* 7. Footer */}
      <Footer />

      {/* Floating Live Solution Copilot Widget */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpenInstall}
        className="fixed bottom-6 right-6 z-40 bg-zinc-950/90 text-white border border-white/25 shadow-[0_0_25px_rgba(255,255,255,0.25)] rounded-full px-4 py-2.5 flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md hover:border-white/50 transition-all cursor-pointer group"
        title="Open ClickGuide Live Solution with AI Virtual Cursor"
      >
        <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center shadow-sm">
          <MousePointer className="w-3.5 h-3.5 fill-black transform -rotate-12" />
        </div>
        <span className="tracking-wide">Live Solution</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      </motion.button>

      {/* Live Solution Web App Modal with Virtual Cursor */}
      <InstallModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
        initialQuest={selectedQuest}
      />
    </div>
  );
}

export default App;
