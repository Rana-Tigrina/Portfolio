"use client";

import React, { memo, useMemo, useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";

interface Point {
  x: number;
  y: number;
}

interface PathData {
  id: string;
  d: string;
  opacity: number;
  width: number;
}

function roundTo(num: number, decimals: number = 2): number {
  const factor = 10 ** decimals;
  return Math.round(num * factor) / factor;
}

function generateAestheticPath(
  index: number,
  position: number,
  type: "primary" | "secondary" | "accent"
): string {
  const baseAmplitude = type === "primary" ? 140 : type === "secondary" ? 95 : 55;
  const phase = index * 0.25;
  const points: Point[] = [];
  const segments = type === "primary" ? 10 : type === "secondary" ? 8 : 6;

  const startX = 2400;
  const startY = 700;
  const endX = -2400;
  const endY = -700 + index * 30;

  for (let i = 0; i <= segments; i++) {
    const progress = i / segments;
    const eased = 1 - (1 - progress) ** 2;

    const baseX = startX + (endX - startX) * eased;
    const baseY = startY + (endY - startY) * eased;

    const amplitudeFactor = 1 - eased * 0.35;
    const wave1 =
      Math.sin(progress * Math.PI * 3 + phase) *
      (baseAmplitude * 0.7 * amplitudeFactor);
    const wave2 =
      Math.cos(progress * Math.PI * 4 + phase) *
      (baseAmplitude * 0.3 * amplitudeFactor);
    const wave3 =
      Math.sin(progress * Math.PI * 2 + phase) *
      (baseAmplitude * 0.2 * amplitudeFactor);

    points.push({
      x: roundTo(baseX * position),
      y: roundTo(baseY + wave1 + wave2 + wave3),
    });
  }

  const pathCommands = points.map((point: Point, i: number) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prevPoint = points[i - 1];
    const tension = 0.4;
    const cp1x = roundTo(prevPoint.x + (point.x - prevPoint.x) * tension);
    const cp1y = roundTo(prevPoint.y);
    const cp2x = roundTo(prevPoint.x + (point.x - prevPoint.x) * (1 - tension));
    const cp2y = roundTo(point.y);
    return `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
  });

  return pathCommands.join(" ");
}

export const BackgroundPaths = memo(function BackgroundPaths({
  className = "",
}: {
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
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

  const primaryPaths: PathData[] = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: `primary-${i}`,
        d: generateAestheticPath(i, 1, "primary"),
        opacity: 0.12 + i * 0.02,
        width: 1.5 + i * 0.2,
      })),
    []
  );

  const secondaryPaths: PathData[] = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        id: `secondary-${i}`,
        d: generateAestheticPath(i, 1, "secondary"),
        opacity: 0.08 + i * 0.015,
        width: 1.2 + i * 0.15,
      })),
    []
  );

  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
    >
      <svg
        className="h-full w-full opacity-60 dark:opacity-40"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        viewBox="-2400 -800 4800 1600"
      >
        <defs>
          <linearGradient id="pathGradientPrimary" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="pathGradientSecondary" x1="0%" x2="100%" y1="100%" y2="0%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        <g>
          {primaryPaths.map((path, idx) => (
            <motion.path
              key={path.id}
              d={path.d}
              stroke="url(#pathGradientPrimary)"
              strokeWidth={path.width}
              strokeLinecap="round"
              initial={{ opacity: path.opacity }}
              animate={
                shouldReduceMotion || isMobile
                  ? { opacity: path.opacity }
                  : {
                      y: [0, -18, 0],
                      opacity: [path.opacity, path.opacity * 1.4, path.opacity],
                    }
              }
              transition={{
                duration: 9 + idx,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </g>

        <g>
          {secondaryPaths.map((path, idx) => (
            <motion.path
              key={path.id}
              d={path.d}
              stroke="url(#pathGradientSecondary)"
              strokeWidth={path.width}
              strokeLinecap="round"
              initial={{ opacity: path.opacity }}
              animate={
                shouldReduceMotion || isMobile
                  ? { opacity: path.opacity }
                  : {
                      y: [0, -12, 0],
                      opacity: [path.opacity, path.opacity * 1.3, path.opacity],
                    }
              }
              transition={{
                duration: 7 + idx,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
});
