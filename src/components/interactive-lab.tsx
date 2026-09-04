"use client";

import React, { useState } from "react";
import { sound } from "@/lib/sound";
import { Sliders, Play, RotateCcw, Activity, CheckCircle2, Zap, Sparkles } from "lucide-react";
import { motion } from "motion/react";
function SleekSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  contextNote,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  contextNote?: string;
  onChange: (val: number) => void;
}) {
  const percent = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className="space-y-1.5 p-2.5 rounded-token bg-paper-2/50 border border-line/70 hover:border-accent/50 transition-colors">
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-ink font-medium">{label}</span>
          {contextNote && (
            <span className="text-[10px] text-ink-soft bg-paper px-1.5 py-0.5 rounded-token border border-line">
              {contextNote}
            </span>
          )}
        </div>
        <span className="px-2 py-0.5 bg-paper border border-accent/40 text-accent font-semibold rounded-token text-[11px] shadow-2xs">
          {value} {unit}
        </span>
      </div>

      <div className="relative pt-1 pb-0.5">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${percent}%, var(--line) ${percent}%, var(--line) 100%)`,
          }}
          className="custom-slider"
        />
      </div>

      <div className="flex justify-between text-[9px] font-mono text-ink-soft px-0.5">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
}

export function InteractiveLab() {
  // RAG Simulator State
  const [chunkSize, setChunkSize] = useState(512);
  const [chunkOverlap, setChunkOverlap] = useState(64);
  const [topK, setTopK] = useState(4);
  const [temperature, setTemperature] = useState(0.2);

  // Agent Sandbox State
  const [agentScenario, setAgentScenario] = useState<"clean" | "missing_mod" | "ambiguous">("missing_mod");
  const [agentStep, setAgentStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  // Derived RAG metrics calculation
  const precision = Math.min(
    98,
    Math.round(85 + (chunkSize > 256 && chunkSize < 1024 ? 8 : -6) - temperature * 12 + (topK >= 3 && topK <= 5 ? 5 : -4))
  );
  const recall = Math.min(
    99,
    Math.round(75 + (topK * 4) + (chunkOverlap > 32 ? 6 : -3) - (chunkSize > 1500 ? 5 : 0))
  );
  const faithfulness = Math.min(
    99,
    Math.round(92 - temperature * 18 + (chunkSize < 1024 ? 5 : -3))
  );
  const latencyMs = Math.round(110 + topK * 28 + (chunkSize / 64) * 4);
  const costPer1k = ((topK * chunkSize * 0.00015) / 10).toFixed(4);

  // Dynamic SVG Curve computation based on current slider state
  const curvePoints = Array.from({ length: 12 }, (_, i) => {
    const x = (i / 11) * 280;
    const factor = (precision / 100) * 0.8 + (recall / 100) * 0.2;
    const y = 65 - Math.sin((i / 11) * Math.PI) * 45 * factor - (temperature * 10);
    return `${i === 0 ? "M" : "L"} ${x} ${Math.max(10, Math.min(75, y))}`;
  }).join(" ");

  const applyPreset = (preset: "precision" | "fast" | "cost") => {
    sound.playClick(900);
    if (preset === "precision") {
      setChunkSize(512);
      setChunkOverlap(64);
      setTopK(4);
      setTemperature(0.1);
    } else if (preset === "fast") {
      setChunkSize(256);
      setChunkOverlap(32);
      setTopK(2);
      setTemperature(0.0);
    } else {
      setChunkSize(384);
      setChunkOverlap(32);
      setTopK(3);
      setTemperature(0.2);
    }
  };

  const handleRunAgentSim = () => {
    sound.playClick(850);
    setIsSimulating(true);
    setAgentStep(1);

    const steps = [2, 3, 4];
    steps.forEach((st, i) => {
      setTimeout(() => {
        setAgentStep(st);
        sound.playClick(800 + st * 60);
        if (i === steps.length - 1) {
          setIsSimulating(false);
          sound.playSuccess();
        }
      }, (i + 1) * 700);
    });
  };

  return (
    <section id="lab" className="py-16 md:py-24 border-b border-line bg-paper-2/40 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Section Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-accent font-semibold tracking-wider uppercase">
              Interactive Lab &amp; Simulator
            </span>
            <span className="text-xs font-mono text-ink-soft">/ Hands-On Experience</span>
          </div>
          <h2 className="font-serif italic text-3xl sm:text-4xl text-ink">
            The Systems Playground
          </h2>
          <p className="font-sans text-sm sm:text-base text-ink-soft max-w-2xl">
            Tweak live RAG hyperparameters to observe retrieval vs. latency trade-offs with dynamic curve rendering, or test deterministic multi-agent state routing.
          </p>
        </div>

        {/* Two Interactive Modules Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Module 1: RAG Hyperparameter Tuner */}
          <div className="p-6 bg-paper border border-line rounded-token space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-accent" />
                <h3 className="font-mono text-xs font-semibold uppercase text-ink tracking-wider">
                  RAG Parameter &amp; Curve Simulator
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => applyPreset("precision")}
                  className="px-2 py-0.5 text-[10px] font-mono border border-line rounded-token hover:bg-paper-2 text-ink cursor-pointer"
                >
                  High Precision
                </button>
                <button
                  onClick={() => applyPreset("fast")}
                  className="px-2 py-0.5 text-[10px] font-mono border border-line rounded-token hover:bg-paper-2 text-ink cursor-pointer"
                >
                  Low Latency
                </button>
              </div>
            </div>

            {/* Real-time Dynamic Curve Visualizer */}
            <div className="p-3 bg-paper-2 border border-line rounded-token space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-ink-soft">
                <span>Dynamic Retrieval Precision Curve</span>
                <span className="text-accent font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {precision}% Match
                </span>
              </div>
              <div className="h-16 w-full flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 280 80" className="w-full h-full">
                  <defs>
                    <linearGradient id="curveGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  {/* Grid reference lines */}
                  <line x1="0" y1="20" x2="280" y2="20" stroke="var(--line)" strokeDasharray="3 3" opacity="0.6" />
                  <line x1="0" y1="50" x2="280" y2="50" stroke="var(--line)" strokeDasharray="3 3" opacity="0.6" />
                  {/* Dynamic waveform */}
                  <motion.path
                    d={curvePoints}
                    fill="none"
                    stroke="url(#curveGradient)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    transition={{ duration: 0.2 }}
                  />
                </svg>
              </div>
            </div>

            {/* Sleek High-Tech Custom Sliders */}
            <div className="space-y-3 font-mono">
              <SleekSlider
                label="Chunk Size"
                value={chunkSize}
                min={128}
                max={1536}
                step={64}
                unit="tokens"
                contextNote={
                  chunkSize <= 384
                    ? "Fast / High Recall"
                    : chunkSize <= 768
                    ? "Balanced Semantics"
                    : "Wide Context / High Latency"
                }
                onChange={(val) => {
                  setChunkSize(val);
                  sound.playClick(600 + val / 5);
                }}
              />

              <SleekSlider
                label="Chunk Overlap"
                value={chunkOverlap}
                min={0}
                max={128}
                step={16}
                unit="tokens"
                contextNote={
                  chunkOverlap === 0
                    ? "No Context Stitching"
                    : chunkOverlap <= 64
                    ? "Optimal Window"
                    : "High Redundancy"
                }
                onChange={(val) => {
                  setChunkOverlap(val);
                  sound.playClick(700 + val * 2);
                }}
              />

              <SleekSlider
                label="Top-K Retrieved"
                value={topK}
                min={1}
                max={8}
                step={1}
                unit="chunks"
                contextNote={
                  topK <= 2
                    ? "Low Cost / Strict"
                    : topK <= 5
                    ? "High Precision"
                    : "High Token Usage"
                }
                onChange={(val) => {
                  setTopK(val);
                  sound.playClick(800 + val * 30);
                }}
              />

              <SleekSlider
                label="LLM Temperature"
                value={temperature}
                min={0}
                max={0.8}
                step={0.05}
                unit=""
                contextNote={
                  temperature === 0
                    ? "Deterministic / Zero Drift"
                    : temperature <= 0.3
                    ? "Clinical Reasoning"
                    : "Creative / Risk"
                }
                onChange={(val) => {
                  setTemperature(val);
                  sound.playClick(900 - val * 200);
                }}
              />
            </div>

            {/* Simulated Live Output Meters */}
            <div className="p-4 bg-paper-2/60 border border-line rounded-token space-y-3 font-mono text-xs">
              <div className="text-[11px] text-ink-soft uppercase tracking-wider font-semibold">
                Simulated RAGAS &amp; Performance Scores:
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>Faithfulness Score (RAGAS):</span>
                    <strong className="text-ink">{faithfulness}%</strong>
                  </div>
                  <div className="w-full h-1.5 bg-paper rounded-full overflow-hidden border border-line">
                    <div
                      className="h-full bg-accent transition-all duration-300"
                      style={{ width: `${faithfulness}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>Context Precision:</span>
                    <strong className="text-ink">{precision}%</strong>
                  </div>
                  <div className="w-full h-1.5 bg-paper rounded-full overflow-hidden border border-line">
                    <div
                      className="h-full bg-accent transition-all duration-300"
                      style={{ width: `${precision}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>Context Recall:</span>
                    <strong className="text-ink">{recall}%</strong>
                  </div>
                  <div className="w-full h-1.5 bg-paper rounded-full overflow-hidden border border-line">
                    <div
                      className="h-full bg-accent transition-all duration-300"
                      style={{ width: `${recall}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-line/60 flex items-center justify-between text-[11px] text-ink-soft">
                <span>Latency Estimate: <strong className="text-ink">{latencyMs}ms</strong></span>
                <span>Token Cost / 1k: <strong className="text-ink">${costPer1k}</strong></span>
              </div>
            </div>
          </div>

          {/* Module 2: Multi-Agent Decision Routing Visualizer */}
          <div className="p-6 bg-paper border border-line rounded-token space-y-5 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-accent" />
                  <h3 className="font-mono text-xs font-semibold uppercase text-ink tracking-wider">
                    Agent Decision Flow Sandbox
                  </h3>
                </div>
                <button
                  onClick={() => {
                    sound.playClick(600);
                    setAgentStep(0);
                  }}
                  className="p-1 text-ink-soft hover:text-ink border border-line rounded-token cursor-pointer"
                  title="Reset state"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Scenario Picker */}
              <div className="space-y-1">
                <span className="font-mono text-xs text-ink-soft">
                  Select Incoming Claim Scenario:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "clean", label: "Valid Claim (Prior Auth OK)" },
                    { id: "missing_mod", label: "Missing Modifier -59" },
                    { id: "ambiguous", label: "Ambiguous Chart (<0.80)" },
                  ].map((sc) => (
                    <button
                      key={sc.id}
                      onClick={() => {
                        sound.playClick(750);
                        setAgentScenario(sc.id as typeof agentScenario);
                        setAgentStep(0);
                      }}
                      className={`p-2 font-mono text-[11px] text-left border rounded-token transition-colors cursor-pointer ${
                        agentScenario === sc.id
                          ? "bg-paper-2 border-accent text-ink font-semibold shadow-xs"
                          : "border-line text-ink-soft hover:bg-paper-2"
                      }`}
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step Sequence Display */}
              <div className="space-y-2 pt-2">
                {[
                  { step: 1, label: "Contract Reader", desc: "Retrieving LCD Medicare Policy Guidelines from ChromaDB" },
                  { step: 2, label: "Claim Extractor", desc: "Extracting CPT, ICD-10, and clinical provider notes" },
                  { step: 3, label: "Auditor & Confidence Gate", desc: "Evaluating claim conformance against policy clauses" },
                  {
                    step: 4,
                    label:
                      agentScenario === "clean"
                        ? "Approval Path: Claim Validated"
                        : agentScenario === "missing_mod"
                        ? "Appeal Path: Auto-Generate CMS Appeal Letter"
                        : "Human Review: Flagged for Physician Audit",
                    desc:
                      agentScenario === "clean"
                        ? "Confidence: 0.96 -> Passed to clearinghouse directly"
                        : agentScenario === "missing_mod"
                        ? "Confidence: 0.92 -> Generated formal reconsideration letter"
                        : "Confidence: 0.68 -> Routed to manual review queue",
                  },
                ].map((item) => {
                  const isActive = agentStep === item.step;
                  const isDone = agentStep > item.step;

                  return (
                    <div
                      key={item.step}
                      className={`p-2.5 border rounded-token transition-all text-xs font-mono ${
                        isActive
                          ? "border-accent bg-paper-2 shadow-xs"
                          : isDone
                          ? "border-line bg-paper/50 text-ink"
                          : "border-line/50 opacity-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-accent">0{item.step}.</span>
                          <strong className="text-ink">{item.label}</strong>
                        </div>
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-accent" />}
                        {isActive && <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />}
                      </div>
                      <p className="text-[11px] text-ink-soft font-sans pt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Run Button */}
            <div className="pt-4 border-t border-line flex items-center justify-between">
              <span className="font-mono text-xs text-ink-soft">
                {agentStep === 4 ? "Simulation Complete" : `Step ${agentStep} / 4`}
              </span>
              <button
                onClick={handleRunAgentSim}
                disabled={isSimulating}
                className="flex items-center gap-1.5 px-4 py-2 bg-ink text-paper text-xs font-mono font-medium rounded-token hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isSimulating ? "Executing Pipeline..." : "Run Step-by-Step"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
