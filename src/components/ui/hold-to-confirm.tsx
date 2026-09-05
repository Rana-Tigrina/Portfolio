"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { sound } from "@/lib/sound";
import { Check, Sparkles } from "lucide-react";

interface HoldToConfirmProps {
  onConfirm: () => void;
  label?: string;
  confirmedLabel?: string;
  durationMs?: number;
  className?: string;
  icon?: React.ReactNode;
}

export function HoldToConfirm({
  onConfirm,
  label = "Hold to Execute",
  confirmedLabel = "Executed",
  durationMs = 900,
  className = "",
  icon,
}: HoldToConfirmProps) {
  const [holding, setHolding] = useState(false);
  const [completed, setCompleted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const controls = useAnimation();

  const handleStart = () => {
    if (completed) return;
    setHolding(true);
    sound.playClick(600);

    controls.start({
      strokeDashoffset: 0,
      transition: { duration: durationMs / 1000, ease: "linear" },
    });

    timeoutRef.current = setTimeout(() => {
      setCompleted(true);
      setHolding(false);
      sound.playSuccess();
      onConfirm();

      setTimeout(() => {
        setCompleted(false);
        controls.set({ strokeDashoffset: 100 });
      }, 3000);
    }, durationMs);
  };

  const handleCancel = () => {
    if (completed) return;
    setHolding(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    controls.start({
      strokeDashoffset: 100,
      transition: { duration: 0.2, ease: "easeOut" },
    });
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <button
      type="button"
      onPointerDown={handleStart}
      onPointerUp={handleCancel}
      onPointerLeave={handleCancel}
      disabled={completed}
      className={`relative group select-none overflow-hidden rounded-token px-4 py-2 border transition-all flex items-center gap-2 font-mono text-xs cursor-pointer ${
        completed
          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
          : holding
          ? "bg-paper-2 border-accent text-ink shadow-sm scale-[0.98]"
          : "bg-paper-2/80 hover:bg-paper-2 border-line text-ink-soft hover:text-ink shadow-xs"
      } ${className}`}
    >
      {/* Dynamic Background Fill Indicator */}
      <motion.div
        className="absolute inset-0 bg-accent/15 origin-left pointer-events-none"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: holding ? 1 : 0 }}
        transition={{ duration: holding ? durationMs / 1000 : 0.2, ease: "linear" }}
      />

      {/* Radial Progress Ring SVG */}
      <div className="relative w-4 h-4 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="opacity-20"
          />
          <motion.circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="100"
            strokeDashoffset="100"
            animate={controls}
            className="text-accent"
          />
        </svg>
      </div>

      <span className="relative z-10 font-medium">
        {completed ? (
          <span className="flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            {confirmedLabel}
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            {icon || <Sparkles className="w-3 h-3 text-accent" />}
            {holding ? "Keep holding..." : label}
          </span>
        )}
      </span>
    </button>
  );
}
