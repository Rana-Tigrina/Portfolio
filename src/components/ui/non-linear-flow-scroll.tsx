"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { sound } from "@/lib/sound";
import { ArchitectureDiagram } from "../architecture-diagram";
import {
  ShieldCheck,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Code2,
  Workflow,
  Activity,
  Copy,
  Check,
  Zap,
  Terminal,
  ArrowDown,
} from "lucide-react";

export interface CaseStudyDetail {
  problem: string;
  whyItMattered: string;
  architectureDescription: string;
  architectureNodes: { name: string; type: string; role: string }[];
  decisionGate: string;
  codeSnippet: string;
  latencyBreakdown: { label: string; ms: number; pct: number }[];
  invariants: string[];
}

export interface NonLinearCaseStudyItem {
  id: string;
  number: string;
  category: string;
  title: string;
  metric: string;
  metricLabel: string;
  metricSublabel: string;
  description: string;
  stack: string[];
  accentColor: string;
  detail: CaseStudyDetail;
  targetIndex: number;
}

interface NonLinearFlowScrollProps {
  items: NonLinearCaseStudyItem[];
  eyebrow?: string;
  className?: string;
}

/**
 * Single Full-Screen Case Study Slide (100vw x 100vh).
 * Showcases the complete production system end-to-end:
 * Architecture Blueprint SVG (100% responsive, never clipped),
 * StateGraph Code (with dedicated native mouse wheel scrolling),
 * and OpenTelemetry metrics — all fully visible in the viewport.
 */
function CaseStudySlide({
  item,
  index,
  total,
  scrollProgress,
}: {
  item: NonLinearCaseStudyItem;
  index: number;
  total: number;
  scrollProgress: any;
}) {
  const [activeTab, setActiveTab] = useState<"diagram" | "code" | "telemetry">("diagram");
  const [copied, setCopied] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const codeContainerRef = useRef<HTMLPreElement>(null);

  const handleCopyCode = () => {
    sound.playSuccess();
    navigator.clipboard.writeText(item.detail.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dedicated native mouse wheel handler for the StateGraph code block:
  // When hovering over the code block, mouse wheel scrolls the code natively.
  // When reaching the top or bottom boundary, wheel events naturally bubble.
  useEffect(() => {
    const el = codeContainerRef.current;
    if (!el || activeTab !== "code") return;

    const handleWheel = (e: WheelEvent) => {
      const hasScroll = el.scrollHeight > el.clientHeight;
      if (!hasScroll) return;

      const canScrollUp = el.scrollTop > 0;
      const canScrollDown = el.scrollTop < el.scrollHeight - el.clientHeight - 1;

      if ((e.deltaY > 0 && canScrollDown) || (e.deltaY < 0 && canScrollUp)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        el.scrollTop += e.deltaY;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [activeTab]);

  // Timeline intervals for 4 systems across [0.0, 1.0]:
  const hPopStart = index === 0 ? 0 : index === 1 ? 0.16 : index === 2 ? 0.44 : 0.72;
  const hPopEnd = index === 0 ? 0.16 : index === 1 ? 0.28 : index === 2 ? 0.56 : 0.84;

  // Rotational fan unroll (FlowArt 20° -> 0°) during horizontal entrance
  const rotationZ = useTransform(
    scrollProgress,
    index === 0 ? [0, 1] : [hPopStart, hPopEnd],
    index === 0 ? [0, 0] : shouldReduceMotion ? [0, 0] : [20, 0]
  );

  // Dynamic scale during pop-in
  const scale = useTransform(
    scrollProgress,
    index === 0 ? [0, 1] : [hPopStart, hPopEnd],
    index === 0 ? [1, 1] : shouldReduceMotion ? [1, 1] : [0.94, 1.0]
  );

  // Opacity fade-in during pop-in
  const opacity = useTransform(
    scrollProgress,
    index === 0 ? [0, 0.16, 0.28] : [hPopStart, hPopEnd],
    index === 0 ? [1, 1, 0.6] : [0.15, 1]
  );

  return (
    <motion.div
      style={{
        width: "100vw",
        minWidth: "100vw",
        maxWidth: "100vw",
        height: "100%",
        rotateZ: rotationZ,
        scale,
        opacity,
        transformOrigin: "bottom left",
      }}
      className="shrink-0 flex flex-col justify-between px-6 sm:px-10 md:px-14 lg:px-20 py-4 sm:py-5 relative overflow-hidden will-change-transform"
    >
      {/* Ambient Lighting Gradient */}
      <div
        className="absolute -right-24 -top-24 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: item.accentColor }}
      />

      {/* ================= PANEL TOP BAR (FIXED IN SLIDE) ================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-line/70 relative z-20 shrink-0">
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-xs sm:text-sm font-bold tracking-widest uppercase px-2.5 py-1 rounded-lg border"
            style={{
              color: item.accentColor,
              borderColor: `${item.accentColor}50`,
              backgroundColor: `${item.accentColor}15`,
            }}
          >
            SYSTEM {item.number} / 0{total}
          </span>
          <span className="font-mono text-xs text-ink-soft tracking-wider uppercase">
            {item.category}
          </span>
        </div>

        {/* Big Production Benchmark Badge */}
        <div
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border bg-paper-2/90 shadow-2xs"
          style={{ borderColor: `${item.accentColor}40` }}
        >
          <span
            className="font-mono text-xl sm:text-2xl font-bold tracking-tight"
            style={{ color: item.accentColor }}
          >
            {item.metric}
          </span>
          <div className="flex flex-col text-left leading-tight">
            <span className="font-sans text-[11px] font-semibold text-ink uppercase tracking-wider">
              {item.metricLabel}
            </span>
            <span className="font-mono text-[10px] text-ink-soft">
              {item.metricSublabel}
            </span>
          </div>
        </div>
      </div>

      {/* ================= MAIN DASHBOARD (BALANCED & FULLY VISIBLE) ================= */}
      <div className="flex-1 min-h-0 flex items-center py-1 overflow-hidden w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center w-full min-h-0">
          {/* Left Column: Problem, Why It Mattered, Invariants, Stack (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-3 min-w-0">
            <div className="space-y-2">
              <h2 className="font-serif italic text-2xl sm:text-3xl lg:text-[34px] text-ink tracking-tight leading-snug">
                {item.title}
              </h2>

              <p className="font-sans text-xs sm:text-[13px] text-ink-soft leading-relaxed line-clamp-3 lg:line-clamp-none">
                {item.description}
              </p>

              {/* Core Problem Callout */}
              <div className="p-3 rounded-xl border border-line bg-paper-2/70 space-y-1">
                <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-accent font-semibold">
                  <Zap className="w-3.5 h-3.5 text-accent" />
                  <span>The Core Engineering Problem</span>
                </div>
                <p className="font-sans text-xs text-ink/90 leading-relaxed">
                  {item.detail.problem}
                </p>
              </div>

              {/* Architectural Invariants */}
              <div className="space-y-1">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-soft font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" style={{ color: item.accentColor }} />
                  Deterministic Rule Gates &amp; Invariants
                </span>
                <ul className="space-y-1">
                  {item.detail.invariants.map((inv, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-ink/90 font-sans leading-relaxed"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: item.accentColor }}
                      />
                      <span>{inv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tech Stack Chips */}
            <div className="pt-1.5 border-t border-line/60 flex flex-wrap items-center gap-1.5">
              {item.stack.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-paper-2 border border-line text-ink-soft"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Diagram / StateGraph Code / Telemetry (7 cols) */}
          <div className="lg:col-span-7 flex flex-col border border-line/80 rounded-2xl bg-paper/95 backdrop-blur-md overflow-hidden shadow-xl min-w-0">
            {/* Mode Switcher */}
            <div className="flex items-center justify-between border-b border-line px-4 py-2 bg-paper-2/60 shrink-0">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(750);
                    setActiveTab("diagram");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    activeTab === "diagram"
                      ? "bg-paper text-ink font-bold shadow-xs border border-line"
                      : "text-ink-soft hover:text-ink"
                  }`}
                  style={activeTab === "diagram" ? { color: item.accentColor } : {}}
                >
                  <Workflow className="w-3.5 h-3.5" />
                  <span>Architecture Blueprint</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(800);
                    setActiveTab("code");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    activeTab === "code"
                      ? "bg-paper text-ink font-bold shadow-xs border border-line"
                      : "text-ink-soft hover:text-ink"
                  }`}
                  style={activeTab === "code" ? { color: item.accentColor } : {}}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>StateGraph Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(850);
                    setActiveTab("telemetry");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    activeTab === "telemetry"
                      ? "bg-paper text-ink font-bold shadow-xs border border-line"
                      : "text-ink-soft hover:text-ink"
                  }`}
                  style={activeTab === "telemetry" ? { color: item.accentColor } : {}}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Telemetry</span>
                </button>
              </div>

              {activeTab === "code" && (
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 font-mono text-[11px] text-ink-soft hover:text-ink cursor-pointer px-2 py-0.5 rounded border border-line bg-paper-2 shadow-2xs"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copied" : "Copy Code"}</span>
                </button>
              )}
            </div>

            {/* Tab 1: Interactive SVG Architecture Diagram (Fully Scaled, Never Clipped) */}
            {activeTab === "diagram" && (
              <div className="p-3 sm:p-4 space-y-2 min-w-0">
                <ArchitectureDiagram slug={item.id} />

                <div
                  className="p-2 sm:p-2.5 rounded-lg border bg-paper-2/90 flex items-center justify-between text-[11px] font-sans"
                  style={{ borderColor: `${item.accentColor}35` }}
                >
                  <span className="text-ink-soft leading-relaxed line-clamp-2">{item.detail.decisionGate}</span>
                  <span className="font-mono font-semibold text-ink shrink-0 ml-3 text-[10px] sm:text-[11px]">Verified Invariant</span>
                </div>
              </div>
            )}

            {/* Tab 2: Syntax-highlighted Python Code (Dedicated Mouse Wheel Scroll) */}
            {activeTab === "code" && (
              <div
                data-lenis-prevent="true"
                data-lenis-prevent-wheel="true"
                data-lenis-prevent-vertical="true"
                className="p-3 sm:p-4 font-mono text-xs space-y-2 min-w-0"
              >
                <pre
                  ref={codeContainerRef}
                  data-lenis-prevent="true"
                  data-lenis-prevent-wheel="true"
                  data-lenis-prevent-vertical="true"
                  tabIndex={0}
                  className="p-3.5 rounded-xl bg-ink/5 dark:bg-ink/10 border border-line font-mono text-xs sm:text-[12.5px] text-ink/90 overflow-y-auto leading-relaxed max-h-[300px] sm:max-h-[340px] focus:outline-none overscroll-contain select-text [scrollbar-width:thin]"
                  style={{ overscrollBehavior: "contain" }}
                >
                  <code
                    data-lenis-prevent="true"
                    data-lenis-prevent-wheel="true"
                    data-lenis-prevent-vertical="true"
                  >
                    {item.detail.codeSnippet}
                  </code>
                </pre>
                <div className="pt-1.5 text-[11px] font-mono text-ink-soft flex items-center justify-between border-t border-line/50">
                  <span>Deterministic rule routing</span>
                  <span className="text-accent font-semibold">Production LangGraph StateGraph</span>
                </div>
              </div>
            )}

            {/* Tab 3: Telemetry & Latency Breakdown */}
            {activeTab === "telemetry" && (
              <div className="p-4 sm:p-5 space-y-3 min-w-0">
                <div className="space-y-0.5">
                  <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider">
                    OpenTelemetry Latency Allocation
                  </span>
                  <p className="font-sans text-[11px] sm:text-xs text-ink-soft">
                    Real-time latency budget profiled across deterministic rules vs model inference.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  {item.detail.latencyBreakdown.map((lat, lIdx) => (
                    <div key={lIdx} className="space-y-1">
                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className="text-ink font-medium">{lat.label}</span>
                        <span className="text-ink-soft font-mono">
                          {lat.ms}ms ({lat.pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-paper-2 border border-line overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${lat.pct}%`,
                            backgroundColor: item.accentColor,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 rounded-lg border border-line bg-paper-2 text-xs font-sans text-ink-soft flex items-center justify-between">
                  <span>Continuous Automated CI/CD Regression Gate</span>
                  <span className="font-mono font-semibold text-emerald-500 text-[11px]">PASSED BENCHMARK</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= PANEL FOOTER (FIXED IN SLIDE) ================= */}
      <div className="pt-2 border-t border-line/70 flex flex-wrap items-center justify-between gap-2 relative z-20 text-[11px] sm:text-xs font-mono text-ink-soft shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: item.accentColor }} />
          <span className="text-ink font-semibold">System 0{item.number} / 0{total} · {item.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{item.category}</span>
        </div>
      </div>
    </motion.div>
  );
}

export function NonLinearFlowScroll({
  items,
  eyebrow = "SELECTED CASE STUDIES",
  className = "",
}: NonLinearFlowScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const total = items.length;

  // Track vertical scroll across the tall 500vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Spring smoothing for organic velocity
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 32,
    mass: 0.2,
  });

  // Determine active system index based on scroll progress
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (v) => {
      let idx = 0;
      if (v < 0.22) idx = 0;
      else if (v < 0.50) idx = 1;
      else if (v < 0.78) idx = 2;
      else idx = 3;
      setActiveIdx(idx);
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  // Non-linear horizontal translation:
  // Generous resting dwell on each system, with smooth translation between systems
  const x = useTransform(
    smoothProgress,
    [
      0.00, 0.16, // System 0 in view (x = 0vw)
      0.28, 0.44, // Transition to System 1, resting in view (x = -100vw)
      0.56, 0.72, // Transition to System 2, resting in view (x = -200vw)
      0.84, 1.00, // Transition to System 3, resting in view (x = -300vw)
    ],
    [
      "0vw", "0vw",
      "-100vw", "-100vw",
      "-200vw", "-200vw",
      "-300vw", "-300vw",
    ]
  );

  const progressPercent = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  // Direct Jump via Pills or Keyboard
  const scrollToSystem = (index: number) => {
    sound.playClick(800);
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const scrollDistance = containerRef.current.offsetHeight - window.innerHeight;
    const targetPoints = [0.06, 0.34, 0.62, 0.90];
    const targetScroll = containerTop + targetPoints[index] * scrollDistance;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.top <= 10 && rect.bottom >= window.innerHeight - 10) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          const next = Math.min(total - 1, activeIdx + 1);
          scrollToSystem(next);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          const prev = Math.max(0, activeIdx - 1);
          scrollToSystem(prev);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIdx, total]);

  const currentItem = items[activeIdx] || items[0];

  return (
    <section
      id="work"
      ref={containerRef}
      className={`relative w-full h-[500vh] bg-paper ${className}`}
      aria-label="Selected Case Studies"
    >
      {/* Sticky Viewport Stage: 100vw x 100vh with overflow-hidden */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between bg-paper">
        {/* Subtle Architectural Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(to right, var(--ink) 1px, transparent 1px), linear-gradient(to bottom, var(--ink) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Floating Top Control HUD */}
        <div className="relative z-30 w-full px-6 sm:px-10 md:px-14 lg:px-20 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-line/60 bg-paper/90 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono tracking-wider uppercase text-accent font-semibold px-2.5 py-0.5 border border-accent/40 bg-accent-soft rounded-token">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              {eyebrow}
            </span>
            <span className="font-mono text-xs text-ink-soft hidden sm:inline">
              0{activeIdx + 1} / 0{total} · Selected Case Studies
            </span>
          </div>

          {/* Quick-Jump System Pills */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 p-0.5 bg-paper-2 border border-line rounded-lg shadow-2xs">
              {items.map((it, idx) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => scrollToSystem(idx)}
                  className={`px-2.5 py-0.5 rounded-md text-xs font-mono transition-all cursor-pointer ${
                    activeIdx === idx
                      ? "bg-paper text-ink font-bold shadow-xs border border-line"
                      : "text-ink-soft hover:text-ink"
                  }`}
                  style={
                    activeIdx === idx
                      ? { color: it.accentColor, borderColor: `${it.accentColor}50` }
                      : {}
                  }
                >
                  0{idx + 1} {it.number === "01" ? "CMS" : it.number === "02" ? "MCP" : it.number === "03" ? "RAG" : "SOAP"}
                </button>
              ))}
            </div>

            {/* Kinetic Progress Bar */}
            <div className="w-24 sm:w-32 h-1 bg-line/80 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: progressPercent,
                  backgroundColor: currentItem.accentColor,
                }}
              />
            </div>
          </div>
        </div>

        {/* Horizontal Track: 400vw Wide (4 Panels of strictly 100vw each) */}
        <div className="relative z-10 w-full flex-1 flex items-center overflow-hidden">
          <motion.div
            style={{
              x,
              display: "flex",
              flexDirection: "row",
              width: "400vw",
              minWidth: "400vw",
              height: "100%",
            }}
            className="will-change-transform"
          >
            {items.map((item, idx) => (
              <CaseStudySlide
                key={item.id}
                item={item}
                index={idx}
                total={total}
                scrollProgress={smoothProgress}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default NonLinearFlowScroll;

