"use client";

import React from "react";
import { siteData } from "@/content/site";
import { motion } from "motion/react";
import {
  Cpu,
  HeartPulse,
  Server,
  Zap,
  CheckCircle2,
  Sparkles,
  Layers,
  Code2,
  Workflow,
  GitBranch,
} from "lucide-react";

function MetricBar({
  label,
  value,
  suffix,
  color = "bg-accent",
}: {
  label: string;
  value: number;
  suffix: string;
  color?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-sans">
        <span className="text-ink font-medium">{label}</span>
        <span className="font-semibold text-accent font-mono">
          {value}
          {suffix}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper-2 border border-line">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

export function TechnicalDepth() {
  const models = [
    { name: "Gemini 3.8 Flash", tag: "Reasoning & Audit", role: "Primary Reasoner" },
    { name: "Gemma 4", tag: "Clinical Generation", role: "SOAP Synthesizer" },
    { name: "Qwen 3.5", tag: "Clinical Validation", role: "Medical Verification" },
    { name: "WhisperX", tag: "Diarization & ASR", role: "Acoustic Pipeline" },
    { name: "LangGraph", tag: "Multi-Agent DAGs", role: "State Orchestration" },
    { name: "ChromaDB", tag: "Hybrid Search", role: "Vector Store" },
  ];

  return (
    <section id="skills" className="py-20 md:py-28 border-b border-line bg-paper relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Editorial Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-sans text-xs tracking-wider uppercase font-semibold text-accent px-2.5 py-0.5 rounded-full border border-accent/30 bg-accent-soft">
              Technical Dossier
            </span>
            <span className="text-xs font-sans text-ink-soft">
              / Engineering Disciplines
            </span>
          </div>

          <h2 className="font-serif italic text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight">
            Architecture Pillars &amp; Core Tooling
          </h2>

          <p className="font-sans text-sm sm:text-base text-ink-soft max-w-2xl leading-relaxed">
            Structured functionally across autonomous orchestration, clinical domain representations, production evaluation harnesses, and distributed serving.
          </p>
        </div>

        {/* Bento Grid Layout - Clean, Editorial, Quiet Craft */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Multi-Agent & Reasoning Orchestration (spans 2 columns) */}
          <div className="md:col-span-2 rounded-2xl border border-line bg-paper-2/40 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-paper border border-line shadow-2xs">
                    <Workflow className="w-4 h-4 text-accent" />
                  </div>
                  <h3 className="font-serif italic text-xl sm:text-2xl text-ink">
                    1. Multi-Agent &amp; Reasoning Orchestration
                  </h3>
                </div>
                <span className="text-xs font-mono text-ink-soft bg-paper px-2.5 py-1 rounded-md border border-line">
                  Python 3.12 · LangGraph
                </span>
              </div>

              <p className="font-sans text-sm text-ink-soft leading-relaxed">
                Stateful DAG-based execution featuring cyclic reflection critic loops, deterministic overlap pre-matching, and strictly enforced human-in-the-loop confidence thresholds before action execution.
              </p>

              {/* Core Execution Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-paper border border-line space-y-1">
                  <div className="text-xs font-semibold text-ink flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-accent" />
                    <span>Cyclic State Graphs</span>
                  </div>
                  <p className="text-[11px] text-ink-soft leading-relaxed font-sans">
                    Self-correction loops evaluating ground-truth evidence before synthesis.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-paper border border-line space-y-1">
                  <div className="text-xs font-semibold text-ink flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-accent" />
                    <span>Deterministic Gating</span>
                  </div>
                  <p className="text-[11px] text-ink-soft leading-relaxed font-sans">
                    Zero LLM calls on conclusive code overlap, cutting 40% token cost.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-paper border border-line space-y-1">
                  <div className="text-xs font-semibold text-ink flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                    <span>Schema Validation</span>
                  </div>
                  <p className="text-[11px] text-ink-soft leading-relaxed font-sans">
                    Pydantic v2 strict models for zero-hallucination data mapping.
                  </p>
                </div>
              </div>
            </div>

            {/* Skills chips */}
            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-line/60">
              {siteData.technicalDepth[0].skills.map((s) => (
                <span
                  key={s}
                  className="text-xs font-sans text-ink bg-paper border border-line px-2.5 py-1 rounded-md"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Card 2: Production Metrics & Benchmarks */}
          <div className="rounded-2xl border border-line bg-paper-2/40 p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-2xs">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                <h3 className="font-serif italic text-xl text-ink">
                  2. Verified Benchmarks
                </h3>
              </div>
              <p className="font-sans text-xs text-ink-soft">
                Continuous automated regression testing and clinical accuracy metrics.
              </p>
            </div>

            <div className="space-y-3.5 py-1">
              <MetricBar label="Diagnostic Task Accuracy" value={91} suffix="%" />
              <MetricBar label="RAG Retrieval Accuracy" value={87} suffix="%" />
              <MetricBar label="Engineering Cycle Reduction" value={90} suffix="%" />
              <MetricBar label="SOAP Notes Time Savings" value={65} suffix="%" />
              <MetricBar label="LLM Token Cost Reduction" value={40} suffix="%" />
            </div>

            <div className="p-3 bg-paper border border-line rounded-xl flex items-center gap-2 text-xs font-sans text-ink-soft">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>RAGAS &amp; LangSmith CI benchmarked</span>
            </div>
          </div>

          {/* Card 3: Foundation Models & Inference Grid */}
          <div className="rounded-2xl border border-line bg-paper-2/40 p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-2xs">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-accent" />
                <h3 className="font-serif italic text-xl text-ink">
                  3. Clinical NLP &amp; Models
                </h3>
              </div>
              <p className="font-sans text-xs text-ink-soft">
                Domain-tuned biomedical representations and high-throughput transcription.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {models.map((m) => (
                <div
                  key={m.name}
                  className="p-3 bg-paper border border-line rounded-xl space-y-0.5"
                >
                  <div className="text-xs font-semibold text-ink font-sans">
                    {m.name}
                  </div>
                  <div className="text-[10px] text-ink-soft font-sans">
                    {m.role}
                  </div>
                </div>
              ))}
            </div>

            {/* Skills chips */}
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-line/60">
              {siteData.technicalDepth[1].skills.map((s) => (
                <span
                  key={s}
                  className="text-xs font-sans text-ink bg-paper border border-line px-2 py-0.5 rounded-md"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Card 4: Infra, Observability & Cloud (spans 2 columns) */}
          <div className="md:col-span-2 rounded-2xl border border-line bg-paper-2/40 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xs">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-accent" />
                <h3 className="font-serif italic text-xl sm:text-2xl text-ink">
                  4. Retrieval, LLMOps &amp; Production Infrastructure
                </h3>
              </div>
              <p className="font-sans text-xs sm:text-sm text-ink-soft leading-relaxed">
                Full-lifecycle observability, automated regression testing, containerized microservices, and human-in-the-loop workflows.
              </p>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="p-4 bg-paper border border-line rounded-xl space-y-1.5">
                  <div className="text-xs font-semibold text-accent flex items-center gap-1.5 font-sans">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>RAGAS &amp; LangSmith Observability</span>
                  </div>
                  <p className="text-xs text-ink-soft leading-relaxed font-sans">
                    Real-time latency tracing, token cost accounting, context precision curves, and faithfulness scoring on every pull request.
                  </p>
                </div>

                <div className="p-4 bg-paper border border-line rounded-xl space-y-1.5">
                  <div className="text-xs font-semibold text-accent flex items-center gap-1.5 font-sans">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Cloud &amp; Microservices Architecture</span>
                  </div>
                  <p className="text-xs text-ink-soft leading-relaxed font-sans">
                    Dockerized multi-agent workers, FastAPI asynchronous endpoints, CI/CD pipeline automation, and zero-downtime rollouts.
                  </p>
                </div>
              </div>
            </div>

            {/* Skills chips */}
            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-line/60">
              {[
                ...siteData.technicalDepth[2].skills,
                ...siteData.technicalDepth[3].skills,
              ].map((s) => (
                <span
                  key={s}
                  className="text-xs font-sans text-ink bg-paper border border-line px-2.5 py-1 rounded-md"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TechnicalDepth;
