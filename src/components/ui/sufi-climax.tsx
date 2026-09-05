"use client";

import React from "react";
import { motion } from "motion/react";
import { Compass } from "lucide-react";

export function SufiClimax() {
  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 text-center max-w-4xl mx-auto space-y-8 relative overflow-hidden">
      {/* Whirling Astrolabe Mandala */}
      <div className="relative w-40 h-40 mx-auto flex items-center justify-center select-none">
        {/* Outer Ring: Rotating slowly */}
        <motion.svg
          className="w-full h-full"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <circle
            cx="100"
            cy="100"
            r="95"
            stroke="#d4af37"
            strokeWidth="1"
            strokeDasharray="4 6"
            opacity="0.4"
          />
          <circle
            cx="100"
            cy="100"
            r="85"
            stroke="var(--accent)"
            strokeWidth="0.8"
            opacity="0.5"
          />
          <polygon
            points="100,10 120,70 185,70 135,110 155,175 100,135 45,175 65,110 15,70 80,70"
            stroke="#d4af37"
            strokeWidth="1"
            fill="none"
            opacity="0.6"
          />
        </motion.svg>

        {/* Inner Ring: Counter-rotating */}
        <motion.svg
          className="w-24 h-24 absolute"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#002fa7"
            strokeWidth="1.2"
            opacity="0.7"
          />
          <circle
            cx="50"
            cy="50"
            r="35"
            stroke="var(--line)"
            strokeWidth="0.7"
            strokeDasharray="2 4"
          />
          <rect
            x="25"
            y="25"
            width="50"
            height="50"
            stroke="#d4af37"
            strokeWidth="0.8"
            transform="rotate(45 50 50)"
            fill="none"
            opacity="0.7"
          />
        </motion.svg>

        {/* Center Astrolabe Core */}
        <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/50 flex items-center justify-center text-amber-500 z-10 shadow-lg backdrop-blur-xs">
          <Compass className="w-5 h-5 animate-spin-slow" />
        </div>
      </div>

      {/* Rumi's Climax Verse */}
      <div className="space-y-4">
        <blockquote className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-ink leading-relaxed max-w-2xl mx-auto">
          &ldquo;The wound is the place where the Light enters you.&rdquo;
        </blockquote>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent font-semibold">
          — Jalāl al-Dīn Muḥammad Rūmī (1207 – 1273)
        </p>
      </div>

      <p className="font-sans text-xs sm:text-sm text-ink-soft max-w-xl mx-auto leading-relaxed pt-2">
        Every edge case in clinical software, every hallucination caught by a deterministic gate, is
        the wound where empirical rigor and artistic truth illuminate the machine.
      </p>
    </section>
  );
}
