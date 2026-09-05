"use client";

import React, { useEffect, useRef } from "react";
import { useInView, useSpring, useTransform, motion } from "motion/react";

interface SlidingNumberProps {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function SlidingNumber({
  value,
  className = "",
  prefix = "",
  suffix = "",
  decimals = 0,
}: SlidingNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const spring = useSpring(0, {
    mass: 0.8,
    stiffness: 75,
    damping: 15,
  });

  const display = useTransform(spring, (current) => {
    if (decimals === 0) {
      return Math.round(current).toLocaleString();
    }
    return current.toFixed(decimals);
  });

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value]);

  return (
    <span ref={ref} className={`inline-flex items-baseline font-mono tabular-nums ${className}`}>
      {prefix && <span>{prefix}</span>}
      <motion.span>{display}</motion.span>
      {suffix && <span className="text-accent">{suffix}</span>}
    </span>
  );
}
