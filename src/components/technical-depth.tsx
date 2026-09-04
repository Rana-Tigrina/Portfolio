"use client";

import React, { useState, useEffect, useRef } from "react";
import { siteData } from "@/content/site";
import { sound } from "@/lib/sound";
import { motion, useReducedMotion } from "motion/react";
import {
  Terminal,
  Cpu,
  HeartPulse,
  Server,
  Zap,
  CheckCircle2,
  Sparkles,
  Layers,
  Code2,
} from "lucide-react";

const CODE_SNIPPET = `# Production Multi-Agent LangGraph Node
from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI

async def audit_claim_node(state: ClaimAuditState) -> dict:
    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.1)
    retriever = ChromaVectorStore.as_retriever(k=5, score_threshold=0.85)
    
    context = await retriever.ainvoke(state["diagnosis_code"])
    verdict = await llm.ainvoke(
        AUDIT_PROMPT.format(claim=state["claim"], policies=context)
    )
    return {"adjudication": verdict.content, "flagged": verdict.confidence < 0.90}
`;

function TypingCodeTerminal() {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayedText(CODE_SNIPPET);
      return;
    }

    if (currentIndex < CODE_SNIPPET.length) {
      const timeout = setTimeout(
        () => {
          setDisplayedText((prev) => prev + CODE_SNIPPET[currentIndex]);
          setCurrentIndex((prev) => prev + 1);

          if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
          }
        },
        Math.random() * 20 + 8
      );
      return () => clearTimeout(timeout);
    } else {
      // Loop after a 6 second pause
      const resetTimeout = setTimeout(() => {
        setDisplayedText("");
        setCurrentIndex(0);
      }, 6000);
      return () => clearTimeout(resetTimeout);
    }
  }, [currentIndex, shouldReduceMotion]);

  return (
    <div className="flex flex-col h-full bg-paper border border-line rounded-token overflow-hidden shadow-xs">
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-paper-2 border-b border-line text-xs font-mono text-ink-soft">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          <span className="ml-2 text-ink font-semibold">claims_orchestrator.py</span>
        </div>
        <span className="text-[10px] uppercase text-accent font-semibold px-2 py-0.5 rounded-token bg-accent-soft border border-accent/20">
          Live LangGraph Agent
        </span>
      </div>

      <div
        ref={terminalRef}
        className="flex-1 p-3.5 font-mono text-[11px] leading-relaxed text-ink/90 overflow-y-auto max-h-[220px] bg-paper"
      >
        <pre className="whitespace-pre-wrap">
          {displayedText}
          <span className="animate-pulse text-accent font-bold">▎</span>
        </pre>
      </div>
    </div>
  );
}

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
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-ink font-medium">{label}</span>
        <span className="font-semibold text-accent">
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
    { name: "Gemini 2.0 Flash", tag: "Reasoning & Audit", role: "Primary LLM" },
    { name: "LLaMA 3.2", tag: "Local Edge Serving", role: "Clinical SOAP" },
    { name: "BioClinicalBERT", tag: "NER & Embeddings", role: "Medical NLP" },
    { name: "WhisperX", tag: "Word Alignment", role: "Audio Transcription" },
    { name: "LangGraph", tag: "Multi-Agent DAGs", role: "Orchestration" },
    { name: "ChromaDB", tag: "Hybrid Search", role: "Vector DB" },
  ];

  return (
    <section id="skills" className="py-16 md:py-24 border-b border-line relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-accent font-semibold tracking-wider uppercase">
              Technical Depth &amp; Engineering Stack
            </span>
            <span className="text-xs font-mono text-ink-soft">/ Bento Matrix</span>
          </div>
          <h2 className="font-serif italic text-3xl sm:text-4xl text-ink">
            Architecture Pillars &amp; Core Tooling
          </h2>
          <p className="font-sans text-sm sm:text-base text-ink-soft max-w-2xl">
            Organized functionally by system layer. Interactive Bento layout showcasing live code patterns, verified production benchmarks, and core foundation models.
          </p>
        </div>

        {/* Bento Grid Layout (Kokonut UI inspired) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Live Typing Code Terminal (spans 2 columns on desktop) */}
          <div className="md:col-span-2 border border-line rounded-token bg-paper-2/40 p-5 flex flex-col space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-accent" />
                <h3 className="font-mono text-sm font-semibold uppercase text-ink">
                  1. Multi-Agent &amp; Reasoning Orchestration
                </h3>
              </div>
              <span className="text-[11px] font-mono text-ink-soft">Python 3.12 / LangGraph</span>
            </div>

            <p className="font-sans text-xs text-ink-soft">
              DAG-based multi-agent execution with self-reflection loops, human-in-the-loop escalation, and structured Pydantic schema validation.
            </p>

            <div className="flex-1 pt-1">
              <TypingCodeTerminal />
            </div>

            {/* Skills chips */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-line/60">
              {siteData.technicalDepth[0].skills.map((s) => (
                <span
                  key={s}
                  onMouseEnter={() => sound.playClick(800)}
                  className="font-mono text-[10px] text-ink bg-paper border border-line px-2 py-0.5 rounded-token hover:border-accent hover:text-accent transition-colors cursor-default"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Card 2: Production Metrics & Benchmarks */}
          <div className="border border-line rounded-token bg-paper-2/40 p-5 flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                <h3 className="font-mono text-sm font-semibold uppercase text-ink">
                  2. Verified Benchmarks
                </h3>
              </div>
              <p className="font-sans text-xs text-ink-soft">
                Automated regression testing and clinical accuracy metrics.
              </p>
            </div>

            <div className="space-y-3.5 py-2">
              <MetricBar label="Diagnostic Task Accuracy" value={91} suffix="%" />
              <MetricBar label="RAG Retrieval Accuracy" value={87} suffix="%" />
              <MetricBar label="Engineering Cycle Reduction" value={90} suffix="%" />
              <MetricBar label="SOAP Notes Time Savings" value={65} suffix="%" />
              <MetricBar label="LLM Token Cost Reduction" value={40} suffix="%" />
            </div>

            <div className="p-3 bg-paper border border-line rounded-token flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span className="font-mono text-[11px] text-ink-soft">
                Validated using RAGAS &amp; LangSmith eval suites
              </span>
            </div>
          </div>

          {/* Card 3: Foundation Models & Inference Grid */}
          <div className="border border-line rounded-token bg-paper-2/40 p-5 flex flex-col space-y-3 shadow-xs">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-accent" />
              <h3 className="font-mono text-sm font-semibold uppercase text-ink">
                3. Clinical NLP &amp; Models
              </h3>
            </div>
            <p className="font-sans text-xs text-ink-soft">
              Domain-tuned medical entity extraction and high-throughput transcription.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {models.map((m) => (
                <div
                  key={m.name}
                  onMouseEnter={() => sound.playClick(720)}
                  className="p-2.5 bg-paper border border-line rounded-token hover:border-accent/60 transition-colors space-y-0.5 group cursor-default"
                >
                  <div className="font-mono text-xs font-semibold text-ink group-hover:text-accent transition-colors">
                    {m.name}
                  </div>
                  <div className="text-[10px] font-mono text-ink-soft">
                    {m.role}
                  </div>
                </div>
              ))}
            </div>

            {/* Skills chips */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-line/60">
              {siteData.technicalDepth[1].skills.map((s) => (
                <span
                  key={s}
                  className="font-mono text-[10px] text-ink bg-paper border border-line px-2 py-0.5 rounded-token"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Card 4: Infra, Observability & Cloud (spans 2 columns on desktop) */}
          <div className="md:col-span-2 border border-line rounded-token bg-paper-2/40 p-5 flex flex-col justify-between space-y-3 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-accent" />
                <h3 className="font-mono text-sm font-semibold uppercase text-ink">
                  4. Retrieval, LLMOps &amp; Production Infrastructure
                </h3>
              </div>
              <p className="font-sans text-xs text-ink-soft">
                Full-lifecycle observability, automated regression testing, containerized microservices, and human-in-the-loop workflows.
              </p>
            </div>

            {/* Feature matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-paper border border-line rounded-token space-y-1">
                <div className="font-mono text-xs font-semibold text-accent flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  RAGAS &amp; LangSmith Observability
                </div>
                <p className="text-xs text-ink-soft leading-relaxed">
                  Real-time latency tracing, token cost accounting, context precision curves, and faithfulness scoring on every deploy.
                </p>
              </div>

              <div className="p-3 bg-paper border border-line rounded-token space-y-1">
                <div className="font-mono text-xs font-semibold text-accent flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Cloud &amp; Microservices Architecture
                </div>
                <p className="text-xs text-ink-soft leading-relaxed">
                  Dockerized multi-agent workers, FastAPI asynchronous endpoints, CI/CD pipeline automation, and zero-downtime rollouts.
                </p>
              </div>
            </div>

            {/* Skills chips */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-line/60">
              {[
                ...siteData.technicalDepth[2].skills,
                ...siteData.technicalDepth[3].skills,
              ].map((s) => (
                <span
                  key={s}
                  onMouseEnter={() => sound.playClick(850)}
                  className="font-mono text-[10px] text-ink bg-paper border border-line px-2 py-0.5 rounded-token hover:border-accent hover:text-accent transition-colors cursor-default"
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
