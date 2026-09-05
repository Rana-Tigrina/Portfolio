"use client";

import React, { useRef, Fragment } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "motion/react";
import { Sparkles, Compass } from "lucide-react";

const STATEMENT =
  "In the quiet space between tokens, where mathematical abstraction meets human vulnerability, we do not engineer systems to replace consciousness, but to listen where the noise is deafening. Behind every embedding and loss gradient is a human heartbeat. I architect autonomous intelligence with mathematical rigor and clinical empathy—systems designed to reason through chaos and survive the tempest of production.";

const START_OPACITY = 0.14;
const SPREAD = 0.82;
const WORD_DURATION = 0.18;

interface WordProgressRange {
  start: number;
  end: number;
}

function getWordProgressRange(index: number, count: number): WordProgressRange {
  const start = count <= 1 ? 0 : (index / (count - 1)) * SPREAD;
  return { start, end: Math.min(1, start + WORD_DURATION) };
}

function Word({
  children,
  progress,
  index,
  count,
  reducedMotion,
}: {
  children: string;
  progress: MotionValue<number>;
  index: number;
  count: number;
  reducedMotion: boolean;
}) {
  const range = getWordProgressRange(index, count);
  const opacity = useTransform(progress, (latest) => {
    if (latest <= range.start) return START_OPACITY;
    if (latest >= range.end) return 1;
    const p = (latest - range.start) / (range.end - range.start);
    return START_OPACITY + (1 - START_OPACITY) * p;
  });

  return (
    <motion.span
      style={reducedMotion ? undefined : { opacity }}
      className="inline-block transition-opacity duration-75"
    >
      {children}
    </motion.span>
  );
}

export function TextScrollWordReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const words = STATEMENT.split(" ");

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[190vh] bg-paper text-ink border-b border-line selection:bg-accent selection:text-white"
    >
      {/* Sculpted Atmospheric Substrate: Subtle celestial cosmic grid & Rumi epigraph */}
      <div className="sticky top-0 w-full min-h-screen flex items-center px-4 sm:px-8 md:px-16 overflow-hidden">
        {/* Subtle Watermark Epigraph */}
        <div
          aria-hidden="true"
          className="absolute right-6 sm:right-12 bottom-8 font-serif italic text-xs sm:text-sm text-ink-soft/20 select-none pointer-events-none text-right max-w-xs"
        >
          &ldquo;The wound is the place where the Light enters you.&rdquo;
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-soft/30 mt-1">
            — Jalāl al-Dīn Muḥammad Rūmī
          </div>
        </div>

        <div className="max-w-5xl mx-auto w-full grid grid-cols-[auto_1fr] gap-6 sm:gap-10 md:gap-16 items-start relative z-10 py-12">
          {/* Calibrated Swiss Vertical Needle & Orbit Compass */}
          <div className="flex flex-col items-center gap-3 pt-2">
            <div className="w-6 h-6 rounded-full border border-line bg-paper-2 flex items-center justify-center text-accent shadow-xs">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            </div>

            <div className="relative w-[2px] h-36 sm:h-48 md:h-64 bg-line rounded-full overflow-hidden">
              <motion.span
                style={{ scaleY: reducedMotion ? 1 : scrollYProgress }}
                className="absolute inset-0 bg-gradient-to-b from-accent via-emerald-400 to-cyan-500 origin-top block rounded-full"
              />
            </div>

            <span className="font-mono text-[9px] text-ink-soft/70 uppercase tracking-widest vertical-rl rotate-180">
              Scrub
            </span>
          </div>

          {/* Monumental Typography Stage */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-accent font-semibold px-2.5 py-0.5 border border-accent/30 bg-accent-soft rounded-token shadow-xs">
                <Sparkles className="w-3 h-3" />
                Architectural Manifesto
              </span>
              <span className="text-[11px] font-mono text-ink-soft">
                // On Reasoning, Empathy &amp; Systems Truth
              </span>
            </div>

            <h2 className="font-serif italic font-normal text-2xl sm:text-3xl md:text-5xl lg:text-[48px] leading-[1.22] text-ink tracking-tight">
              {words.map((word, index) => (
                <Fragment key={`${word}-${index}`}>
                  <Word
                    progress={scrollYProgress}
                    index={index}
                    count={words.length}
                    reducedMotion={Boolean(reducedMotion)}
                  >
                    {word}
                  </Word>
                  {index < words.length - 1 ? " " : null}
                </Fragment>
              ))}
            </h2>

            <div className="pt-4 flex items-center gap-4 text-xs font-mono text-ink-soft/80 border-t border-line/40 max-w-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Scroll reveals depth · Provenance verified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
