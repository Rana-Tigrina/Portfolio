"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { siteData, CaseStudy } from "@/content/site";
import { ArchitectureDiagram } from "./architecture-diagram";
import { SpotlightCard } from "./ui/spotlight-card";
import { ParticleButton } from "./ui/particle-button";
import { sound } from "@/lib/sound";
import { Github } from "./icons";
import {
  CheckCircle,
  ExternalLink,
  Layers,
  Sparkles,
  Cpu,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Activity,
  ShieldCheck,
  Zap,
  LayoutGrid,
  Laptop,
} from "lucide-react";

// Extra metadata for production telemetry simulation & metric display
const systemMetadata: Record<
  string,
  {
    metricValue: string;
    metricLabel: string;
    metricSublabel: string;
    engine: string;
    runtime: string;
    latency: string;
    confidenceGate: string;
    keyHighlights: string[];
  }
> = {
  "healthcare-claims-audit": {
    metricValue: "91%",
    metricLabel: "Audit Adjudication Precision",
    metricSublabel: "CMS Medicare Billing Rules",
    engine: "LangGraph + Gemini 3.8 Flash + ChromaDB",
    runtime: "LangGraph StateGraph · Pydantic v2 · Python",
    latency: "290ms inference",
    confidenceGate: ">= 0.72 Composite Score (0.6 LLM + 0.4 Match)",
    keyHighlights: [
      "Deterministic CPT/ICD code overlap matching skips LLM on non-conflicting claims",
      "Zero-LLM native Python parsing maps CMS Medicare data directly to Pydantic schema",
      "Generates formal appeal letters with verbatim citations and mandatory [DRAFT] boundary",
    ],
  },
  "multi-agent-research-mcp": {
    metricValue: "100%",
    metricLabel: "Attributed Ground-Truth",
    metricSublabel: "Zero Hallucinated Citations",
    engine: "LangGraph + MCP Tool Protocol",
    runtime: "Python 3.11 · Local & Tavily MCP",
    latency: "Multi-hop cyclic graph",
    confidenceGate: "Critic Reflection Loop",
    keyHighlights: [
      "Standardized Model Context Protocol (MCP) tool integration",
      "Cyclic reflection loop: Critic re-routes query if evidence is weak",
      "Step-by-step reasoning attribution with immutable audit traces",
    ],
  },
  "production-rag-observability": {
    metricValue: "87%",
    metricLabel: "Retrieval Precision (P@5)",
    metricSublabel: "40% Token Cost Reduction",
    engine: "LangChain + ChromaDB + RAGAS",
    runtime: "Docker · AWS · GitHub Actions CI",
    latency: "145ms vector search",
    confidenceGate: "0.85 Faithfulness CI Gate",
    keyHighlights: [
      "Automated CI/CD pull request gate blocking regressions below 0.85 RAGAS",
      "Semantic boundary chunking reducing extraneous context payload",
      "Full OpenTelemetry tracing via LangSmith & Langfuse",
    ],
  },
  "clinical-documentation-soap": {
    metricValue: "65%",
    metricLabel: "Documentation Time Cut",
    metricSublabel: "95% SNOMED-CT Precision",
    engine: "WhisperX + Gemma 4 + Qwen 3.5",
    runtime: "FastAPI · Librosa · FFmpeg · Docker",
    latency: "Near real-time audio pipeline",
    confidenceGate: "Qwen 3.5 Clinical & ICD-10 Validator",
    keyHighlights: [
      "WhisperX acoustic diarization distinguishing doctor vs patient voice with phoneme alignment",
      "Structured clinical SOAP notes synthesized by Gemma 4 from natural consultation dialogue",
      "Secondary clinical validation by Qwen 3.5 verifying drug dosages, contraindications, and ICD-10",
    ],
  },
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 28 : -28,
    opacity: 0,
    filter: "blur(4px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -28 : 28,
    opacity: 0,
    filter: "blur(4px)",
    transition: {
      duration: 0.22,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export function SelectedWork() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [viewMode, setViewMode] = useState<"studio" | "deck">("studio");
  const [activeTab, setActiveTab] = useState<"decision" | "problem" | "outcome">("decision");
  const [mounted, setMounted] = useState(false);

  const studies = siteData.caseStudies;
  const currentStudy = studies[activeIdx];
  const meta = systemMetadata[currentStudy.slug] || {
    metricValue: "90%+",
    metricLabel: "Verified Performance",
    metricSublabel: "Production Benchmark",
    engine: "Stateful Agent Engine",
    runtime: "Production Cluster",
    latency: "<200ms",
    confidenceGate: "Gated Pipeline",
    keyHighlights: [],
  };

  const handleSelectSystem = useCallback(
    (index: number) => {
      if (index === activeIdx) return;
      sound.playClick(index > activeIdx ? 850 : 700);
      setDirection(index > activeIdx ? 1 : -1);
      setActiveIdx(index);
    },
    [activeIdx]
  );

  const handleNext = useCallback(() => {
    const nextIdx = (activeIdx + 1) % studies.length;
    handleSelectSystem(nextIdx);
  }, [activeIdx, studies.length, handleSelectSystem]);

  const handlePrev = useCallback(() => {
    const prevIdx = (activeIdx - 1 + studies.length) % studies.length;
    handleSelectSystem(prevIdx);
  }, [activeIdx, studies.length, handleSelectSystem]);

  // Keyboard shortcut listener for 1-4 and Arrow keys
  useEffect(() => {
    setMounted(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in an input/textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key >= "1" && e.key <= String(studies.length)) {
        const targetIdx = parseInt(e.key, 10) - 1;
        handleSelectSystem(targetIdx);
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSelectSystem, handleNext, handlePrev, studies.length]);

  return (
    <section id="work" className="py-16 md:py-24 border-b border-line relative overflow-hidden">
      {/* Subtle architectural background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, var(--ink) 1px, transparent 1px), linear-gradient(to bottom, var(--ink) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative space-y-8">
        {/* Section Header with View Mode Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-line/60">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-accent font-semibold tracking-wider uppercase">
                Selected Work · Flagship Systems
              </span>
              <span className="text-xs font-mono text-ink-soft">/ 03</span>
              <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-full bg-accent-soft text-accent border border-accent/20">
                <ShieldCheck className="w-3 h-3" />
                Production Verified
              </span>
            </div>
            <h2 className="font-serif italic text-3xl sm:text-5xl text-ink">
              Production Engineering Case Studies
            </h2>
            <p className="font-sans text-sm sm:text-base text-ink-soft max-w-2xl">
              Architectural blueprints, deterministic state coordination, and empirical benchmark
              telemetry from production AI deployments.
            </p>
          </div>

          {/* View Mode Toggle: Interactive Studio vs Full Deck */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <div className="p-1 bg-paper-2 border border-line rounded-lg flex items-center gap-1 shadow-xs">
              <button
                type="button"
                onClick={() => {
                  sound.playClick(800);
                  setViewMode("studio");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                  viewMode === "studio"
                    ? "bg-paper text-ink shadow-xs font-semibold border border-line/80"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                <Laptop className="w-3.5 h-3.5 text-accent" />
                <span>Interactive Studio</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick(750);
                  setViewMode("deck");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                  viewMode === "deck"
                    ? "bg-paper text-ink shadow-xs font-semibold border border-line/80"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-ink-soft" />
                <span>Full Deck</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MODE 1: INTERACTIVE FLAGSHIP STUDIO CONSOLE                               */}
        {/* ========================================================================= */}
        {viewMode === "studio" && (
          <div className="space-y-6">
            {/* Studio Navigation Bar with Spring Active Indicator */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 bg-paper-2/80 backdrop-blur-md border border-line rounded-xl shadow-xs">
              {/* Tab Buttons */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 flex-1">
                {studies.map((study, idx) => {
                  const isActive = idx === activeIdx;
                  return (
                    <button
                      key={study.slug}
                      type="button"
                      onClick={() => handleSelectSystem(idx)}
                      className={`relative px-3 py-2 text-left rounded-lg text-xs font-mono transition-colors flex items-center justify-between gap-2 select-none group ${
                        isActive ? "text-ink font-semibold" : "text-ink-soft hover:text-ink hover:bg-paper/40"
                      }`}
                    >
                      {/* Active Spring Background Pill */}
                      {isActive && (
                        <motion.div
                          layoutId="activeSystemPill"
                          className="absolute inset-0 bg-paper border border-accent/40 rounded-lg shadow-sm"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}

                      <span className="relative z-10 flex items-center gap-2">
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isActive
                              ? "bg-accent text-paper"
                              : "bg-paper-2 text-ink-soft group-hover:text-ink border border-line"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="truncate max-w-[140px] md:max-w-[170px] lg:max-w-[210px]">
                          {study.title.split(" ")[0]} {study.title.split(" ")[1]}
                        </span>
                      </span>

                      {/* Hotkey hint badge */}
                      {mounted && (
                        <kbd className="relative z-10 hidden lg:inline-block px-1.5 py-0.5 text-[9px] font-mono rounded bg-paper-2/70 text-ink-soft border border-line/60">
                          {idx + 1}
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Prev / Next Quick Arrows */}
              <div className="hidden sm:flex items-center gap-1 px-2 border-l border-line/70">
                <button
                  type="button"
                  onClick={handlePrev}
                  title="Previous System (Left Arrow)"
                  className="p-1.5 rounded-md text-ink-soft hover:text-ink hover:bg-paper transition-colors border border-transparent hover:border-line"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  title="Next System (Right Arrow)"
                  className="p-1.5 rounded-md text-ink-soft hover:text-ink hover:bg-paper transition-colors border border-transparent hover:border-line"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Split Screen Workbench Console */}
            <div className="relative">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStudy.slug}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                >
                  {/* LEFT PANE: System Dossier & Technical Decisions (5 cols on lg) */}
                  <div className="lg:col-span-5 space-y-5">
                    <div className="p-6 bg-paper border border-line rounded-xl shadow-xs space-y-6">
                      {/* System Header */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold px-2 py-0.5 border border-accent/20 bg-accent-soft rounded-token">
                            {currentStudy.badge}
                          </span>
                          <span className="font-mono text-xs text-ink-soft">
                            System 0{activeIdx + 1} / 0{studies.length}
                          </span>
                        </div>
                        <h3 className="font-serif italic text-2xl sm:text-3xl text-ink leading-tight">
                          {currentStudy.title}
                        </h3>
                        <p className="font-mono text-xs text-ink-soft">{currentStudy.category}</p>
                      </div>

                      {/* Standout Metric Card */}
                      <div className="p-4 rounded-xl bg-gradient-to-br from-paper-2 via-paper-2/90 to-paper border border-accent/20 relative overflow-hidden group">
                        <div className="flex items-baseline justify-between gap-2">
                          <div className="space-y-1">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft font-semibold block">
                              Primary Measured Metric
                            </span>
                            <div className="font-serif italic text-3xl sm:text-4xl text-accent font-bold tracking-tight">
                              {meta.metricValue}
                            </div>
                            <div className="font-sans text-xs font-semibold text-ink">
                              {meta.metricLabel}
                            </div>
                            <div className="font-mono text-[11px] text-ink-soft">
                              {meta.metricSublabel}
                            </div>
                          </div>

                          <div className="p-2.5 rounded-lg bg-accent/10 border border-accent/20 text-accent shrink-0">
                            <Activity className="w-5 h-5" />
                          </div>
                        </div>

                        {/* Subtle decorative grid accent */}
                        <div className="mt-3 pt-3 border-t border-line/60 flex items-center justify-between text-[10px] font-mono text-ink-soft">
                          <span className="flex items-center gap-1 text-ink font-medium">
                            <Zap className="w-3 h-3 text-accent" />
                            {meta.latency}
                          </span>
                          <span className="text-accent font-semibold">
                            {meta.confidenceGate}
                          </span>
                        </div>
                      </div>

                      {/* Dossier Tabs: Decision vs Problem vs Outcome */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-1 border-b border-line pb-1">
                          <button
                            type="button"
                            onClick={() => {
                              sound.playClick(850);
                              setActiveTab("decision");
                            }}
                            className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                              activeTab === "decision"
                                ? "text-accent font-semibold bg-accent-soft border border-accent/20"
                                : "text-ink-soft hover:text-ink"
                            }`}
                          >
                            Key Tradeoff
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              sound.playClick(800);
                              setActiveTab("problem");
                            }}
                            className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                              activeTab === "problem"
                                ? "text-accent font-semibold bg-accent-soft border border-accent/20"
                                : "text-ink-soft hover:text-ink"
                            }`}
                          >
                            Problem &amp; Stakes
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              sound.playClick(750);
                              setActiveTab("outcome");
                            }}
                            className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                              activeTab === "outcome"
                                ? "text-accent font-semibold bg-accent-soft border border-accent/20"
                                : "text-ink-soft hover:text-ink"
                            }`}
                          >
                            Measured Outcome
                          </button>
                        </div>

                        <div className="min-h-[120px] text-xs font-sans leading-relaxed text-ink">
                          {activeTab === "decision" && (
                            <div className="space-y-2 p-3 bg-paper-2/60 border border-line rounded-lg animate-fade-in">
                              <div className="font-mono text-[10px] uppercase tracking-wider text-accent font-semibold flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3" />
                                Engineering Decision
                              </div>
                              <p className="font-medium text-ink text-xs">{currentStudy.decision}</p>
                              <div className="pt-2 border-t border-line/60">
                                <span className="font-mono text-[10px] uppercase text-ink-soft block mb-1">
                                  Why This Decision Was Made:
                                </span>
                                <p className="text-ink-soft text-xs">{currentStudy.decisionReason}</p>
                              </div>
                            </div>
                          )}

                          {activeTab === "problem" && (
                            <div className="space-y-3 p-3 bg-paper-2/60 border border-line rounded-lg animate-fade-in">
                              <div>
                                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft font-semibold block mb-1">
                                  Root Engineering Challenge:
                                </span>
                                <p className="text-ink text-xs">{currentStudy.problem}</p>
                              </div>
                              <div className="pt-2 border-t border-line/60">
                                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft font-semibold block mb-1">
                                  Why It Mattered to Production:
                                </span>
                                <p className="text-ink-soft text-xs">{currentStudy.whyItMattered}</p>
                              </div>
                            </div>
                          )}

                          {activeTab === "outcome" && (
                            <div className="space-y-2 p-3 bg-paper-2/60 border border-line rounded-lg animate-fade-in">
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                <p className="text-ink text-xs font-medium leading-relaxed">
                                  {currentStudy.outcome}
                                </p>
                              </div>
                              <div className="space-y-1.5 pt-2 border-t border-line/60">
                                {meta.keyHighlights.map((highlight, hIdx) => (
                                  <div key={hIdx} className="flex items-center gap-1.5 text-[11px] text-ink-soft">
                                    <div className="w-1 h-1 rounded-full bg-accent" />
                                    <span>{highlight}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Full Stack Chips */}
                      <div className="space-y-2 pt-2 border-t border-line/60">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-ink-soft">
                          <Layers className="w-3.5 h-3.5 text-accent" />
                          <span>Technology Stack:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {currentStudy.stack.map((tech) => (
                            <span
                              key={tech}
                              className="font-mono text-[10px] px-2 py-0.5 border border-line bg-paper-2 rounded-token text-ink hover:border-accent/40 transition-colors"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* GitHub Action Particle Button */}
                      {currentStudy.links.github && (
                        <div className="pt-2">
                          <a
                            href={currentStudy.links.github}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full inline-block"
                          >
                            <ParticleButton
                              variant="outline"
                              size="sm"
                              className="w-full justify-center text-xs py-2 bg-paper-2 hover:bg-paper border-line hover:border-accent/60"
                            >
                              <Github className="w-3.5 h-3.5 text-ink" />
                              <span>Inspect Repository on GitHub</span>
                              <ExternalLink className="w-3 h-3 text-ink-soft" />
                            </ParticleButton>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT PANE: Interactive CAD Flowchart & Node Inspector (7 cols on lg) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="bg-paper border border-line rounded-xl shadow-xs overflow-hidden">
                      {/* Top CAD Terminal Console Bar */}
                      <div className="px-4 py-3 bg-paper-2/90 border-b border-line flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                          </span>
                          <span className="font-semibold text-ink uppercase tracking-wider text-[11px]">
                            Live Architecture Workbench
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-ink-soft">
                          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-paper border border-line">
                            {meta.engine}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-paper border border-line">
                            {meta.runtime}
                          </span>
                        </div>
                      </div>

                      {/* Interactive Diagram Canvas */}
                      <div className="p-4 sm:p-5">
                        <ArchitectureDiagram slug={currentStudy.slug} />
                      </div>

                      {/* Bottom Flow Telemetry Footnote */}
                      <div className="px-4 py-3 bg-paper-2/40 border-t border-line/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-ink-soft">
                        <div className="flex items-center gap-1.5 truncate max-w-xl">
                          <Terminal className="w-3.5 h-3.5 text-accent shrink-0" />
                          <span className="truncate">
                            Pipeline Flow:{" "}
                            <span className="text-ink font-sans text-xs">
                              {currentStudy.architecture}
                            </span>
                          </span>
                        </div>
                        <div className="text-[10px] text-ink-soft shrink-0 self-end sm:self-center">
                          Click any node to inspect telemetry
                        </div>
                      </div>
                    </div>

                    {/* Quick navigation bottom banner */}
                    <div className="flex items-center justify-between px-2 text-xs font-mono text-ink-soft">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="flex items-center gap-1 hover:text-ink hover:underline transition-colors"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Previous System</span>
                      </button>
                      <span className="text-[11px]">
                        Use keys <kbd className="px-1 py-0.5 bg-paper-2 border border-line rounded">1</kbd>–
                        <kbd className="px-1 py-0.5 bg-paper-2 border border-line rounded">4</kbd> or arrow keys
                      </span>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="flex items-center gap-1 hover:text-ink hover:underline transition-colors"
                      >
                        <span>Next System</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 2: FULL SYSTEM DECK (All 4 Systems Sequentially)                     */}
        {/* ========================================================================= */}
        {viewMode === "deck" && (
          <div className="space-y-8 animate-fade-in">
            {studies.map((study, idx) => {
              const itemMeta = systemMetadata[study.slug] || {
                metricValue: "90%+",
                metricLabel: "Verified Performance",
                metricSublabel: "Production Benchmark",
                engine: "Agent Engine",
                runtime: "Production Cluster",
                latency: "<200ms",
                confidenceGate: "Gated Pipeline",
                keyHighlights: [],
              };

              return (
                <SpotlightCard key={study.slug} className="bg-paper p-6 sm:p-8 space-y-6">
                  {/* Card Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-accent font-semibold px-2 py-0.5 border border-accent/20 bg-accent-soft rounded-token">
                          {study.badge}
                        </span>
                        <span className="font-mono text-xs text-ink-soft">
                          0{idx + 1} / 0{studies.length} · {study.category}
                        </span>
                      </div>
                      <h3 className="font-serif italic text-2xl sm:text-3xl text-ink">
                        {study.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-paper-2 border border-line rounded-lg text-right">
                        <div className="font-serif italic text-2xl text-accent font-bold leading-none">
                          {itemMeta.metricValue}
                        </div>
                        <div className="font-mono text-[10px] text-ink-soft">
                          {itemMeta.metricLabel}
                        </div>
                      </div>
                      {study.links.github && (
                        <a
                          href={study.links.github}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0"
                        >
                          <ParticleButton variant="outline" size="sm" className="text-xs">
                            <Github className="w-3.5 h-3.5" />
                            <span>Repo</span>
                          </ParticleButton>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Architecture Diagram */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-ink-soft">
                      <span className="font-semibold text-ink uppercase tracking-wider">
                        System Architecture &amp; Data Flow
                      </span>
                      <span className="text-[11px] text-accent">
                        Interactive telemetry nodes
                      </span>
                    </div>
                    <ArchitectureDiagram slug={study.slug} />
                  </div>

                  {/* Tradeoffs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-paper-2/50 border border-line rounded-xl">
                    <div className="space-y-1">
                      <div className="font-mono text-[10px] uppercase text-ink-soft font-semibold">
                        1. The Problem
                      </div>
                      <p className="font-sans text-xs text-ink leading-relaxed">
                        {study.problem}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="font-mono text-[10px] uppercase text-accent font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        2. Key Tradeoff Decision
                      </div>
                      <p className="font-sans text-xs text-ink leading-relaxed font-medium">
                        {study.decision}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="font-mono text-[10px] uppercase text-ink-soft font-semibold">
                        3. Measured Outcome
                      </div>
                      <p className="font-sans text-xs text-ink leading-relaxed">
                        {study.outcome}
                      </p>
                    </div>
                  </div>

                  {/* Stack Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-mono text-[11px] text-ink-soft mr-1">Stack:</span>
                      {study.stack.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[10px] px-2 py-0.5 border border-line bg-paper-2 rounded-token text-ink"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <p className="font-sans text-xs text-ink-soft italic">
                      Flow: {study.architecture}
                    </p>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
