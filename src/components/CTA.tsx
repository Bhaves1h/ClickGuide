import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Hls from 'hls.js';
import { fadeUp } from '../lib/utils';
import { Play, ArrowRight } from 'lucide-react';
import { ExtensionInstallModal } from './ExtensionInstallModal';

interface CTAProps {
  onOpenInstallModal?: () => void;
  onOpenDemo?: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onOpenDemo }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const hlsUrl = 'https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8';

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {
          // Autoplay policy fallback
        });
        setVideoLoaded(true);
      });
      hls.on(Hls.Events.ERROR, () => {
        // Fallback gracefully
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS support
      video.src = hlsUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => {});
        setVideoLoaded(true);
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  return (
    <section
      id="cta"
      className="relative w-full py-32 md:py-44 px-6 sm:px-8 md:px-28 border-t border-border/30 overflow-hidden bg-background flex items-center justify-center"
    >
      {/* Background Video (HLS via hls.js) */}
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        className={`absolute inset-0 w-full h-full object-cover z-0 filter contrast-125 brightness-75 transition-opacity duration-1000 ${
          videoLoaded ? 'opacity-40' : 'opacity-20'
        }`}
      />

      {/* Fallback ambient grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_60%)] pointer-events-none z-0" />

      {/* Overlay: absolute inset-0 bg-background/45 z-[1] */}
      <div className="absolute inset-0 bg-background/55 z-[1] backdrop-blur-[2px]" />

      {/* Content (z-10, centered) */}
      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
        {/* Concentric circles logo icon (w-10 h-10 outer, w-5 h-5 inner) */}
        <motion.div
          {...fadeUp(0.1)}
          className="relative w-10 h-10 rounded-full border-2 border-foreground/60 flex items-center justify-center mb-8 shadow-2xl"
        >
          <div className="w-5 h-5 rounded-full border border-foreground/60" />
        </motion.div>

        {/* Heading: "Start Your Journey" (serif italic on "Journey") */}
        <motion.h2
          {...fadeUp(0.2)}
          className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-foreground mb-6"
        >
          Start Your{' '}
          <span className="font-serif italic font-normal text-white">
            Journey.
          </span>
        </motion.h2>

        {/* Subtitle in text-muted-foreground */}
        <motion.p
          {...fadeUp(0.3)}
          className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed"
        >
          Say goodbye to tutorial tabs and confusing interfaces. Launch ClickGuide directly in your browser and master complex web tools right on the live page.
        </motion.p>

        {/* Two buttons: "Launch Web App" and "Try Live Demo" */}
        <motion.div
          {...fadeUp(0.4)}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsExtensionModalOpen(true)}
            className="w-full sm:w-auto bg-foreground text-background font-semibold rounded-lg px-8 py-3.5 text-sm tracking-wide flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all cursor-pointer"
          >
            <span>Get started &mdash; install the extension</span>
            <ArrowRight className="w-3.5 h-3.5 text-black" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenDemo ? onOpenDemo : () => document.getElementById('solution')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto liquid-glass rounded-lg px-8 py-3.5 text-sm font-medium text-foreground hover:text-white hover:border-white/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Try Interactive Walkthrough</span>
          </motion.button>
        </motion.div>

        {/* Badge below buttons */}
        <motion.div
          {...fadeUp(0.5)}
          className="mt-8 text-xs text-muted-foreground font-mono"
        >
          Works in any modern browser &bull; Manifest V3 &bull; Real DOM Overlay
        </motion.div>
      </div>

      {/* Extension Install Modal */}
      <ExtensionInstallModal
        isOpen={isExtensionModalOpen}
        onClose={() => setIsExtensionModalOpen(false)}
      />
    </section>
  );
};
