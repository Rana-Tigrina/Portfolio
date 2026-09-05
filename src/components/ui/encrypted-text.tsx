"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useInView } from "motion/react";

interface EncryptedTextProps {
  text: string;
  className?: string;
  interval?: number;
  triggerOnHover?: boolean;
}

const GLYPHS = "λψθ∑∇∞∆≈±∫§✦✧#$*&0123456789ABCDEF";

export function EncryptedText({
  text,
  className = "",
  interval = 25,
  triggerOnHover = true,
}: EncryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scramble = useCallback(() => {
    if (isScrambling) return;
    setIsScrambling(true);

    let iteration = 0;
    const maxIterations = text.length;

    if (timeoutRef.current) clearInterval(timeoutRef.current);

    timeoutRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, idx) => {
            if (char === " ") return " ";
            if (idx < iteration) {
              return text[idx];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );

      iteration += 1 / 2.5;

      if (iteration >= maxIterations) {
        setDisplayText(text);
        setIsScrambling(false);
        if (timeoutRef.current) clearInterval(timeoutRef.current);
      }
    }, interval);
  }, [text, interval, isScrambling]);

  useEffect(() => {
    if (isInView) {
      scramble();
    }
    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [isInView, scramble]);

  return (
    <span
      ref={ref}
      onMouseEnter={() => {
        if (triggerOnHover) scramble();
      }}
      className={`inline-block font-mono select-none cursor-default transition-colors ${className}`}
    >
      {displayText}
    </span>
  );
}
