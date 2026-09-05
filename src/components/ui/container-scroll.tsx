"use client";

import React, { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion, useReducedMotion } from "motion/react";

export interface ContainerScrollProps {
  titleComponent?: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ContainerScroll({
  titleComponent,
  children,
  className = "",
}: ContainerScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.9, 1] : [0.94, 1.02];
  };

  const rotate = useTransform(scrollYProgress, [0, 0.45], [16, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.45], scaleDimensions());
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0.75, 1]);

  // On mobile or before client hydration, render cleanly without 3D perspective to prevent WebKit compositor layer culling and disappearance during scroll
  if (!mounted || isMobile) {
    return (
      <div
        ref={containerRef}
        className={`relative flex items-center justify-center p-0 sm:p-2 md:p-4 ${className}`}
      >
        <div className="w-full relative">
          {titleComponent && (
            <div className="max-w-5xl mx-auto mb-6 text-center">
              {titleComponent}
            </div>
          )}
          <div className="w-full rounded-token shadow-[0_12px_36px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center p-2 sm:p-4 md:p-6 ${className}`}
      style={{
        perspective: "1200px",
      }}
    >
      <div className="w-full relative">
        {titleComponent && (
          <div className="max-w-5xl mx-auto mb-6 text-center">
            {titleComponent}
          </div>
        )}
        <motion.div
          style={
            shouldReduceMotion
              ? undefined
              : {
                  rotateX: rotate,
                  scale,
                  opacity,
                  transformStyle: "preserve-3d",
                }
          }
          className="w-full transition-shadow duration-500 rounded-token shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
