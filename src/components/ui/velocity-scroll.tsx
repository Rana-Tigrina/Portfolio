"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "motion/react";

interface VelocityScrollProps {
  text: string;
  defaultVelocity?: number;
  className?: string;
  skewRange?: [number, number];
}

interface ParallaxProps {
  children: string;
  baseVelocity: number;
  className?: string;
}

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

function ParallaxText({ children, baseVelocity = 5, className = "" }: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth <= 768 ||
        window.matchMedia("(pointer: coarse)").matches
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  // Skew text based on scroll speed (disabled on mobile to avoid texture re-rasterization)
  const skewX = useTransform(
    smoothVelocity,
    [-1200, 1200],
    shouldReduceMotion || isMobile ? [0, 0] : [-14, 14]
  );

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap py-1 select-none">
      <motion.div
        className={`flex whitespace-nowrap gap-8 text-xs md:text-sm font-mono uppercase tracking-[0.25em] font-medium will-change-transform ${className}`}
        style={{ x, skewX }}
      >
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
      </motion.div>
    </div>
  );
}

export function VelocityScroll({
  track1 = "✦ MULTI-AGENT STATEGRAPHS ✦ DETERMINISTIC RULE GATES ✦ RAGAS OBSERVABILITY ✦ WHISPERX + GEMMA 4 ✦ ZERO-HALLUCINATION POLICY",
  track2 = "✦ AFFECTIVE GAZE TRACKING ✦ COGNITIVE WORKLOAD DYNAMICS ✦ GEMINI 3.8 FLASH ✦ CHROMADB EMBEDDINGS ✦ IIT MADRAS DATA SCIENCE",
  className = "",
}: {
  track1?: string;
  track2?: string;
  className?: string;
}) {
  return (
    <section className={`relative w-full py-6 md:py-8 border-y border-line/40 bg-paper-2/95 md:bg-paper/60 md:backdrop-blur-md overflow-hidden ${className}`}>
      {/* Subtle edge vignette gradient */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-paper to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-paper to-transparent z-10 pointer-events-none" />

      <div className="flex flex-col gap-2">
        <ParallaxText
          baseVelocity={-1.5}
          className="text-accent/80 hover:text-accent transition-colors"
        >
          {track1}
        </ParallaxText>
        <ParallaxText
          baseVelocity={1.5}
          className="text-ink-muted/70 hover:text-ink transition-colors"
        >
          {track2}
        </ParallaxText>
      </div>
    </section>
  );
}
