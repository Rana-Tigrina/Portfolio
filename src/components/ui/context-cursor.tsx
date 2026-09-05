"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { sound } from "@/lib/sound";

export type CursorVariant = "default" | "hover" | "view" | "tune" | "code" | "paper";

export function ContextCursor() {
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [customText, setCustomText] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.4 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only run on fine pointer devices (desktop/mouse)
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    let lastTarget: EventTarget | null = null;

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);

      // Only query DOM context if target changed
      if (e.target !== lastTarget) {
        lastTarget = e.target;
        const target = e.target as HTMLElement | null;
        if (!target) return;

        const cursorAttr = target.closest("[data-cursor]")?.getAttribute("data-cursor");
        const cursorText = target.closest("[data-cursor-text]")?.getAttribute("data-cursor-text");

        if (cursorAttr) {
          setVariant(cursorAttr as CursorVariant);
          setCustomText(cursorText || "");
        } else if (target.closest("button, a, [role='button'], input[type='range']")) {
          setVariant("hover");
          setCustomText("");
        } else if (target.closest("pre, code")) {
          setVariant("code");
          setCustomText("INSPECT");
        } else {
          setVariant("default");
          setCustomText("");
        }
      }
    };

    const onMouseDown = () => {
      setIsClicked(true);
      sound.playClick(680);
      setTimeout(() => setIsClicked(false), 150);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  if (shouldReduceMotion || !isVisible) return null;

  return (
    <>
      {/* Inner Precision Dot */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full bg-accent"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          width: variant === "default" ? 6 : 4,
          height: variant === "default" ? 6 : 4,
        }}
      />

      {/* Outer Context-Aware Follower Ring (No heavy backdrop-filter to guarantee 60fps) */}
      <motion.div
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-[9998] flex items-center justify-center font-mono text-[10px] font-semibold tracking-wider transition-colors duration-200 ${
          variant === "view"
            ? "rounded-full bg-accent text-neutral-900 px-3 py-1 shadow-md border border-accent/40"
            : variant === "tune"
            ? "rounded-full bg-cyan-500 text-neutral-900 px-3 py-1 shadow-md border border-cyan-400"
            : variant === "paper"
            ? "rounded-full bg-amber-500 text-neutral-900 px-3 py-1 shadow-md border border-amber-400"
            : variant === "code"
            ? "rounded-md bg-paper border border-accent text-accent px-2 py-0.5 shadow-sm"
            : variant === "hover"
            ? "rounded-full border-2 border-accent bg-accent/20"
            : "rounded-full border border-accent/40 bg-accent/5"
        }`}
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          width:
            variant === "view" || variant === "tune" || variant === "paper"
              ? "auto"
              : variant === "code"
              ? "auto"
              : variant === "hover"
              ? 44
              : 30,
          height:
            variant === "view" || variant === "tune" || variant === "paper"
              ? 26
              : variant === "code"
              ? 22
              : variant === "hover"
              ? 44
              : 30,
          scale: isClicked ? 0.85 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
      >
        {variant === "view" && (
          <span className="flex items-center gap-1">
            <span>👁️</span> {customText || "VIEW CAD"}
          </span>
        )}
        {variant === "tune" && (
          <span className="flex items-center gap-1">
            <span>⟵</span> {customText || "TUNE"} <span>⟶</span>
          </span>
        )}
        {variant === "paper" && (
          <span className="flex items-center gap-1">
            <span>📄</span> {customText || "READ"}
          </span>
        )}
        {variant === "code" && (
          <span className="flex items-center gap-1 text-[9px]">
            <span>⌨</span> {customText || "CODE"}
          </span>
        )}
      </motion.div>
    </>
  );
}
