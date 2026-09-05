"use client";

import React from "react";
import { motion } from "motion/react";

interface FontanaSlashProps {
  actLabel?: string;
  className?: string;
}

export function FontanaSlash({ actLabel = "Concetto Spaziale (Attese)", className = "" }: FontanaSlashProps) {
  return (
    <div
      className={`relative w-full max-w-6xl mx-auto my-12 md:my-16 h-8 flex items-center justify-center cursor-crosshair group select-none ${className}`}
      title={`Lucio Fontana: ${actLabel}`}
    >
      {/* Background slash line */}
      <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-line to-transparent -rotate-[0.6deg]" />

      {/* Slashed spatial incision / slit */}
      <motion.div
        className="w-44 md:w-60 h-1 bg-[#002fa7] rounded-full shadow-[0_0_24px_6px_rgba(0,47,167,0.45),0_0_12px_#d4af37] -rotate-[1.5deg] filter blur-[0.5px] transition-all duration-500 ease-out group-hover:scale-y-175 group-hover:scale-x-125 group-hover:shadow-[0_0_40px_10px_rgba(0,47,167,0.65),0_0_20px_#d4af37]"
        whileHover={{ scaleY: 1.9, scaleX: 1.3 }}
      />

      {/* Micro-label floating above incision */}
      <span className="absolute -top-3 font-mono text-[9px] uppercase tracking-[0.25em] text-ink-soft opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-paper px-2 border border-line rounded-token">
        Fontana Spatial Slit // {actLabel}
      </span>
    </div>
  );
}
