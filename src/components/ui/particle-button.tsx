"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { playTactileClick } from "@/lib/sound";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
}

export interface ParticleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function ParticleButton({
  children,
  variant = "primary",
  size = "default",
  className = "",
  onClick,
  ...props
}: ParticleButtonProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const shouldReduceMotion = useReducedMotion();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playTactileClick(680, 0.04);

    if (!shouldReduceMotion) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const colors = ["var(--accent)", "#3B82F6", "#10B981", "#8B5CF6"];
      const newParticles: Particle[] = Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const velocity = 25 + Math.random() * 35;
        return {
          id: Date.now() + i,
          x: clickX + Math.cos(angle) * velocity,
          y: clickY + Math.sin(angle) * velocity,
          color: colors[i % colors.length],
        };
      });

      setParticles(newParticles);
      setTimeout(() => setParticles([]), 700);
    }

    onClick?.(e);
  };

  const baseStyles =
    "relative inline-flex items-center justify-center font-sans font-medium text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 overflow-hidden rounded-token cursor-pointer select-none active:scale-[0.98]";

  const variantStyles = {
    primary:
      "bg-accent text-white hover:bg-accent/90 shadow-sm hover:shadow-md",
    outline:
      "border border-line bg-paper text-ink hover:bg-paper-2 hover:border-accent/40 shadow-xs",
    ghost:
      "text-ink-soft hover:text-ink hover:bg-paper-2",
  };

  const sizeStyles = {
    sm: "px-2.5 py-1 text-xs gap-1.5",
    default: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5",
  };

  return (
    <button
      onClick={handleClick}
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {/* Particle burst elements */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ scale: 1, opacity: 1, x: 0, y: 0 }}
          animate={{ scale: 0, opacity: 0, x: p.x - 30, y: p.y - 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ backgroundColor: p.color }}
          className="pointer-events-none absolute w-1.5 h-1.5 rounded-full z-30"
        />
      ))}

      {/* Subtle Shimmer highlight on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out hover:translate-x-full"
      />

      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
