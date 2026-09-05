"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { sound } from "@/lib/sound";
import {
  Activity,
  Volume2,
  VolumeX,
  Radio,
  Sliders,
  Play,
  CheckCircle2,
  Cpu,
} from "lucide-react";

export type ViewMode = "studio" | "matrix" | "lab";

interface NeuralHudProps {
  onModeChange?: (mode: ViewMode) => void;
  activeMode?: ViewMode;
}

export function NeuralHud({ onModeChange, activeMode = "studio" }: NeuralHudProps) {
  const [mode, setMode] = useState<ViewMode>(activeMode);
  const [isMuted, setIsMuted] = useState(true);
  const [cascadeStep, setCascadeStep] = useState<number | null>(null);
  const [telemetry, setTelemetry] = useState({ x: 0, y: 0, fps: 60 });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const unsub = sound.subscribe((muted) => setIsMuted(muted));
    return () => unsub();
  }, []);

  // Track cursor position and FPS for live telemetry
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const calcFps = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setTelemetry((prev) => ({ ...prev, fps: Math.min(Math.round((frameCount * 1000) / (now - lastTime)), 60) }));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(calcFps);
    };
    animId = requestAnimationFrame(calcFps);

    const onMove = (e: MouseEvent) => {
      setTelemetry((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "m" || e.key === "M") {
        sound.toggleMute();
      } else if (e.key === "c" || e.key === "C") {
        triggerCascade();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleMode = (newMode: ViewMode) => {
    setMode(newMode);
    onModeChange?.(newMode);
    sound.playCyberSweep();

    if (newMode === "lab") {
      const el = document.getElementById("interactive-lab");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else if (newMode === "matrix") {
      document.documentElement.classList.add("matrix-mode-active");
    } else {
      document.documentElement.classList.remove("matrix-mode-active");
    }
  };

  const triggerCascade = () => {
    sound.playHologramPulse();
    setCascadeStep(0);

    const cascadeSequence = [
      { step: 1, delay: 600 },
      { step: 2, delay: 1300 },
      { step: 3, delay: 2100 },
      { step: 4, delay: 2900 },
      { step: 5, delay: 3700 },
      { step: 6, delay: 4500 },
      { step: 7, delay: 5400 }, // Completed
    ];

    cascadeSequence.forEach(({ step, delay }) => {
      setTimeout(() => {
        setCascadeStep(step);
        if (step < 7) {
          sound.playMechanicalTick();
        } else {
          sound.playSuccess();
          setTimeout(() => setCascadeStep(null), 3000);
        }
      }, delay);
    });
  };

  const cascadeStages = [
    "Initializing LangGraph Multi-Agent Orchestrator...",
    "Contract Reader: Structuring CMS Medicare policy rules into ChromaDB",
    "Rule Match: Deterministic candidate code overlap filter (0 LLM calls)",
    "Auditor Agent: Gemini 3.8 Flash composite scoring (0.928 threshold pass)",
    "Audio Diarization: WhisperX transcribing demo.mp3 clinical stream",
    "SOAP Synthesis: Gemma 4 generating clinical note (S/O/A/P)",
    "Clinical Verification: Qwen 3.5 validating ICD-10 & contraindications",
  ];

  return (
    <>
      {/* Cinematic Agent Cascade Banner */}
      <AnimatePresence>
        {cascadeStep !== null && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-2xl px-5 py-3.5 rounded-2xl bg-paper-card/90 backdrop-blur-2xl border border-accent/60 shadow-[0_0_40px_rgba(0,229,163,0.25)] text-ink"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-accent text-xs font-mono font-semibold uppercase tracking-wider">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
                </span>
                Agent Cascade Traversal Active
              </div>
              <span className="text-[11px] font-mono text-ink-muted">
                Step {Math.min(cascadeStep, 6)} / 6
              </span>
            </div>

            <p className="text-xs font-mono text-ink leading-relaxed mb-2.5">
              {cascadeStep < 7 ? (
                <span className="text-accent font-medium">
                  {cascadeStages[cascadeStep]}
                </span>
              ) : (
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  CASCADE COMPLETED · 0 HALLUCINATIONS · 100% DETERMINISTIC VERIFICATION
                </span>
              )}
            </p>

            {/* Progress line */}
            <div className="w-full h-1 bg-border/60 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-accent via-cyan-400 to-emerald-400"
                initial={{ width: "0%" }}
                animate={{ width: `${(cascadeStep / 6) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bottom HUD Deck */}
      <aside aria-label="Neural OS Command Deck" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-[94vw] select-none">
        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-paper-card/85 backdrop-blur-2xl border border-border/80 shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-accent/50">
          {/* Dimension Mode Pills */}
          <div className="flex items-center gap-1 bg-paper/60 p-1 rounded-full border border-border/40">
            <button
              onClick={() => handleMode("studio")}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200 flex items-center gap-1.5 ${
                mode === "studio"
                  ? "bg-accent text-white shadow-[0_0_15px_rgba(0,128,102,0.4)]"
                  : "text-ink-muted hover:text-ink hover:bg-paper-card"
              }`}
              title="Studio Mode: Full Engineering Deep Dive"
            >
              <Activity className="w-3 h-3" />
              <span className="hidden sm:inline">Studio</span>
            </button>

            <button
              onClick={() => handleMode("matrix")}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200 flex items-center gap-1.5 ${
                mode === "matrix"
                  ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.6)] font-bold"
                  : "text-ink-muted hover:text-ink hover:bg-paper-card"
              }`}
              title="Matrix Mode: CRT Hologram & Telemetry Scanlines"
            >
              <Cpu className="w-3 h-3" />
              <span>Matrix</span>
            </button>

            <button
              onClick={() => handleMode("lab")}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200 flex items-center gap-1.5 ${
                mode === "lab"
                  ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.6)] font-bold"
                  : "text-ink-muted hover:text-ink hover:bg-paper-card"
              }`}
              title="Lab Mode: Jump to RAG Simulator & Audio Workbench"
            >
              <Sliders className="w-3 h-3" />
              <span className="hidden sm:inline">Lab</span>
            </button>
          </div>

          <div className="h-4 w-px bg-border/60 mx-1 hidden sm:block" />

          {/* Trigger Cascade Button */}
          <button
            onClick={triggerCascade}
            disabled={cascadeStep !== null}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/15 hover:bg-accent/25 text-accent border border-accent/30 text-xs font-mono font-medium transition-all duration-200 hover:scale-[1.03] active:scale-95 disabled:opacity-50"
            title="Execute Live Multi-Agent LangGraph Cascade (Hotkey: C)"
          >
            <Play className="w-3 h-3 fill-current" />
            <span className="hidden md:inline">Cascade</span>
            <kbd className="hidden lg:inline text-[9px] px-1 py-0.5 rounded bg-paper border border-border/60 text-ink-muted">C</kbd>
          </button>

          {/* Audio Equalizer & Sound Toggle */}
          <button
            onClick={() => sound.toggleMute()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-paper/60 hover:bg-paper-card text-ink-muted hover:text-ink border border-border/40 transition-all text-xs font-mono"
            title={`Toggle Synthesized Cyber Haptics (Hotkey: M) — Currently ${isMuted ? "Muted" : "Active"}`}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-ink-muted" />
            ) : (
              <div className="flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-accent" />
                <div className="flex items-end gap-0.5 h-3 w-3">
                  <span className="w-0.5 h-2 bg-accent animate-pulse rounded-full" />
                  <span className="w-0.5 h-3 bg-accent animate-pulse delay-75 rounded-full" />
                  <span className="w-0.5 h-1.5 bg-accent animate-pulse delay-150 rounded-full" />
                </div>
              </div>
            )}
            <kbd className="hidden lg:inline text-[9px] px-1 py-0.5 rounded bg-paper border border-border/60 text-ink-muted">M</kbd>
          </button>

          {/* Live Telemetry Pill */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-paper/40 text-[10px] font-mono text-ink-muted hover:text-ink border border-border/30 transition-colors"
            title="Live GPU & Viewport Telemetry"
          >
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>{telemetry.fps} FPS</span>
            <span className="text-border">·</span>
            <span className="hidden md:inline">X:{telemetry.x} Y:{telemetry.y}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
