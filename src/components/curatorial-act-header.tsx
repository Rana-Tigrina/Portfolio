"use client";

import React from "react";
import { motion } from "motion/react";

interface CuratorialActHeaderProps {
  roomNumber: string;
  roomTitle: string;
  wallText: string;
  season?: string;
  movement?: string;
  className?: string;
}

export function CuratorialActHeader({
  roomNumber,
  roomTitle,
  wallText,
  season,
  movement,
  className = "",
}: CuratorialActHeaderProps) {
  return (
    <div className={`space-y-4 mb-10 md:mb-12 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent font-semibold">
            {roomNumber} // {roomTitle}
          </span>
        </div>
        {(season || movement) && (
          <div className="font-mono text-[10px] text-ink-soft tracking-wider uppercase flex items-center gap-2">
            {season && <span>Season: {season}</span>}
            {season && movement && <span className="opacity-40">|</span>}
            {movement && <span>Movement: {movement}</span>}
          </div>
        )}
      </div>

      {/* Curatorial Wall Text */}
      <blockquote className="font-serif italic text-base sm:text-lg text-ink-soft border-l-2 border-accent/60 pl-4 py-1 max-w-3xl leading-relaxed">
        &ldquo;{wallText}&rdquo;
      </blockquote>
    </div>
  );
}
