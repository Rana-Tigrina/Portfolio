"use client";

import React from "react";
import { motion } from "motion/react";

interface BorderTrailProps {
  className?: string;
  size?: number;
  duration?: number;
  color?: string;
}

export function BorderTrail({
  className = "",
  size = 80,
  duration = 7,
  color = "var(--accent)",
}: BorderTrailProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] ${className}`}
    >
      <motion.div
        className="absolute aspect-square opacity-80 blur-[2px]"
        style={{
          width: size,
          background: `radial-gradient(circle, ${color} 0%, rgba(16, 185, 129, 0.4) 40%, transparent 75%)`,
          offsetPath: `rect(0 auto auto 0 round inherit)`,
        }}
        animate={{ offsetDistance: ["0%", "100%"] }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
