"use client";

import React, { useState, useEffect } from "react";
import { sound } from "@/lib/sound";
import { Play, RotateCcw, CheckCircle2, Cpu, Database, ShieldCheck, FileText, ArrowRight } from "lucide-react";

interface TraceStage {
  id: string;
  name: string;
  role: string;
  icon: React.ElementType;
  latencyMs: number;
  outputSummary: string;
  telemetry: {
    label: string;
    value: string;
  }[];
}

const traceScenarios = [
  {
    id: "claims-audit",
    title: "Audit CMS Medicare Claim #4892 (Cardiology)",
    system: "Healthcare Claims Multi-Agent Pipeline",
    stages: [
      {
        id: "ingest",
        name: "Claim Extractor",
        role: "Deterministic Native Parse (0 LLM Calls)",
        icon: FileText,
        latencyMs: 14,
        outputSummary: "Extracted: CPT-93000 (ECG), Dx: I25.10, Total Billed: $1,420.00 via native Python parse.",
        telemetry: [
          { label: "LLM Calls", value: "0 (Native CSV/JSON)" },
          { label: "Schema Validation", value: "Pydantic Claim Valid" },
        ],
      },
      {
        id: "retrieval",
        name: "Deterministic Match & Policy",
        role: "Exact Code Overlap + ChromaDB",
        icon: Database,
        latencyMs: 135,
        outputSummary: "Exact CPT-93000 code match found. Narrowed candidate rules from ChromaDB with payer filter.",
        telemetry: [
          { label: "Exact Overlap", value: "CPT-93000 Match" },
          { label: "Candidate Rules", value: "2 Narrowed Rules" },
        ],
      },
      {
        id: "reasoning",
        name: "Auditor Agent",
        role: "Gemini 3.8 Flash Reasoning",
        icon: Cpu,
        latencyMs: 290,
        outputSummary: "Discrepancy identified: Prior auth modifier -59 absent. Composite conf: 0.928 (0.6 LLM + 0.4 Match).",
        telemetry: [
          { label: "Composite Conf", value: "0.928 (Threshold >= 0.72)" },
          { label: "Engine", value: "Gemini 3.8 Flash" },
        ],
      },
      {
        id: "orchestrator",
        name: "Appeal Drafter",
        role: "Deterministic Route -> Appeal Drafter",
        icon: ShieldCheck,
        latencyMs: 185,
        outputSummary: "Auto-drafted formal appeal letter citing rule LCD-L34522 Clause 4.2.1 verbatim with [DRAFT] marker.",
        telemetry: [
          { label: "Letter Marker", value: "[DRAFT — pending approval]" },
          { label: "Outbound Send", value: "Blocked (Hard Boundary)" },
        ],
      },
      {
        id: "eval",
        name: "Graph Integrity & State",
        role: "LangGraph Partial Dict State",
        icon: CheckCircle2,
        latencyMs: 45,
        outputSummary: "Partial dict merged cleanly. Composite conf >= 0.72 -> routed_to_human=False. Exited at END.",
        telemetry: [
          { label: "State Merge", value: "Partial Dict Merge" },
          { label: "Human Escalation", value: "Bypassed (High Conf)" },
        ],
      },
    ],
  },
  {
    id: "clinical-soap",
    title: "Clinical Consultation Audio -> SOAP Note & ICD-10",
    system: "WhisperX + Gemma 4 SOAP Pipeline",
    stages: [
      {
        id: "audio",
        name: "Acoustic Preprocessor",
        role: "Librosa + FFmpeg Denoising",
        icon: FileText,
        latencyMs: 110,
        outputSummary: "Filtered clinical ambient noise (-14dB). Formatted 16kHz WAV stream from demo.mp3.",
        telemetry: [
          { label: "SNR Improvement", value: "+18 dB" },
          { label: "Source Audio", value: "demo.mp3 (3m 42s)" },
        ],
      },
      {
        id: "diarize",
        name: "WhisperX Diarization",
        role: "Multi-Speaker Speech-to-Text",
        icon: Cpu,
        latencyMs: 420,
        outputSummary: "Segmented doctor (62%) and patient (38%) timestamped utterances with phoneme alignment.",
        telemetry: [
          { label: "WER", value: "4.1%" },
          { label: "Speaker Alignment", value: "Exact" },
        ],
      },
      {
        id: "soap",
        name: "Gemma 4 SOAP Synthesizer",
        role: "Notes made by Gemma 4",
        icon: FileText,
        latencyMs: 340,
        outputSummary: "Notes made by Gemma 4: Synthesized Subjective, Objective, Assessment, Plan documentation.",
        telemetry: [
          { label: "Engine", value: "Gemma 4" },
          { label: "Structure", value: "Standard Clinical SOAP" },
        ],
      },
      {
        id: "validation",
        name: "Qwen 3.5 Clinical Validator",
        role: "Validated by Qwen 3.5",
        icon: CheckCircle2,
        latencyMs: 260,
        outputSummary: "Validated by Qwen 3.5: Verified pharmacology (Metformin 500mg BID safe) and mapped ICD-10 (E11.9, R06.02).",
        telemetry: [
          { label: "Validator", value: "Qwen 3.5" },
          { label: "Terminology Verification", value: "95.2% SNOMED-CT" },
        ],
      },
      {
        id: "safety",
        name: "HIPAA Validation Guard",
        role: "De-identification & EHR Formatting",
        icon: ShieldCheck,
        latencyMs: 45,
        outputSummary: "Zero PHI leakage. Standard EHR JSON and formatted clinical document emitted.",
        telemetry: [
          { label: "PHI Leakage", value: "0.0%" },
          { label: "FHIR Compliance", value: "Compliant" },
        ],
      },
    ],
  },
];

export function TracePanel() {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [activeStageIdx, setActiveStageIdx] = useState(2);
  const [isRunning, setIsRunning] = useState(false);

  const scenario = traceScenarios[activeScenarioIdx];

  // Run automated live trace step-by-step
  const handleRunTrace = () => {
    sound.playClick(900);
    setIsRunning(true);
    setActiveStageIdx(0);

    let stage = 0;
    const interval = setInterval(() => {
      stage += 1;
      if (stage < scenario.stages.length) {
        sound.playClick(800 + stage * 50);
        setActiveStageIdx(stage);
      } else {
        clearInterval(interval);
        setIsRunning(false);
        sound.playSuccess();
      }
    }, 700);
  };

  const handleReset = () => {
    sound.playClick(600);
    setIsRunning(false);
    setActiveStageIdx(0);
  };

  const currentStage = scenario.stages[activeStageIdx] || scenario.stages[0];
  const totalLatency = scenario.stages
    .slice(0, activeStageIdx + 1)
    .reduce((acc, s) => acc + s.latencyMs, 0);

  return (
    <div
      id="trace"
      className="w-full bg-paper-2 border border-line rounded-token p-4 sm:p-5 transition-all duration-200"
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-line">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
          <span className="font-mono text-xs font-semibold text-ink tracking-tight uppercase">
            Live AI Pipeline Trace
          </span>
          <span className="text-[11px] font-mono text-ink-soft bg-paper border border-line px-1.5 py-0.5 rounded-token">
            v2.4
          </span>
        </div>

        {/* Scenario Selector & Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={activeScenarioIdx}
            onChange={(e) => {
              sound.playClick(750);
              setActiveScenarioIdx(Number(e.target.value));
              setActiveStageIdx(0);
            }}
            disabled={isRunning}
            className="text-xs font-mono bg-paper border border-line text-ink px-2 py-1 rounded-token focus:outline-none focus:border-accent cursor-pointer disabled:opacity-60"
          >
            {traceScenarios.map((sc, i) => (
              <option key={sc.id} value={i}>
                {sc.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleRunTrace}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium text-paper bg-ink hover:opacity-90 active:scale-95 rounded-token transition-all disabled:opacity-50 cursor-pointer"
          >
            <Play className={`w-3 h-3 ${isRunning ? "animate-spin" : ""}`} />
            <span>{isRunning ? "Tracing..." : "Run Trace"}</span>
          </button>

          <button
            onClick={handleReset}
            disabled={isRunning}
            title="Reset Trace"
            className="p-1 text-ink-soft hover:text-ink border border-line hover:bg-paper rounded-token transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5-Stage Stepper Flow */}
      <div className="pt-4 pb-3 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[540px] gap-2">
          {scenario.stages.map((st, idx) => {
            const isCompleted = idx < activeStageIdx;
            const isCurrent = idx === activeStageIdx;
            const Icon = st.icon;

            return (
              <React.Fragment key={st.id}>
                <button
                  onClick={() => {
                    sound.playClick(800);
                    setActiveStageIdx(idx);
                  }}
                  className={`flex-1 flex flex-col items-start p-2.5 rounded-token border transition-all text-left cursor-pointer ${
                    isCurrent
                      ? "bg-paper border-accent shadow-xs ring-1 ring-accent/30"
                      : isCompleted
                      ? "bg-paper/70 border-line text-ink"
                      : "bg-paper/30 border-line/60 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-mono text-[10px] text-ink-soft font-medium">
                      0{idx + 1}
                    </span>
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        isCurrent ? "text-accent" : "text-ink-soft"
                      }`}
                    />
                  </div>
                  <div className="font-mono text-xs font-semibold text-ink truncate w-full">
                    {st.name}
                  </div>
                  <div className="font-mono text-[10px] text-ink-soft truncate w-full">
                    {st.latencyMs}ms
                  </div>
                </button>

                {idx < scenario.stages.length - 1 && (
                  <ArrowRight
                    className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                      idx < activeStageIdx ? "text-accent" : "text-line"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Stage Inspection Terminal Drawer */}
      <div className="mt-2 p-3 bg-paper border border-line rounded-token font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-line/60 text-ink-soft text-[11px]">
          <div className="flex items-center gap-2">
            <span className="text-accent font-semibold">STAGE 0{activeStageIdx + 1}:</span>
            <span className="text-ink font-medium">{currentStage.name}</span>
            <span className="text-ink-soft">({currentStage.role})</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Stage Latency: <strong className="text-ink">{currentStage.latencyMs}ms</strong></span>
            <span>Cumulative: <strong className="text-ink">{totalLatency}ms</strong></span>
          </div>
        </div>

        {/* Output Log */}
        <div className="py-2.5 text-ink leading-relaxed">
          <span className="text-ink-soft select-none">&gt; </span>
          {currentStage.outputSummary}
        </div>

        {/* Telemetry Chips */}
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          {currentStage.telemetry.map((t, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-paper-2 border border-line text-[10px] rounded-token text-ink-soft"
            >
              <span>{t.label}:</span>
              <strong className="text-ink font-semibold">{t.value}</strong>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
