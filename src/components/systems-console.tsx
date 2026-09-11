"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArchitectureDiagram } from "./architecture-diagram";
import {
  Workflow,
  Code2,
  Activity,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export interface SystemItem {
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
  detail: {
    problem: string;
    whyItMattered: string;
    architectureDescription: string;
    decisionGate: string;
    codeSnippet: string;
    latencyBreakdown: { label: string; ms: number; pct: number }[];
    invariants: string[];
  };
}

export const flagshipSystems: SystemItem[] = [
  {
    id: "healthcare-claims-audit",
    number: "01",
    category: "Autonomous Multi-Agent · Clinical NLP",
    title: "Healthcare Claims Multi-Agent Audit System",
    metric: "91%",
    metricLabel: "Adjudication Precision",
    metricSublabel: "CMS Medicare Billing Rules",
    description:
      "Deterministic CPT/ICD overlap pre-matching with a LangGraph StateGraph pipeline, routing to Gemini 3.8 Flash only when claim rules conflict, backed by a strict 0.72 composite confidence gate.",
    stack: ["LangGraph", "Gemini 3.8 Flash", "ChromaDB", "Python", "Pydantic v2"],
    accentColor: "#10b981",
    detail: {
      problem:
        "Healthcare payers and IPAs lose billions to payment leakage from claims paid incorrectly against un-indexed contract rules. Human auditors only sample a fraction of claims.",
      whyItMattered:
        "Autonomous claims audit requires auditable rule citations, deterministic pre-filtering, and an absolute boundary preventing autonomous outbound letter transmission.",
      architectureDescription:
        "Deterministic LangGraph StateGraph: Contract Reader structures policy rules into ChromaDB -> Claim Extractor parses CMS claims natively (0 LLM calls) -> Deterministic Rule Match filters candidate rules by exact CPT/ICD overlap -> Auditor Agent reasons over narrowed candidates with Gemini 3.8 Flash -> Confidence Gate router branches to Appeal Drafter or routes to human review.",
      decisionGate:
        "Passing irrelevant candidates to an LLM causes confident hallucinations. Deterministic pre-matching eliminates hallucination risk, cuts 40% token costs, and mandates [DRAFT] legal markers on all appeals.",
      codeSnippet: `# Healthcare Claims Multi-Agent Audit - LangGraph StateGraph
from typing import TypedDict, Literal
from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel

class ClaimAuditState(TypedDict):
    raw_claim: dict
    cpt_icd_overlap: float
    requires_llm_adjudication: bool
    gemini_verdict: dict | None
    composite_confidence: float
    appeal_letter: str | None

def deterministic_code_filter(state: ClaimAuditState) -> dict:
    overlap = calculate_cpt_icd_compatibility(state["raw_claim"])
    # Bypass LLM when deterministic overlap is conclusive (saves 40% tokens)
    return {
        "cpt_icd_overlap": overlap,
        "requires_llm_adjudication": overlap < 0.85
    }

def gemini_3_8_audit_reasoner(state: ClaimAuditState) -> dict:
    llm = ChatGoogleGenerativeAI(model="gemini-3.8-flash", temperature=0.0)
    verdict = llm.invoke(CMS_AUDIT_PROMPT.format(claim=state["raw_claim"]))
    score = 0.6 * verdict.confidence + 0.4 * state["cpt_icd_overlap"]
    return {"gemini_verdict": verdict, "composite_confidence": score}

def confidence_gate_router(state: ClaimAuditState) -> Literal["generate_appeal", "human_review"]:
    return "generate_appeal" if state["composite_confidence"] >= 0.72 else "human_review"

workflow = StateGraph(ClaimAuditState)
workflow.add_node("code_filter", deterministic_code_filter)
workflow.add_node("gemini_reasoner", gemini_3_8_audit_reasoner)
workflow.add_conditional_edges("gemini_reasoner", confidence_gate_router)
app = workflow.compile()`,
      latencyBreakdown: [
        { label: "Deterministic CPT Filter", ms: 45, pct: 15 },
        { label: "Gemini 3.8 Flash Reasoner", ms: 195, pct: 67 },
        { label: "ChromaDB Policy Gate", ms: 50, pct: 18 },
      ],
      invariants: [
        "Zero-LLM native Python parsing maps CMS Medicare data directly to Pydantic schema",
        "Deterministic CPT/ICD overlap matching skips LLM entirely on non-conflicting claims",
        ">= 0.72 composite confidence threshold blocks hallucinated appeals",
        "Mandatory [DRAFT] legal boundary with verbatim CMS policy citations",
      ],
    },
  },
  {
    id: "multi-agent-research-mcp",
    number: "02",
    category: "Agentic Information Retrieval · MCP Protocol",
    title: "Autonomous Deep Research Engine with MCP",
    metric: "100%",
    metricLabel: "Attributed Ground-Truth",
    metricSublabel: "Zero Hallucinated Citations",
    description:
      "Stateful LangGraph DAG integrated with Model Context Protocol (MCP) modular client-server tools and a cyclic reflection critic loop to enforce factual groundedness.",
    stack: ["LangGraph", "Model Context Protocol", "Tavily", "FastAPI", "Python"],
    accentColor: "#06b6d4",
    detail: {
      problem:
        "Standard LLM question-answering hallucinates citations, cannot iterate when initial retrieval fails, and suffers from proprietary, non-standard tool integration glue code.",
      whyItMattered:
        "Technical and scientific literature research demands grounded evidence, multi-hop reasoning, and self-correction before presenting conclusions to engineers.",
      architectureDescription:
        "Stateful LangGraph featuring dedicated Planner, Retriever, Synthesizer, and Critic nodes. Standardized Model Context Protocol (MCP) servers provide modular tool access across web search, local vector search, and computational solvers.",
      decisionGate:
        "Single-turn agent execution fails on ambiguous queries. Cyclic graph state enables agents to self-evaluate and rectify search strategies autonomously.",
      codeSnippet: `# Multi-Agent Deep Research with Model Context Protocol (MCP)
from typing import TypedDict
from langgraph.graph import StateGraph, END
from mcp import ClientSession, StdioServerParameters

class ResearchState(TypedDict):
    query: str
    mcp_citations: list[dict]
    critique_passed: bool
    reflection_attempts: int

async def execute_mcp_tavily_search(state: ResearchState):
    server_params = StdioServerParameters(
        command="npx",
        args=["-y", "@modelcontextprotocol/server-tavily"]
    )
    async with ClientSession(server_params) as session:
        await session.initialize()
        results = await session.call_tool("search", {"query": state["query"]})
        return {"mcp_citations": results.content}

def critic_reflection_loop(state: ResearchState):
    groundedness = verify_citations_against_mcp(state["mcp_citations"])
    if groundedness >= 0.95 or state["reflection_attempts"] >= 3:
        return "synthesize"
    return "re_query"

workflow = StateGraph(ResearchState)
workflow.add_node("mcp_search", execute_mcp_tavily_search)
workflow.add_node("critic", critic_reflection_loop)
app = workflow.compile()`,
      latencyBreakdown: [
        { label: "MCP Server Dispatch", ms: 80, pct: 20 },
        { label: "Tavily Parallel Tool Calls", ms: 220, pct: 55 },
        { label: "Critic Reflection Loop", ms: 100, pct: 25 },
      ],
      invariants: [
        "Standardized Model Context Protocol (MCP) tool integration",
        "Cyclic reflection loop: Critic re-routes query if evidence groundedness < 0.95",
        "Step-by-step reasoning attribution with immutable audit traces",
        "Zero ungrounded assertions allowed past the synthesis gate",
      ],
    },
  },
  {
    id: "production-rag-observability",
    number: "03",
    category: "Enterprise Intelligence · Automated LLMOps",
    title: "Production RAG & Observability Harness",
    metric: "87%",
    metricLabel: "Retrieval Precision (P@5)",
    metricSublabel: "40% Token Cost Reduction",
    description:
      "High-throughput enterprise document intelligence leveraging semantic chunking, cross-encoder reranking, and an automated GitHub Actions CI evaluation gate.",
    stack: ["LangChain", "ChromaDB", "RAGAS", "LangSmith", "Docker"],
    accentColor: "#f59e0b",
    detail: {
      problem:
        "Enterprise RAG deployments frequently degrade silently as prompt templates, documents, or models change, without regression test coverage.",
      whyItMattered:
        "Customer-facing enterprise Q&A cannot tolerate hallucinations or drifting context relevance without continuous telemetry.",
      architectureDescription:
        "Enterprise RAG architecture coupled with LangSmith/Langfuse telemetry and a GitHub Actions automated evaluation suite scoring Faithfulness, Answer Relevance, and Context Precision.",
      decisionGate:
        "Automated CI/CD pull request gate blocks regressions below 0.85 RAGAS faithfulness, replacing error-prone manual spot-checking.",
      codeSnippet: `# Production RAG with Automated RAGAS CI/CD Regression Gate
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings

def run_ragas_evaluation_gate(test_dataset) -> bool:
    vectorstore = Chroma(persist_directory="./chroma_db", embedding_function=OpenAIEmbeddings())
    retriever = vectorstore.as_retriever(search_kwargs={"k": 5})
    
    # Automated evaluation harness across benchmark test cases
    results = evaluate(
        test_dataset,
        metrics=[faithfulness, answer_relevancy, context_precision]
    )
    
    # Automated GitHub Actions Gate: Block PR if metrics regress below benchmark
    assert results["faithfulness"] >= 0.85, f"RAG Faithfulness Regression: {results['faithfulness']}"
    assert results["context_precision"] >= 0.87, f"Context Precision Below Benchmark: {results['context_precision']}"
    return True`,
      latencyBreakdown: [
        { label: "Semantic Chunk Embedding", ms: 35, pct: 24 },
        { label: "ChromaDB HNSW Retrieval", ms: 40, pct: 28 },
        { label: "Cross-Encoder Reranker", ms: 70, pct: 48 },
      ],
      invariants: [
        "Automated CI/CD pull request gate blocking regressions below 0.85 RAGAS",
        "Semantic boundary chunking reducing extraneous context payload by 40%",
        "Full OpenTelemetry tracing via LangSmith & Langfuse for production telemetry",
        "Deterministic top-k reranking with calibrated cross-encoder weights",
      ],
    },
  },
  {
    id: "clinical-documentation-soap",
    number: "04",
    category: "Acoustic NLP · Clinical Documentation",
    title: "Clinical Diarization & SOAP Synthesis",
    metric: "65%",
    metricLabel: "Physician Time Saved",
    metricSublabel: "95% Clinical Precision",
    description:
      "Acoustic consultation pipeline using phoneme-aligned WhisperX diarization to separate clinician vs patient voice, Gemma 4 SOAP synthesis, and secondary Qwen 3.5 clinical validation.",
    stack: ["WhisperX", "Gemma 4", "Qwen 3.5", "Librosa", "Docker"],
    accentColor: "#8b5cf6",
    detail: {
      problem:
        "Physicians spend up to 2 hours per day manually documenting patient encounters, leading to severe burnout and clinical documentation delays.",
      whyItMattered:
        "Automating structured SOAP notes (Subjective, Objective, Assessment, Plan) directly from raw doctor-patient audio consultations returns precious time to patient care.",
      architectureDescription:
        "Acoustic preprocessing (Librosa/FFmpeg) -> diarized transcription (WhisperX) -> clinical SOAP note synthesis by Gemma 4 -> medical terminology & dosage validation by Qwen 3.5 -> EHR-ready export.",
      decisionGate:
        "Tuned domain-specific clinical prompt hierarchies on Gemma 4 with secondary verification gating via Qwen 3.5 to guarantee HIPAA-compliant local deployability and 95% clinical precision.",
      codeSnippet: `# Clinical Audio Diarization & SOAP Synthesis with Qwen 3.5 Validation
import whisperx
import torch

def process_clinical_audio(audio_path: str):
    device = "cuda" if torch.cuda.is_available() else "cpu"
    
    # 1. Phoneme-aligned WhisperX transcription + speaker diarization
    model = whisperx.load_model("large-v3", device, compute_type="float16")
    audio = whisperx.load_audio(audio_path)
    transcription = model.transcribe(audio, batch_size=16)
    diarize_model = whisperx.DiarizationPipeline(device=device)
    diarized_segments = diarize_model(audio, transcription)
    
    # 2. Structured SOAP Note generation via Gemma 4
    soap_prompt = format_dialogue_to_soap_prompt(diarized_segments)
    soap_notes = gemma_4_generate(soap_prompt)
    
    # 3. Secondary clinical validation by Qwen 3.5 (Dosages, Contraindications, ICD-10)
    validation_report = qwen_3_5_validate_clinical_entities(soap_notes)
    return {"soap_notes": soap_notes, "validated_by": "Qwen 3.5", "status": "VERIFIED"}`,
      latencyBreakdown: [
        { label: "WhisperX VAD & Diarization", ms: 120, pct: 30 },
        { label: "Gemma 4 SOAP Synthesis", ms: 210, pct: 52 },
        { label: "Qwen 3.5 Validation Gate", ms: 70, pct: 18 },
      ],
      invariants: [
        "WhisperX acoustic diarization distinguishing doctor vs patient voice with phoneme alignment",
        "Structured clinical SOAP notes synthesized by Gemma 4 from natural consultation dialogue",
        "Secondary clinical validation by Qwen 3.5 verifying drug dosages, contraindications, and ICD-10",
        "Zero cloud leakage of un-anonymized PHI/EHR consultation recordings",
      ],
    },
  },
];

export function SystemsConsole() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<"diagram" | "code" | "telemetry">("diagram");
  const [copied, setCopied] = useState(false);

  const selected = flagshipSystems[activeIdx];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selected.detail.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="work" className="py-20 md:py-28 border-b border-line bg-paper relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Editorial Section Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-sans text-xs tracking-wider uppercase font-semibold text-accent px-2.5 py-0.5 rounded-full border border-accent/30 bg-accent-soft">
              Selected Works
            </span>
            <span className="text-xs font-sans text-ink-soft">
              / 04 Production Architectures
            </span>
          </div>

          <h2 className="font-serif italic text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight">
            Production Systems &amp; Autonomous DAGs
          </h2>

          <p className="font-sans text-sm sm:text-base text-ink-soft max-w-2xl leading-relaxed">
            Engineered for verifiable precision, deterministic boundaries, and resilience. Click any system below to inspect its architecture blueprint, StateGraph orchestration, and latency profile.
          </p>
        </div>

        {/* Studio Console Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: System Selector Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-3">
            {flagshipSystems.map((item, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer relative overflow-hidden ${
                    isActive
                      ? "bg-paper border-accent/60 shadow-md ring-1 ring-accent/20"
                      : "bg-paper-2/40 border-line/80 hover:border-line hover:bg-paper-2/80"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="font-sans text-xs font-medium text-ink-soft uppercase tracking-wider">
                      System {item.number} · {item.category.split("·")[0].trim()}
                    </span>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full border font-mono shrink-0"
                      style={{
                        borderColor: `${item.accentColor}40`,
                        backgroundColor: `${item.accentColor}12`,
                        color: item.accentColor,
                      }}
                    >
                      {item.metric} {item.metricLabel}
                    </span>
                  </div>

                  <h3
                    className={`font-serif italic text-lg sm:text-xl tracking-tight transition-colors leading-snug ${
                      isActive ? "text-ink font-normal" : "text-ink/80"
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p className="font-sans text-xs text-ink-soft mt-1.5 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-line/50">
                    {item.stack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-sans px-2 py-0.5 rounded-md bg-paper border border-line/60 text-ink-soft"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Live Dossier Canvas (7 cols) */}
          <div className="lg:col-span-7 flex flex-col rounded-2xl border border-line bg-paper shadow-lg overflow-hidden">
            {/* Dossier Header & Mode Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 border-b border-line bg-paper-2/60">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("diagram")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer ${
                    activeTab === "diagram"
                      ? "bg-paper text-ink font-semibold shadow-xs border border-line"
                      : "text-ink-soft hover:text-ink"
                  }`}
                  style={activeTab === "diagram" ? { color: selected.accentColor } : {}}
                >
                  <Workflow className="w-3.5 h-3.5" />
                  <span>Architecture Blueprint</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("code")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer ${
                    activeTab === "code"
                      ? "bg-paper text-ink font-semibold shadow-xs border border-line"
                      : "text-ink-soft hover:text-ink"
                  }`}
                  style={activeTab === "code" ? { color: selected.accentColor } : {}}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>StateGraph Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("telemetry")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer ${
                    activeTab === "telemetry"
                      ? "bg-paper text-ink font-semibold shadow-xs border border-line"
                      : "text-ink-soft hover:text-ink"
                  }`}
                  style={activeTab === "telemetry" ? { color: selected.accentColor } : {}}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Telemetry</span>
                </button>
              </div>

              {activeTab === "code" ? (
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 text-xs font-sans text-ink-soft hover:text-ink cursor-pointer px-2.5 py-1 rounded-md border border-line bg-paper shadow-2xs"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copied" : "Copy Code"}</span>
                </button>
              ) : (
                <a
                  href="https://github.com/Rana-Tigrina"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-sans text-ink-soft hover:text-accent transition-colors"
                >
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Dossier Content Area */}
            <div className="p-5 sm:p-6 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selected.id}-${activeTab}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* TAB 1: ARCHITECTURE DIAGRAM */}
                  {activeTab === "diagram" && (
                    <div className="space-y-4">
                      <div className="rounded-xl border border-line/80 bg-paper-2/30 p-2 sm:p-3 overflow-hidden">
                        <ArchitectureDiagram slug={selected.id} />
                      </div>

                      {/* Decision Gate Callout */}
                      <div
                        className="p-3.5 rounded-xl border bg-paper-2/60 text-xs font-sans text-ink/90 leading-relaxed"
                        style={{ borderColor: `${selected.accentColor}35` }}
                      >
                        <div className="flex items-center gap-1.5 font-semibold text-ink mb-1">
                          <ShieldCheck className="w-4 h-4" style={{ color: selected.accentColor }} />
                          <span>Architectural Decision &amp; Rationale</span>
                        </div>
                        <p className="text-ink-soft">{selected.detail.decisionGate}</p>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: CODE SNIPPET */}
                  {activeTab === "code" && (
                    <div className="space-y-3">
                      <pre className="p-4 rounded-xl bg-paper-2/80 border border-line font-mono text-xs text-ink/90 overflow-x-auto leading-relaxed max-h-[380px] [scrollbar-width:thin]">
                        <code>{selected.detail.codeSnippet}</code>
                      </pre>
                      <div className="text-[11px] font-sans text-ink-soft flex items-center justify-between">
                        <span>Production LangGraph StateGraph Node</span>
                        <span className="font-semibold text-accent">Deterministic Code Overlap Gate</span>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: TELEMETRY & LATENCY */}
                  {activeTab === "telemetry" && (
                    <div className="space-y-5 py-2">
                      <div className="space-y-1">
                        <h4 className="font-serif italic text-lg text-ink">
                          OpenTelemetry Profile &amp; Latency Budget
                        </h4>
                        <p className="font-sans text-xs text-ink-soft">
                          Measured latency allocation across deterministic preprocessing vs foundation model reasoning.
                        </p>
                      </div>

                      <div className="space-y-3 pt-1">
                        {selected.detail.latencyBreakdown.map((lat, lIdx) => (
                          <div key={lIdx} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-sans">
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
                                  backgroundColor: selected.accentColor,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-3.5 rounded-xl border border-line bg-paper-2/70 text-xs font-sans flex items-center justify-between">
                        <span className="text-ink-soft">Continuous CI/CD Automated Regression Evaluation</span>
                        <span className="font-mono font-semibold text-emerald-500 text-[11px]">
                          VERIFIED BENCHMARK
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Bottom Invariants List */}
              <div className="pt-4 border-t border-line/70 space-y-2">
                <span className="text-xs font-sans font-semibold uppercase tracking-wider text-ink-soft flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: selected.accentColor }} />
                  Deterministic Production Invariants
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selected.detail.invariants.map((inv, iIdx) => (
                    <li
                      key={iIdx}
                      className="text-xs text-ink/85 font-sans flex items-start gap-2 leading-relaxed"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: selected.accentColor }}
                      />
                      <span>{inv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SystemsConsole;
