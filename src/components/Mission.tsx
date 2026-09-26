import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  isHighlight?: boolean;
}

const Word: React.FC<WordProps> = ({ children, progress, range, isHighlight }) => {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const y = useTransform(progress, range, [4, 0]);

  return (
    <span className="relative inline-block mr-2 md:mr-3.5 my-1">
      <motion.span
        style={{ opacity, y }}
        className={`inline-block transition-colors duration-150 ${
          isHighlight
            ? 'text-foreground font-semibold underline decoration-white/30 underline-offset-4'
            : 'text-[hsl(var(--hero-subtitle))] font-medium'
        }`}
      >
        {children}
      </motion.span>
    </span>
  );
};

export const Mission: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoError, setVideoError] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.35'],
  });

  // Paragraph 1 text:
  // "We're building a space where curiosity meets clarity — where all Chrome users find confidence, navigate faster, and every complex web interface becomes effortless to use."
  // Highlights: "curiosity", "meets", "clarity"
  const paragraph1 = "We're building a space where curiosity meets clarity — where all Chrome users find confidence, navigate faster, and every complex web interface becomes effortless to use.";
  const p1Words = paragraph1.split(' ');

  // Paragraph 2 text:
  // "A platform where everyday web users, students, and teams learn together — with less noise, zero tab friction, and bilingual voice clarity for everyone."
  const paragraph2 = "A platform where everyday web users, students, and teams learn together — with less noise, zero tab friction, and bilingual voice clarity for everyone.";
  const p2Words = paragraph2.split(' ');

  const totalWords = p1Words.length + p2Words.length;

  return (
    <section
      id="mission"
      ref={containerRef}
      className="relative w-full pt-0 pb-32 md:pb-44 px-6 sm:px-8 md:px-28 bg-background flex flex-col items-center overflow-hidden"
    >
      {/* Centered Large 800x800 looping autoplaying muted video */}
      <div className="relative w-full max-w-[800px] aspect-square rounded-3xl overflow-hidden liquid-glass border border-white/10 mb-20 md:mb-28 shadow-2xl flex items-center justify-center">
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
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4"
              type="video/mp4"
            />
          </video>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 p-8 text-center">
            <div className="w-20 h-20 rounded-full border-2 border-white/40 flex items-center justify-center mb-6">
              <div className="w-8 h-8 rounded-full border border-white/80" />
            </div>
            <p className="text-muted-foreground text-sm font-mono uppercase tracking-widest">
              ClickGuide Visual Engine
            </p>
          </div>
        )}

        {/* Liquid glass inner border vignette */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Scroll-driven word-by-word reveal text */}
      <div className="max-w-4xl mx-auto text-center px-4">
        {/* Section Pill */}
        <div className="mb-8">
          <span className="text-xs uppercase tracking-[3px] text-muted-foreground font-mono">
            PHILOSOPHY &amp; MISSION
          </span>
        </div>

        {/* Paragraph 1: text-2xl md:text-4xl lg:text-5xl font-medium tracking-[-1px] */}
        <p className="text-2xl md:text-4xl lg:text-5xl font-medium tracking-[-1px] leading-[1.3] text-balance">
          {p1Words.map((word, index) => {
            const cleanWord = word.replace(/[—,.]/g, '').toLowerCase();
            const isHighlight =
              cleanWord === 'curiosity' ||
              cleanWord === 'meets' ||
              cleanWord === 'clarity';

            const start = index / totalWords;
            const end = (index + 1) / totalWords;

            return (
              <Word
                key={`p1-${index}-${word}`}
                progress={scrollYProgress}
                range={[start, end]}
                isHighlight={isHighlight}
              >
                {word}
              </Word>
            );
          })}
        </p>

        {/* Paragraph 2: text-xl md:text-2xl lg:text-3xl font-medium mt-10 */}
        <p className="text-xl md:text-2xl lg:text-3xl font-medium mt-10 md:mt-14 leading-[1.4] text-balance">
          {p2Words.map((word, index) => {
            const globalIndex = p1Words.length + index;
            const start = globalIndex / totalWords;
            const end = (globalIndex + 1) / totalWords;

            return (
              <Word
                key={`p2-${index}-${word}`}
                progress={scrollYProgress}
                range={[start, end]}
                isHighlight={false}
              >
                {word}
              </Word>
            );
          })}
        </p>
      </div>
    </section>
  );
};
