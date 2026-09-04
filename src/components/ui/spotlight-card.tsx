"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";

const TILT_MAX = 7;
const TILT_SPRING = { stiffness: 300, damping: 28 } as const;
const GLOW_SPRING = { stiffness: 180, damping: 22 } as const;

export interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  dimmed?: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  accentColor?: string;
}

export function SpotlightCard({
  children,
  className,
  dimmed = false,
  onHoverStart,
  onHoverEnd,
  accentColor = "var(--accent)",
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const normX = useMotionValue(0.5);
  const normY = useMotionValue(0.5);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });

  const rawRotateX = useTransform(normY, [0, 1], [TILT_MAX, -TILT_MAX]);
  const rawRotateY = useTransform(normX, [0, 1], [-TILT_MAX, TILT_MAX]);

  const rotateX = useSpring(rawRotateX, TILT_SPRING);
  const rotateY = useSpring(rawRotateY, TILT_SPRING);
  const glowOpacity = useSpring(0, GLOW_SPRING);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;
    normX.set(xRatio);
    normY.set(yRatio);
    setCursorPos({
      x: Math.round(xRatio * 100),
      y: Math.round(yRatio * 100),
    });
  };

  const handleMouseEnter = () => {
    glowOpacity.set(1);
    onHoverStart?.();
  };

  const handleMouseLeave = () => {
    normX.set(0.5);
    normY.set(0.5);
    glowOpacity.set(0);
    onHoverEnd?.();
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      animate={{
        scale: dimmed ? 0.97 : 1,
        opacity: dimmed ? 0.55 : 1,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={
        shouldReduceMotion
          ? undefined
          : {
              rotateX,
              rotateY,
              transformPerspective: 900,
            }
      }
      className={cn(
        "group relative flex flex-col overflow-hidden border border-line bg-paper-2 rounded-token",
        "transition-[border-color,box-shadow] duration-300",
        "hover:border-accent/60 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)]",
        className
      )}
    >
      {/* Ambient radial cursor-following glow layer */}
      {!shouldReduceMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-token transition-opacity duration-300 z-0"
          style={{
            opacity: glowOpacity,
            background: `radial-gradient(circle 350px at ${cursorPos.x}% ${cursorPos.y}%, rgba(15, 107, 92, 0.18), transparent 70%)`,
          }}
        />
      )}

      {/* Subtle Shimmer sweep on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-[50%] -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[300%] z-0"
      />

      {/* Main card content */}
      <div className="relative z-10 flex flex-col h-full">{children}</div>

      {/* Bottom accent animated line */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full transition-all duration-500 group-hover:w-full z-20"
        style={{
          background: `linear-gradient(to right, ${accentColor}, transparent)`,
        }}
      />
    </motion.div>
  );
}
