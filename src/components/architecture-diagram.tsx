"use client";

import React, { useState } from "react";
import { sound } from "@/lib/sound";
import { Sparkles } from "lucide-react";

interface NodeInfo {
  id: string;
  title: string;
  type: "input" | "agent" | "decision" | "output" | "tool";
  modelOrTool: string;
  input: string;
  output: string;
  latencyOrMetric: string;
}

interface DiagramProps {
  slug: string;
}

export function ArchitectureDiagram({ slug }: DiagramProps) {
  const [selectedNode, setSelectedNode] = useState<NodeInfo | null>(null);

  if (slug === "healthcare-claims-audit") {
    const nodes: NodeInfo[] = [
      {
        id: "policy-doc",
        title: "CMS Policy Documents",
        type: "input",
        modelOrTool: "Medicare PDF / LCD Corpus",
        input: "Unstructured Medicare policy guidelines & rules",
        output: "Chunked documents indexed in ChromaDB",
        latencyOrMetric: "1,200 pages indexed",
      },
      {
        id: "contract-reader",
        title: "Contract Reader Agent",
        type: "agent",
        modelOrTool: "ChromaDB RAG + Gemini Flash",
        input: "Billing codes (CPT/ICD-10) from claim",
        output: "Relevant policy constraints & prior-auth clauses",
        latencyOrMetric: "145ms cosine search",
      },
      {
        id: "claim-extractor",
        title: "Claim Extractor Agent",
        type: "agent",
        modelOrTool: "BioClinicalBERT + JSON Schema",
        input: "Raw billing claim form (CMS-1500)",
        output: "Structured patient diagnosis, modifier codes",
        latencyOrMetric: "82ms schema validation",
      },
      {
        id: "auditor",
        title: "Auditor Agent",
        type: "agent",
        modelOrTool: "Gemini 2.0 Flash Reasoning",
        input: "Extracted claim + Policy constraints",
        output: "Audit verdict & compliance discrepancy rationale",
        latencyOrMetric: "310ms inference",
      },
      {
        id: "confidence-check",
        title: "Confidence Gate (>0.85)",
        type: "decision",
        modelOrTool: "Deterministic Rule Engine",
        input: "Auditor confidence score",
        output: "Binary routing: Auto-Appeal vs Human Escalate",
        latencyOrMetric: "Deterministic (0ms)",
      },
      {
        id: "appeal-drafter",
        title: "Appeal Drafter Agent",
        type: "agent",
        modelOrTool: "Few-Shot Legal Drafter",
        input: "Denial discrepancy & regulatory references",
        output: "Formal CMS appeal letter with legal citations",
        latencyOrMetric: "195ms draft generation",
      },
    ];

    const handleNodeClick = (node: NodeInfo) => {
      sound.playClick(850);
      setSelectedNode(node);
    };

    return (
      <div className="p-4 bg-paper-2/70 border border-line rounded-token">
        <div className="flex items-center justify-between pb-3 text-xs font-mono text-ink-soft">
          <span className="font-semibold text-ink uppercase tracking-wider">
            System Architecture · 5-Agent Pipeline
          </span>
          <span className="flex items-center gap-1 text-accent text-[11px]">
            <Sparkles className="w-3 h-3" /> Click any node to inspect telemetry
          </span>
        </div>

        {/* SVG Flowchart */}
        <div className="w-full overflow-x-auto py-2">
          <svg
            viewBox="0 0 760 160"
            className="w-full min-w-[680px] h-auto font-mono text-[11px]"
            aria-label="Healthcare Claims Multi-Agent Architecture Diagram"
          >
            {/* Connection Lines */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 6 3, 0 6" fill="var(--ink-soft)" />
              </marker>
            </defs>

            {/* Line: Contract Reader to Claim Extractor */}
            <line x1="120" y1="80" x2="160" y2="80" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
            {/* Line: Claim Extractor to Auditor */}
            <line x1="280" y1="80" x2="320" y2="80" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
            {/* Line: Auditor to Confidence Gate */}
            <line x1="440" y1="80" x2="480" y2="80" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
            {/* Line: Confidence to Appeal Drafter */}
            <line x1="600" y1="65" x2="640" y2="45" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
            {/* Line: Confidence to Human Review */}
            <line x1="600" y1="95" x2="640" y2="115" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />

            {/* Node 1: Contract Reader */}
            <g
              onClick={() => handleNodeClick(nodes[1])}
              className="cursor-pointer group"
            >
              <rect
                x="10"
                y="55"
                width="110"
                height="50"
                rx="4"
                fill="var(--paper)"
                stroke="var(--line)"
                strokeWidth="1.4"
                className="group-hover:stroke-accent transition-colors"
              />
              <text x="65" y="78" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">
                Contract Reader
              </text>
              <text x="65" y="93" textAnchor="middle" fill="var(--ink-soft)" className="text-[9px]">
                Policy RAG
              </text>
            </g>

            {/* Node 2: Claim Extractor */}
            <g
              onClick={() => handleNodeClick(nodes[2])}
              className="cursor-pointer group"
            >
              <rect
                x="160"
                y="55"
                width="120"
                height="50"
                rx="4"
                fill="var(--paper)"
                stroke="var(--line)"
                strokeWidth="1.4"
                className="group-hover:stroke-accent transition-colors"
              />
              <text x="220" y="78" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">
                Claim Extractor
              </text>
              <text x="220" y="93" textAnchor="middle" fill="var(--ink-soft)" className="text-[9px]">
                BioClinicalBERT
              </text>
            </g>

            {/* Node 3: Auditor */}
            <g
              onClick={() => handleNodeClick(nodes[3])}
              className="cursor-pointer group"
            >
              <rect
                x="320"
                y="55"
                width="120"
                height="50"
                rx="4"
                fill="var(--paper)"
                stroke="var(--accent)"
                strokeWidth="1.8"
                className="group-hover:stroke-accent transition-colors"
              />
              <text x="380" y="78" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">
                Auditor Agent
              </text>
              <text x="380" y="93" textAnchor="middle" fill="var(--accent)" className="font-semibold text-[9px]">
                Gemini 2.0 Flash
              </text>
            </g>

            {/* Node 4: Confidence Gate */}
            <g
              onClick={() => handleNodeClick(nodes[4])}
              className="cursor-pointer group"
            >
              <rect
                x="480"
                y="55"
                width="120"
                height="50"
                rx="4"
                fill="var(--paper)"
                stroke="var(--line)"
                strokeWidth="1.4"
                className="group-hover:stroke-accent transition-colors"
              />
              <text x="540" y="78" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">
                Confidence Gate
              </text>
              <text x="540" y="93" textAnchor="middle" fill="var(--ink-soft)" className="text-[9px]">
                Threshold &gt; 0.85
              </text>
            </g>

            {/* Node 5A: Appeal Drafter */}
            <g
              onClick={() => handleNodeClick(nodes[5])}
              className="cursor-pointer group"
            >
              <rect
                x="640"
                y="20"
                width="110"
                height="45"
                rx="4"
                fill="var(--paper)"
                stroke="var(--line)"
                strokeWidth="1.4"
                className="group-hover:stroke-accent transition-colors"
              />
              <text x="695" y="42" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">
                Appeal Drafter
              </text>
              <text x="695" y="55" textAnchor="middle" fill="var(--accent)" className="font-semibold text-[9px]">
                Automated Letter
              </text>
            </g>

            {/* Node 5B: Human Review */}
            <g
              onClick={() =>
                handleNodeClick({
                  id: "human-loop",
                  title: "Human Review Fallback",
                  type: "output",
                  modelOrTool: "Streamlit UI Dashboard",
                  input: "Low-confidence (<0.85) claim flagged",
                  output: "Physician/Auditor validation interface",
                  latencyOrMetric: "Manual triage queue",
                })
              }
              className="cursor-pointer group"
            >
              <rect
                x="640"
                y="95"
                width="110"
                height="45"
                rx="4"
                fill="var(--paper)"
                stroke="var(--line)"
                strokeWidth="1.4"
                className="group-hover:stroke-accent transition-colors"
              />
              <text x="695" y="117" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">
                Human In Loop
              </text>
              <text x="695" y="130" textAnchor="middle" fill="var(--ink-soft)" className="text-[9px]">
                Auditor Escalation
              </text>
            </g>
          </svg>
        </div>

        {/* Node Inspector Drawer */}
        {selectedNode ? (
          <div className="mt-3 p-3.5 bg-paper border border-accent/40 rounded-token text-xs font-mono shadow-xs animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-line text-ink">
              <span className="font-semibold text-accent flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> NODE: {selectedNode.title}
              </span>
              <span className="text-[11px] text-ink-soft bg-paper-2 px-2 py-0.5 rounded-token border border-line">
                Engine: {selectedNode.modelOrTool}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2.5 text-[11px]">
              <div>
                <span className="text-ink-soft block font-semibold">Input Payload:</span>
                <span className="text-ink pt-0.5 block">{selectedNode.input}</span>
              </div>
              <div>
                <span className="text-ink-soft block font-semibold">Output Payload:</span>
                <span className="text-ink pt-0.5 block">{selectedNode.output}</span>
              </div>
              <div>
                <span className="text-ink-soft block font-semibold">Telemetry Metric:</span>
                <span className="text-accent font-semibold pt-0.5 block">{selectedNode.latencyOrMetric}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-2 text-center text-[11px] font-mono text-ink-soft py-1">
            Click any node above to inspect input/output schemas &amp; telemetry
          </div>
        )}
      </div>
    );
  }

  // Multi-Agent Research Assistant with MCP
  if (slug === "multi-agent-research-mcp") {
    return (
      <div className="p-4 bg-paper-2/70 border border-line rounded-token">
        <div className="flex items-center justify-between pb-2 text-xs font-mono text-ink-soft">
          <span className="font-semibold text-ink uppercase tracking-wider">
            LangGraph State Architecture + MCP Protocol
          </span>
          <span className="text-accent text-[11px]">Cyclic Reflection Graph</span>
        </div>

        <div className="w-full overflow-x-auto py-2">
          <svg
            viewBox="0 0 720 140"
            className="w-full min-w-[620px] h-auto font-mono text-[11px]"
            aria-label="Multi-Agent LangGraph MCP Diagram"
          >
            {/* User Query -> Planner */}
            <line x1="90" y1="70" x2="130" y2="70" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
            {/* Planner -> Retriever */}
            <line x1="230" y1="70" x2="270" y2="70" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
            {/* Retriever -> Critic */}
            <line x1="370" y1="70" x2="410" y2="70" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
            {/* Critic -> Answer */}
            <line x1="510" y1="55" x2="550" y2="40" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
            {/* Critic -> Re-Plan (Loop) */}
            <path d="M 460 95 L 460 120 L 180 120 L 180 95" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4" markerEnd="url(#arrowhead)" />

            {/* Nodes */}
            <rect x="10" y="48" width="80" height="44" rx="4" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.4" />
            <text x="50" y="74" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">User Query</text>

            <rect x="130" y="48" width="100" height="44" rx="4" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.4" />
            <text x="180" y="68" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">Planner Node</text>
            <text x="180" y="82" textAnchor="middle" fill="var(--ink-soft)" className="text-[9px]">Goal Decompose</text>

            <rect x="270" y="48" width="100" height="44" rx="4" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.4" />
            <text x="320" y="68" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">Retriever Node</text>
            <text x="320" y="82" textAnchor="middle" fill="var(--accent)" className="font-semibold text-[9px]">MCP Servers</text>

            <rect x="410" y="48" width="100" height="44" rx="4" fill="var(--paper)" stroke="var(--accent)" strokeWidth="1.8" />
            <text x="460" y="68" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">Critic Node</text>
            <text x="460" y="82" textAnchor="middle" fill="var(--ink-soft)" className="text-[9px]">Citation Check</text>

            <rect x="550" y="20" width="120" height="40" rx="4" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.4" />
            <text x="610" y="44" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">Grounded Output</text>

            {/* Feedback Loop Label */}
            <text x="320" y="132" textAnchor="middle" fill="var(--accent)" className="text-[9px] font-semibold">
              Cyclic Re-Plan Loop (Triggered upon citation gap or ambiguity)
            </text>
          </svg>
        </div>
      </div>
    );
  }

  // Production RAG & Observability
  return (
    <div className="p-4 bg-paper-2/70 border border-line rounded-token">
      <div className="flex items-center justify-between pb-2 text-xs font-mono text-ink-soft">
        <span className="font-semibold text-ink uppercase tracking-wider">
          Production RAG + RAGAS Observability Pipeline
        </span>
        <span className="text-accent text-[11px]">Telemetry &amp; CI/CD Gated</span>
      </div>

      <div className="w-full overflow-x-auto py-2">
        <svg
          viewBox="0 0 720 120"
          className="w-full min-w-[620px] h-auto font-mono text-[11px]"
          aria-label="Production RAG Observability Diagram"
        >
          {/* Docs -> Chunking */}
          <line x1="100" y1="60" x2="140" y2="60" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
          {/* Chunking -> ChromaDB */}
          <line x1="240" y1="60" x2="280" y2="60" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
          {/* ChromaDB -> Model */}
          <line x1="380" y1="60" x2="420" y2="60" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
          {/* Model -> RAGAS */}
          <line x1="520" y1="60" x2="560" y2="60" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />

          {/* Nodes */}
          <rect x="10" y="38" width="90" height="44" rx="4" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.4" />
          <text x="55" y="58" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">Documents</text>
          <text x="55" y="72" textAnchor="middle" fill="var(--ink-soft)" className="text-[9px]">Ingestion</text>

          <rect x="140" y="38" width="100" height="44" rx="4" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.4" />
          <text x="190" y="58" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">Semantic Chunk</text>
          <text x="190" y="72" textAnchor="middle" fill="var(--accent)" className="font-semibold text-[9px]">-40% Token Cost</text>

          <rect x="280" y="38" width="100" height="44" rx="4" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.4" />
          <text x="330" y="58" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">ChromaDB</text>
          <text x="330" y="72" textAnchor="middle" fill="var(--ink-soft)" className="text-[9px]">Dense Vectors</text>

          <rect x="420" y="38" width="100" height="44" rx="4" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.4" />
          <text x="470" y="58" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">LLM Synthesis</text>
          <text x="470" y="72" textAnchor="middle" fill="var(--ink-soft)" className="text-[9px]">Gemma 4 / Flash</text>

          <rect x="560" y="38" width="130" height="44" rx="4" fill="var(--paper)" stroke="var(--accent)" strokeWidth="1.8" />
          <text x="625" y="58" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">RAGAS Evaluation</text>
          <text x="625" y="72" textAnchor="middle" fill="var(--accent)" className="font-semibold text-[9px]">Faithfulness &gt; 0.85</text>
        </svg>
      </div>
    </div>
  );
}
