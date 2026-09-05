"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

interface StackingCardProps {
  index: number;
  total: number;
  topOffset?: number;
  children: React.ReactNode;
  className?: string;
}

export function StackingCard({
  index,
  total,
  topOffset = 80,
  children,
  className = "",
}: StackingCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Calculate recession in 3D perspective as subsequent slabs scroll over it
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, Math.max(0.9, 1 - (total - index) * 0.035)]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.8, 1],
    [1, 0.85, 0.6]
  );

  const filter = useTransform(
    scrollYProgress,
    [0, 1],
    ["blur(0px)", shouldReduceMotion ? "blur(0px)" : "blur(1.5px)"]
  );

  return (
    <div
      ref={containerRef}
      style={{
        top: `calc(${topOffset}px + ${index * 24}px)`,
        zIndex: 10 + index,
      }}
      className={`sticky mb-12 sm:mb-16 ${className}`}
    >
      <motion.div
        style={{
          scale: shouldReduceMotion ? 1 : scale,
          opacity: shouldReduceMotion ? 1 : opacity,
          filter: shouldReduceMotion ? undefined : filter,
        }}
        className="origin-top transition-shadow"
      >
        {children}
      </motion.div>
    </div>
  );
}
