"use client";

import React, { useState } from "react";
import { sound } from "@/lib/sound";
import { Sparkles, Terminal, Activity } from "lucide-react";

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

  const handleNodeClick = (node: NodeInfo) => {
    sound.playClick(850);
    setSelectedNode(node);
  };

  // 1. Healthcare Claims Audit Multi-Agent System (healthcare_auditor.md compliant)
  if (slug === "healthcare-claims-audit") {
    const nodes: NodeInfo[] = [
      {
        id: "contract-reader",
        title: "Contract Reader (Per Upload)",
        type: "input",
        modelOrTool: "pdfplumber + ChromaDB (batched LLM structuring)",
        input: "DOFR / EOC / benefit grid PDF contract documents",
        output: "Typed ContractRule objects indexed with load-bearing payer filter",
        latencyOrMetric: "Ingestion time only (0 per-claim latency)",
      },
      {
        id: "claim-extractor",
        title: "Claim Extractor Node",
        type: "tool",
        modelOrTool: "Native Python Parser (0 LLM Calls)",
        input: "Raw CMS Medicare claim (CSV / JSON format)",
        output: "Pydantic Claim schema: CPT codes, ICD-10 Dx, billed amount",
        latencyOrMetric: "12ms native parse · 0 LLM calls",
      },
      {
        id: "deterministic-match",
        title: "Deterministic Rule Match",
        type: "decision",
        modelOrTool: "Exact Code Overlap Filter (0 LLM Calls)",
        input: "Claim CPT/ICD codes & ChromaDB candidate rules",
        output: "Narrowed candidate rule set (auto-approves & skips LLM if empty)",
        latencyOrMetric: "Exact code match · 0ms deterministic gate",
      },
      {
        id: "auditor-agent",
        title: "Auditor Agent Node",
        type: "agent",
        modelOrTool: "Gemini 3.8 Flash (google-genai)",
        input: "Claim + Narrowed candidate rules only",
        output: "Discrepancy explanation & composite confidence score",
        latencyOrMetric: "290ms inference · 0.6 LLM + 0.4 Match Weight",
      },
      {
        id: "routing-gate",
        title: "Deterministic Routing Node",
        type: "decision",
        modelOrTool: "Composite Threshold (>= 0.72)",
        input: "Composite confidence score (0.6 LLM + 0.4 Match)",
        output: "Branch: FLAGGED -> Appeal Drafter, else -> END or routed_to_human",
        latencyOrMetric: "Threshold = 0.72 · routed_to_human flag",
      },
      {
        id: "appeal-drafter",
        title: "Appeal Drafter (Draft-Only)",
        type: "output",
        modelOrTool: "Gemini 3.8 Flash (Verbatim Citing)",
        input: "Flagged claim discrepancy & verbatim rule source excerpt",
        output: "Formal appeal letter ending with mandatory [DRAFT] marker",
        latencyOrMetric: "185ms · Hard boundary: outbound send blocked",
      },
      {
        id: "human-review",
        title: "Human Examiner Fallback",
        type: "output",
        modelOrTool: "routed_to_human=True State Flag",
        input: "Low composite confidence (<0.72) claim",
        output: "Preserved original verdict + routed to examiner log",
        latencyOrMetric: "Alpha: print to stdout / Deferred to v1.0 DB queue",
      },
    ];

    return (
      <div className="p-4 bg-paper-2/70 border border-line rounded-token">
        <div className="flex items-center justify-between pb-3 text-xs font-mono text-ink-soft">
          <span className="font-semibold text-ink uppercase tracking-wider">
            LangGraph StateGraph · Claims Audit Architecture (healthcare_auditor.md)
          </span>
          <span className="flex items-center gap-1 text-accent text-[11px]">
            <Sparkles className="w-3 h-3" /> Click any node to inspect telemetry
          </span>
        </div>

        {/* SVG Flowchart */}
        <div className="w-full overflow-x-auto py-2">
          <svg
            viewBox="0 0 760 170"
            className="w-full min-w-[700px] h-auto font-mono text-[11px]"
            aria-label="Healthcare Claims Multi-Agent Architecture Diagram"
          >
            <defs>
              <marker
                id="arrowhead-claims"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 6 3, 0 6" fill="var(--ink-soft)" />
              </marker>
            </defs>

            {/* Connecting lines */}
            <line x1="105" y1="85" x2="135" y2="85" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead-claims)" />
            <line x1="240" y1="85" x2="270" y2="85" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead-claims)" />
            <line x1="380" y1="85" x2="410" y2="85" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead-claims)" />
            <line x1="520" y1="85" x2="550" y2="85" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead-claims)" />
            <line x1="645" y1="70" x2="665" y2="50" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead-claims)" />
            <line x1="645" y1="100" x2="665" y2="120" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead-claims)" />

            {/* Node 1: Contract Reader */}
            <g onClick={() => handleNodeClick(nodes[0])} className="cursor-pointer group">
              <rect x="5" y="60" width="100" height="50" rx="4" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.4" className="group-hover:stroke-accent transition-colors" />
              <text x="55" y="82" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">Contract Reader</text>
              <text x="55" y="96" textAnchor="middle" fill="var(--ink-soft)" className="text-[9px]">ChromaDB Index</text>
            </g>

            {/* Node 2: Claim Extractor */}
            <g onClick={() => handleNodeClick(nodes[1])} className="cursor-pointer group">
              <rect x="135" y="60" width="105" height="50" rx="4" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.4" className="group-hover:stroke-accent transition-colors" />
              <text x="187" y="82" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">Claim Extractor</text>
              <text x="187" y="96" textAnchor="middle" fill="var(--accent)" className="text-[9px] font-semibold">0 LLM · Native</text>
            </g>

            {/* Node 3: Deterministic Rule Match */}
            <g onClick={() => handleNodeClick(nodes[2])} className="cursor-pointer group">
              <rect x="270" y="60" width="110" height="50" rx="4" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.4" className="group-hover:stroke-accent transition-colors" />
              <text x="325" y="82" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">Code Overlap</text>
              <text x="325" y="96" textAnchor="middle" fill="var(--ink-soft)" className="text-[9px]">Exact CPT/ICD Match</text>
            </g>

            {/* Node 4: Auditor Agent */}
            <g onClick={() => handleNodeClick(nodes[3])} className="cursor-pointer group">
              <rect x="410" y="60" width="110" height="50" rx="4" fill="var(--paper)" stroke="var(--accent)" strokeWidth="1.8" className="group-hover:stroke-accent transition-colors" />
              <text x="465" y="82" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">Auditor Agent</text>
              <text x="465" y="96" textAnchor="middle" fill="var(--accent)" className="font-semibold text-[9px]">Gemini 3.8 Flash</text>
            </g>

            {/* Node 5: Routing Gate */}
            <g onClick={() => handleNodeClick(nodes[4])} className="cursor-pointer group">
              <rect x="550" y="60" width="95" height="50" rx="4" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.4" className="group-hover:stroke-accent transition-colors" />
              <text x="597" y="82" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">Routing Gate</text>
              <text x="597" y="96" textAnchor="middle" fill="var(--ink-soft)" className="text-[9px]">Score &gt;= 0.72</text>
            </g>

            {/* Node 6A: Appeal Drafter */}
            <g onClick={() => handleNodeClick(nodes[5])} className="cursor-pointer group">
              <rect x="665" y="25" width="90" height="45" rx="4" fill="var(--paper)" stroke="var(--accent)" strokeWidth="1.4" className="group-hover:stroke-accent transition-colors" />
              <text x="710" y="47" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">Appeal Drafter</text>
              <text x="710" y="59" textAnchor="middle" fill="var(--accent)" className="font-semibold text-[9px]">[DRAFT Only]</text>
            </g>

            {/* Node 6B: Human Review */}
            <g onClick={() => handleNodeClick(nodes[6])} className="cursor-pointer group">
              <rect x="665" y="100" width="90" height="45" rx="4" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.4" className="group-hover:stroke-accent transition-colors" />
              <text x="710" y="122" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">Human Review</text>
              <text x="710" y="134" textAnchor="middle" fill="var(--ink-soft)" className="text-[9px]">routed_to_human</text>
            </g>
          </svg>
        </div>

        {/* Node Inspector Drawer */}
        {renderInspector(selectedNode)}
      </div>
    );
  }

  // 2. Clinical Documentation & SOAP Notes Automation (Dedicated Workbench)
  if (slug === "clinical-documentation-soap") {
    const nodes: NodeInfo[] = [
      {
        id: "audio-stream",
        title: "Audio Ingestion (demo.mp3)",
        type: "input",
        modelOrTool: "16kHz Consultation Audio (demo.mp3)",
        input: "Raw clinical conversation between physician & patient (demo.mp3)",
        output: "Buffered 16kHz PCM audio frames with ambient noise profile",
        latencyOrMetric: "3m 42s consultation stream",
      },
      {
        id: "acoustic-gate",
        title: "Acoustic Preprocessor",
        type: "tool",
        modelOrTool: "Librosa + FFmpeg Denoising Gate",
        input: "Raw audio with clinic ambient noise & speech reflections",
        output: "Normalized 16kHz mono audio (-14dB ambient suppression, +18dB SNR)",
        latencyOrMetric: "110ms processing latency",
      },
      {
        id: "whisperx",
        title: "WhisperX Diarization & ASR",
        type: "agent",
        modelOrTool: "WhisperX (Phoneme Forced Alignment)",
        input: "Denoised 16kHz audio stream",
        output: "Timestamped speaker-segmented transcript: Doctor (62%) vs Patient (38%)",
        latencyOrMetric: "4.1% WER · sub-second chunk alignment",
      },
      {
        id: "gemma-soap",
        title: "Gemma 4 SOAP Synthesizer",
        type: "agent",
        modelOrTool: "Gemma 4 (Clinical Prompt Hierarchy)",
        input: "Diarized doctor-patient dialogue transcript",
        output: "Notes made by Gemma 4: Structured S-O-A-P clinical documentation",
        latencyOrMetric: "340ms generation · Notes made by Gemma 4",
      },
      {
        id: "qwen-validator",
        title: "Qwen 3.5 Clinical Validator",
        type: "decision",
        modelOrTool: "Qwen 3.5 (Medical Ontology & Pharmacopeia)",
        input: "Synthesized SOAP note + clinical guidelines & formulary",
        output: "Validated by Qwen 3.5: Dosage verification, contraindication check & ICD-10 (E11.9, R06.02)",
        latencyOrMetric: "260ms · Validated by Qwen 3.5 · 95.2% SNOMED-CT",
      },
      {
        id: "ehr-export",
        title: "Clinical EHR Export & HIPAA Guard",
        type: "output",
        modelOrTool: "FHIR / HL7 JSON + Clinical MD Document",
        input: "Validated SOAP documentation & ICD-10 / CPT billing codes",
        output: "De-identified, signed clinical documentation ready for EHR persistence",
        latencyOrMetric: "0.0% PHI leakage · HIPAA Compliant",
      },
    ];

    return (
      <div className="p-4 bg-paper-2/70 border border-line rounded-token">
        <div className="flex items-center justify-between pb-3 text-xs font-mono text-ink-soft">
          <span className="font-semibold text-ink uppercase tracking-wider">
            Clinical Documentation &amp; SOAP Notes Pipeline · WhisperX + Gemma 4 + Qwen 3.5
          </span>
          <span className="flex items-center gap-1 text-accent text-[11px]">
            <Sparkles className="w-3 h-3" /> Click any node to inspect telemetry
          </span>
        </div>

        {/* SVG Flowchart */}
        <div className="w-full overflow-x-auto py-2">
          <svg
            viewBox="0 0 760 150"
            className="w-full min-w-[700px] h-auto font-mono text-[11px]"
            aria-label="Clinical Documentation SOAP Notes Architecture Diagram"
          >
            <defs>
              <marker
                id="arrowhead-soap"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 6 3, 0 6" fill="var(--ink-soft)" />
              </marker>
            </defs>

            {/* Connection lines */}
            <line x1="110" y1="75" x2="135" y2="75" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead-soap)" />
            <line x1="240" y1="75" x2="265" y2="75" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead-soap)" />
            <line x1="375" y1="75" x2="400" y2="75" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead-soap)" />
            <line x1="515" y1="75" x2="540" y2="75" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead-soap)" />
            <line x1="650" y1="75" x2="675" y2="75" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead-soap)" />

            {/* Node 1: Audio Input */}
            <g onClick={() => handleNodeClick(nodes[0])} className="cursor-pointer group">
              <rect x="5" y="50" width="105" height="50" rx="4" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.4" className="group-hover:stroke-accent transition-colors" />
              <text x="57" y="72" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">Audio Ingest</text>
              <text x="57" y="86" textAnchor="middle" fill="var(--accent)" className="font-semibold text-[9px]">demo.mp3</text>
            </g>

            {/* Node 2: Acoustic Preprocessing */}
            <g onClick={() => handleNodeClick(nodes[1])} className="cursor-pointer group">
              <rect x="135" y="50" width="105" height="50" rx="4" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.4" className="group-hover:stroke-accent transition-colors" />
              <text x="187" y="72" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">Acoustic Filter</text>
              <text x="187" y="86" textAnchor="middle" fill="var(--ink-soft)" className="text-[9px]">Librosa -14dB</text>
            </g>

            {/* Node 3: WhisperX Diarization */}
            <g onClick={() => handleNodeClick(nodes[2])} className="cursor-pointer group">
              <rect x="265" y="50" width="110" height="50" rx="4" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.4" className="group-hover:stroke-accent transition-colors" />
              <text x="320" y="72" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">WhisperX</text>
              <text x="320" y="86" textAnchor="middle" fill="var(--ink-soft)" className="text-[9px]">Diarize &amp; Align</text>
            </g>

            {/* Node 4: Gemma 4 SOAP Synthesizer */}
            <g onClick={() => handleNodeClick(nodes[3])} className="cursor-pointer group">
              <rect x="400" y="50" width="115" height="50" rx="4" fill="var(--paper)" stroke="var(--accent)" strokeWidth="1.8" className="group-hover:stroke-accent transition-colors" />
              <text x="457" y="72" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">SOAP Synthesis</text>
              <text x="457" y="86" textAnchor="middle" fill="var(--accent)" className="font-semibold text-[9px]">Notes by Gemma 4</text>
            </g>

            {/* Node 5: Qwen 3.5 Clinical Validator */}
            <g onClick={() => handleNodeClick(nodes[4])} className="cursor-pointer group">
              <rect x="540" y="50" width="110" height="50" rx="4" fill="var(--paper)" stroke="var(--accent)" strokeWidth="1.8" className="group-hover:stroke-accent transition-colors" />
              <text x="595" y="72" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">Clinical Validator</text>
              <text x="595" y="86" textAnchor="middle" fill="var(--accent)" className="font-semibold text-[9px]">Qwen 3.5 Check</text>
            </g>

            {/* Node 6: EHR Output */}
            <g onClick={() => handleNodeClick(nodes[5])} className="cursor-pointer group">
              <rect x="675" y="50" width="80" height="50" rx="4" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.4" className="group-hover:stroke-accent transition-colors" />
              <text x="715" y="72" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">EHR Export</text>
              <text x="715" y="86" textAnchor="middle" fill="var(--ink-soft)" className="text-[9px]">FHIR / HIPAA</text>
            </g>
          </svg>
        </div>

        {/* Node Inspector Drawer */}
        {renderInspector(selectedNode)}
      </div>
    );
  }

  // 3. Multi-Agent Research Assistant with MCP
  if (slug === "multi-agent-research-mcp") {
    const nodes: NodeInfo[] = [
      {
        id: "user-query",
        title: "User Research Query",
        type: "input",
        modelOrTool: "Query Parser & Tokenizer",
        input: "Complex technical or clinical research hypothesis",
        output: "Structured goal prompt for multi-agent execution",
        latencyOrMetric: "10ms parse",
      },
      {
        id: "planner",
        title: "Planner Node",
        type: "agent",
        modelOrTool: "LangGraph StateGraph Planner",
        input: "Decomposed research goal",
        output: "Ordered multi-hop tool execution plan with sub-queries",
        latencyOrMetric: "140ms plan formulation",
      },
      {
        id: "retriever-mcp",
        title: "Retriever Node (MCP)",
        type: "tool",
        modelOrTool: "Model Context Protocol (MCP) Tools",
        input: "Sub-query tool requests (arXiv, PubMed, Tavily)",
        output: "Retrieved empirical evidence & primary literature chunks",
        latencyOrMetric: "Standardized MCP JSON-RPC protocol",
      },
      {
        id: "critic",
        title: "Critic Node (Reflection)",
        type: "decision",
        modelOrTool: "Citation Grounding & Self-Correction",
        input: "Synthesized draft response + retrieved evidence sources",
        output: "Verification score: Grounded -> Output, else -> Cyclic Re-Plan",
        latencyOrMetric: "Zero hallucination gating",
      },
      {
        id: "output",
        title: "Attributed Grounded Output",
        type: "output",
        modelOrTool: "Final Synthesis Layer",
        input: "Critic-verified multi-hop reasoning trace",
        output: "Grounded technical report with immutable citation links",
        latencyOrMetric: "100% citation ground truth",
      },
    ];

    return (
      <div className="p-4 bg-paper-2/70 border border-line rounded-token">
        <div className="flex items-center justify-between pb-2 text-xs font-mono text-ink-soft">
          <span className="font-semibold text-ink uppercase tracking-wider">
            LangGraph State Architecture + MCP Tool Protocol
          </span>
          <span className="flex items-center gap-1 text-accent text-[11px]">
            <Sparkles className="w-3 h-3" /> Click any node to inspect telemetry
          </span>
        </div>

        <div className="w-full overflow-x-auto py-2">
          <svg
            viewBox="0 0 720 140"
            className="w-full min-w-[620px] h-auto font-mono text-[11px]"
            aria-label="Multi-Agent LangGraph MCP Diagram"
          >
            <defs>
              <marker
                id="arrowhead-mcp"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 6 3, 0 6" fill="var(--ink-soft)" />
              </marker>
            </defs>

            {/* User Query -> Planner */}
            <line x1="90" y1="70" x2="130" y2="70" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead-mcp)" />
            {/* Planner -> Retriever */}
            <line x1="230" y1="70" x2="270" y2="70" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead-mcp)" />
            {/* Retriever -> Critic */}
            <line x1="370" y1="70" x2="410" y2="70" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead-mcp)" />
            {/* Critic -> Answer */}
            <line x1="510" y1="55" x2="550" y2="40" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead-mcp)" />
            {/* Critic -> Re-Plan (Loop) */}
            <path d="M 460 95 L 460 120 L 180 120 L 180 95" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4" markerEnd="url(#arrowhead-mcp)" />

            {/* Nodes */}
            <g onClick={() => handleNodeClick(nodes[0])} className="cursor-pointer group">
              <rect x="10" y="48" width="80" height="44" rx="4" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.4" className="group-hover:stroke-accent transition-colors" />
              <text x="50" y="74" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">User Query</text>
            </g>

            <g onClick={() => handleNodeClick(nodes[1])} className="cursor-pointer group">
              <rect x="130" y="48" width="100" height="44" rx="4" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.4" className="group-hover:stroke-accent transition-colors" />
              <text x="180" y="68" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">Planner Node</text>
              <text x="180" y="82" textAnchor="middle" fill="var(--ink-soft)" className="text-[9px]">Goal Decompose</text>
            </g>

            <g onClick={() => handleNodeClick(nodes[2])} className="cursor-pointer group">
              <rect x="270" y="48" width="100" height="44" rx="4" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.4" className="group-hover:stroke-accent transition-colors" />
              <text x="320" y="68" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">Retriever Node</text>
              <text x="320" y="82" textAnchor="middle" fill="var(--accent)" className="font-semibold text-[9px]">MCP Servers</text>
            </g>

            <g onClick={() => handleNodeClick(nodes[3])} className="cursor-pointer group">
              <rect x="410" y="48" width="100" height="44" rx="4" fill="var(--paper)" stroke="var(--accent)" strokeWidth="1.8" className="group-hover:stroke-accent transition-colors" />
              <text x="460" y="68" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">Critic Node</text>
              <text x="460" y="82" textAnchor="middle" fill="var(--ink-soft)" className="text-[9px]">Citation Check</text>
            </g>

            <g onClick={() => handleNodeClick(nodes[4])} className="cursor-pointer group">
              <rect x="550" y="20" width="120" height="40" rx="4" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.4" className="group-hover:stroke-accent transition-colors" />
              <text x="610" y="44" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">Grounded Output</text>
            </g>

            {/* Feedback Loop Label */}
            <text x="320" y="132" textAnchor="middle" fill="var(--accent)" className="text-[9px] font-semibold">
              Cyclic Re-Plan Loop (Triggered upon citation gap or ambiguity)
            </text>
          </svg>
        </div>

        {renderInspector(selectedNode)}
      </div>
    );
  }

  // 4. Production RAG & Observability Pipeline
  const ragNodes: NodeInfo[] = [
    {
      id: "doc-ingest",
      title: "Document Ingestion",
      type: "input",
      modelOrTool: "PDF / Markdown Enterprise Corpus",
      input: "Raw technical documentation and manuals",
      output: "Standardized text payloads with document metadata",
      latencyOrMetric: "Multi-format parsing",
    },
    {
      id: "semantic-chunk",
      title: "Semantic Boundary Chunking",
      type: "tool",
      modelOrTool: "RecursiveCharacterTextSplitter",
      input: "Document streams",
      output: "Semantically coherent chunks (512 tokens with 64 overlap)",
      latencyOrMetric: "-40% token cost reduction",
    },
    {
      id: "chroma-store",
      title: "ChromaDB Dense Vectors",
      type: "tool",
      modelOrTool: "ChromaDB Vector Store",
      input: "Vector embeddings from BGE-M3 / OpenAI",
      output: "Indexed HNSW vector graph with metadata filtering",
      latencyOrMetric: "145ms cosine similarity search",
    },
    {
      id: "llm-synthesis",
      title: "LLM Synthesis Layer",
      type: "agent",
      modelOrTool: "Gemini 3.8 Flash / Gemma 4",
      input: "Top-k retrieved context chunks + user query",
      output: "Context-grounded natural language answer",
      latencyOrMetric: "Low-latency generation",
    },
    {
      id: "ragas-gate",
      title: "RAGAS Evaluation Gate",
      type: "decision",
      modelOrTool: "RAGAS Automated CI/CD Harness",
      input: "Answer, context chunks, and ground truth evaluation sets",
      output: "Faithfulness (0.96), Answer Relevance (0.91) · PR Gate Passed",
      latencyOrMetric: "Gated CI: Blocks deployment if Faithfulness < 0.85",
    },
  ];

  return (
    <div className="p-4 bg-paper-2/70 border border-line rounded-token">
      <div className="flex items-center justify-between pb-2 text-xs font-mono text-ink-soft">
        <span className="font-semibold text-ink uppercase tracking-wider">
          Production RAG + RAGAS Observability Pipeline
        </span>
        <span className="flex items-center gap-1 text-accent text-[11px]">
          <Sparkles className="w-3 h-3" /> Click any node to inspect telemetry
        </span>
      </div>

      <div className="w-full overflow-x-auto py-2">
        <svg
          viewBox="0 0 720 120"
          className="w-full min-w-[620px] h-auto font-mono text-[11px]"
          aria-label="Production RAG Observability Diagram"
        >
          <defs>
            <marker
              id="arrowhead-rag"
              markerWidth="6"
              markerHeight="6"
              refX="5"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 6 3, 0 6" fill="var(--ink-soft)" />
            </marker>
          </defs>

          {/* Docs -> Chunking */}
          <line x1="100" y1="60" x2="140" y2="60" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead-rag)" />
          {/* Chunking -> ChromaDB */}
          <line x1="240" y1="60" x2="280" y2="60" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead-rag)" />
          {/* ChromaDB -> Model */}
          <line x1="380" y1="60" x2="420" y2="60" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead-rag)" />
          {/* Model -> RAGAS */}
          <line x1="520" y1="60" x2="560" y2="60" stroke="var(--line)" strokeWidth="1.5" markerEnd="url(#arrowhead-rag)" />

          {/* Nodes */}
          <g onClick={() => handleNodeClick(ragNodes[0])} className="cursor-pointer group">
            <rect x="10" y="38" width="90" height="44" rx="4" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.4" className="group-hover:stroke-accent transition-colors" />
            <text x="55" y="58" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">Documents</text>
            <text x="55" y="72" textAnchor="middle" fill="var(--ink-soft)" className="text-[9px]">Ingestion</text>
          </g>

          <g onClick={() => handleNodeClick(ragNodes[1])} className="cursor-pointer group">
            <rect x="140" y="38" width="100" height="44" rx="4" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.4" className="group-hover:stroke-accent transition-colors" />
            <text x="190" y="58" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">Semantic Chunk</text>
            <text x="190" y="72" textAnchor="middle" fill="var(--accent)" className="font-semibold text-[9px]">-40% Token Cost</text>
          </g>

          <g onClick={() => handleNodeClick(ragNodes[2])} className="cursor-pointer group">
            <rect x="280" y="38" width="100" height="44" rx="4" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.4" className="group-hover:stroke-accent transition-colors" />
            <text x="330" y="58" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">ChromaDB</text>
            <text x="330" y="72" textAnchor="middle" fill="var(--ink-soft)" className="text-[9px]">Dense Vectors</text>
          </g>

          <g onClick={() => handleNodeClick(ragNodes[3])} className="cursor-pointer group">
            <rect x="420" y="38" width="100" height="44" rx="4" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.4" className="group-hover:stroke-accent transition-colors" />
            <text x="470" y="58" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">LLM Synthesis</text>
            <text x="470" y="72" textAnchor="middle" fill="var(--ink-soft)" className="text-[9px]">Gemini 3.8 Flash</text>
          </g>

          <g onClick={() => handleNodeClick(ragNodes[4])} className="cursor-pointer group">
            <rect x="560" y="38" width="130" height="44" rx="4" fill="var(--paper)" stroke="var(--accent)" strokeWidth="1.8" className="group-hover:stroke-accent transition-colors" />
            <text x="625" y="58" textAnchor="middle" fill="var(--ink)" className="font-semibold text-[10px]">RAGAS Evaluation</text>
            <text x="625" y="72" textAnchor="middle" fill="var(--accent)" className="font-semibold text-[9px]">Faithfulness &gt; 0.85</text>
          </g>
        </svg>
      </div>

      {renderInspector(selectedNode)}
    </div>
  );
}

function renderInspector(selectedNode: NodeInfo | null) {
  if (!selectedNode) {
    return (
      <div className="mt-2 text-center text-[11px] font-mono text-ink-soft py-1">
        Click any node above to inspect input/output schemas &amp; telemetry
      </div>
    );
  }

  return (
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
  );
}
