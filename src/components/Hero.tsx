import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../lib/utils';

interface HeroProps {
  onOpenDemo?: (taskName?: string) => void;
  onOpenInstallModal?: () => void;
}

export const Hero: React.FC<HeroProps> = () => {
  const [videoError, setVideoError] = useState(false);

  return (
    <section id="home" className="relative w-full flex flex-col items-center justify-center overflow-hidden bg-background py-32 md:py-44">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        {!videoError ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover opacity-60 filter contrast-125 brightness-90"
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4"
              type="video/mp4"
            />
          </video>
        ) : (
          /* Graceful dark animated monochrome mesh fallback */
          <div className="w-full h-full bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.06),transparent_70%)] animate-pulse" />
        )}

        {/* Ambient Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-contrast-125 pointer-events-none" />

        {/* Bottom smooth fade to black: h-64 bg-gradient-to-t from-background to-transparent */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-[1]" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center pt-8">
        
        {/* Avatar row: 3 overlapping circular avatars + '12,000+ Chrome users learning on-screen' */}
        <motion.div
          {...fadeUp(0.1)}
          className="flex items-center gap-3 mb-8 liquid-glass px-4 py-1.5 rounded-full border border-white/10"
        >
          <div className="flex -space-x-2 overflow-hidden items-center">
            <img
              src="/avatar-1.png"
              alt="Community member 1"
              className="inline-block w-8 h-8 rounded-full border-2 border-background object-cover bg-neutral-900"
            />
            <img
              src="/avatar-2.png"
              alt="Community member 2"
              className="inline-block w-8 h-8 rounded-full border-2 border-background object-cover bg-neutral-800"
            />
            <img
              src="/avatar-3.png"
              alt="Community member 3"
              className="inline-block w-8 h-8 rounded-full border-2 border-background object-cover bg-neutral-700"
            />
          </div>
          <span className="text-muted-foreground text-sm font-medium tracking-tight">
            <span className="text-foreground font-semibold">12,000+ Chrome users</span> learning on-screen
          </span>
        </motion.div>

        {/* Heading: text-5xl md:text-7xl lg:text-8xl font-medium tracking-[-2px] */}
        <motion.h1
          {...fadeUp(0.2)}
          className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-[-2px] text-foreground max-w-4xl leading-[1.08] text-balance"
        >
          ChatGPT explains GitHub. ClickGuide{' '}
          <span className="font-serif italic font-normal text-white underline decoration-white/30 underline-offset-8">
            walks
          </span>{' '}
          you through it.
        </motion.h1>

      </div>
    </section>
  );
};
