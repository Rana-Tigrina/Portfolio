"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useTransform,
  useScroll,
  useSpring,
  useReducedMotion,
} from "motion/react";

export interface TracingBeamProps {
  children: React.ReactNode;
  className?: string;
}

export function TracingBeam({ children, className = "" }: TracingBeamProps) {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const [svgHeight, setSvgHeight] = useState(0);

  useEffect(() => {
    setMounted(true);
    if (contentRef.current) {
      setSvgHeight(contentRef.current.offsetHeight);
    }

    const handleResize = () => {
      if (contentRef.current) {
        setSvgHeight(contentRef.current.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const y1 = useSpring(
    useTransform(scrollYProgress, [0, 0.9], [50, svgHeight]),
    {
      stiffness: 500,
      damping: 85,
    }
  );

  const y2 = useSpring(
    useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]),
    {
      stiffness: 500,
      damping: 85,
    }
  );

  return (
    <motion.div
      ref={ref}
      className={`relative w-full max-w-6xl mx-auto ${className}`}
    >
      {/* Left-side tracking beam (visible on lg screens once mounted) */}
      {mounted && svgHeight > 0 && (
        <div className="absolute -left-4 md:-left-8 top-3 hidden lg:block pointer-events-none">
          <motion.div
            transition={{ duration: 0.2, delay: 0.2 }}
            animate={{
              boxShadow:
                scrollYProgress.get() > 0
                  ? "none"
                  : "rgba(15, 107, 92, 0.4) 0px 0px 0px 3px",
            }}
            className="ml-[27px] h-4 w-4 rounded-full border border-line shadow-sm flex items-center justify-center bg-paper"
          >
            <motion.div
              transition={{ duration: 0.2 }}
              animate={{
                backgroundColor:
                  scrollYProgress.get() > 0 ? "var(--accent)" : "var(--line)",
                borderColor:
                  scrollYProgress.get() > 0 ? "var(--accent)" : "var(--line)",
              }}
              className="h-2 w-2 rounded-full border bg-accent"
            />
          </motion.div>

          <svg
            viewBox={`0 0 20 ${svgHeight}`}
            width="20"
            height={svgHeight}
            className="ml-4 block"
            aria-hidden="true"
          >
            {/* Background subtle static track */}
            <path
              d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.9} l -18 24V ${svgHeight}`}
              fill="none"
              stroke="var(--line)"
              strokeOpacity="0.4"
              strokeWidth="1.2"
            />
            {/* Animated gradient beam */}
            {!shouldReduceMotion && (
              <motion.path
                d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.9} l -18 24V ${svgHeight}`}
                fill="none"
                stroke="url(#tracingGradient)"
                strokeWidth="2.2"
                className="motion-reduce:hidden"
              />
            )}
            <defs>
              <motion.linearGradient
                id="tracingGradient"
                gradientUnits="userSpaceOnUse"
                x1="0"
                x2="0"
                y1={y1}
                y2={y2}
              >
                <stop stopColor="var(--accent)" stopOpacity="0" />
                <stop stopColor="var(--accent)" />
                <stop offset="0.4" stopColor="#3B82F6" />
                <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
              </motion.linearGradient>
            </defs>
          </svg>
        </div>
      )}

      <div ref={contentRef} className="w-full">
        {children}
      </div>
    </motion.div>
  );
}
