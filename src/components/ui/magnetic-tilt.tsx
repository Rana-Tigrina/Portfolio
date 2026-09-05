"use client";

import React, { useRef, useState, MouseEvent } from "react";
import { motion, useSpring, useReducedMotion } from "motion/react";

interface MagneticTiltProps {
  children: React.ReactNode;
  className?: string;
  maxAngle?: number;
  scaleHover?: number;
  glareOpacity?: number;
}

export function MagneticTilt({
  children,
  className = "",
  maxAngle = 7,
  scaleHover = 1.015,
  glareOpacity = 0.15,
}: MagneticTiltProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const shouldReduceMotion = useReducedMotion();

  const springConfig = { damping: 20, stiffness: 220, mass: 0.5 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = (mouseX / width) * 100;
    const yPct = (mouseY / height) * 100;
    setGlarePos({ x: xPct, y: yPct });

    // Calculate angles: mouse at top tilts forward (positive rotateX), bottom tilts back
    const rX = ((mouseY - height / 2) / (height / 2)) * -maxAngle;
    const rY = ((mouseX - width / 2) / (width / 2)) * maxAngle;

    rotateX.set(rX);
    rotateY.set(rY);
  };

  const handleMouseEnter = () => {
    if (shouldReduceMotion) return;
    setIsHovered(true);
    scale.set(scaleHover);
  };

  const handleMouseLeave = () => {
    if (shouldReduceMotion) return;
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1000px" }}
      className={`relative will-change-transform ${className}`}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
        }}
        className="relative h-full w-full rounded-[inherit]"
      >
        {children}

        {/* Dynamic Specular Glare Overlay */}
        {!shouldReduceMotion && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-30"
            style={{
              opacity: isHovered ? glareOpacity : 0,
              background: `radial-gradient(circle 350px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.22), transparent 70%)`,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
