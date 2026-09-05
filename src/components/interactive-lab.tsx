"use client";

import React, { useState } from "react";
import { sound } from "@/lib/sound";
import {
  Sliders,
  Play,
  RotateCcw,
  Activity,
  CheckCircle2,
  Zap,
  Sparkles,
  Volume2,
} from "lucide-react";

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

// Scenarios for Clinical SOAP Notes Sandbox
interface SoapScenario {
  id: string;
  filename: string;
  patientName: string;
  patientId: string;
  chiefComplaint: string;
  transcript: { speaker: "Doctor" | "Patient"; time: string; text: string }[];
  soap: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  validation: {
    icd10: { code: string; label: string }[];
    dosageCheck: string;
    contraindicationCheck: string;
    precisionScore: string;
  };
}

const soapScenarios: Record<string, SoapScenario> = {
  cardio: {
    id: "cardio",
    filename: "demo.mp3",
    patientName: "Robert Davis",
    patientId: "PT-4892",
    chiefComplaint: "Cardiology Consultation: Exertional Dyspnea & Morning Chest Tightness",
    transcript: [
      {
        speaker: "Doctor",
        time: "00:04",
        text: "Good morning, Mr. Davis. How has your breathing been when walking up stairs or doing yard work?",
      },
      {
        speaker: "Patient",
        time: "00:15",
        text: "Still experiencing noticeable shortness of breath and chest tightness in the mornings. I take my Metformin 500mg twice daily as prescribed.",
      },
      {
        speaker: "Doctor",
        time: "00:27",
        text: "Your blood pressure is elevated today at 138/88 mmHg. Pulse is 74 bpm. Let's order a 12-lead ECG and schedule a stress echocardiogram.",
      },
    ],
    soap: {
      subjective:
        "58-year-old male presents for cardiology follow-up reporting persistent exertional dyspnea and morning retrosternal tightness. Compliant with Metformin 500mg BID. Denies syncope or lower extremity edema.",
      objective:
        "BP: 138/88 mmHg | HR: 74 bpm regular | SpO2: 97% on room air | BMI: 28.4. Lungs: Clear to auscultation bilaterally. Heart: Regular rate and rhythm, normal S1/S2, no murmurs, rubs, or gallops.",
      assessment:
        "1. Essential hypertension (uncontrolled, Stage 1).\n2. Dyspnea on exertion (R/O stable coronary artery disease).\n3. Type 2 diabetes mellitus without acute complications.",
      plan:
        "1. 12-lead resting electrocardiogram (CPT-93000) today.\n2. Schedule outpatient exercise stress echocardiogram.\n3. Continue Metformin 500mg BID with meals.\n4. Clinical review in 4 weeks with home blood pressure logs.",
    },
    validation: {
      icd10: [
        { code: "I10", label: "Essential (primary) hypertension" },
        { code: "R06.02", label: "Shortness of breath (Dyspnea on exertion)" },
        { code: "E11.9", label: "Type 2 diabetes mellitus without complications" },
      ],
      dosageCheck: "Metformin 500mg BID verified safe (eGFR > 60 mL/min)",
      contraindicationCheck: "Zero drug-drug contraindications detected",
      precisionScore: "95.2% SNOMED-CT ontology match",
    },
  },
  endocrine: {
    id: "endocrine",
    filename: "demo_endocrine.mp3",
    patientName: "Elena Rostova",
    patientId: "PT-3129",
    chiefComplaint: "Endocrine Review: Type 2 Diabetes & Glycemic Control Check",
    transcript: [
      {
        speaker: "Doctor",
        time: "00:03",
        text: "Hello Elena. Looking over your lab results: HbA1c is at 7.8%, slightly above our target of 7.0%.",
      },
      {
        speaker: "Patient",
        time: "00:14",
        text: "I have had trouble with fasting sugars over 140 mg/dL. I walk 30 minutes a day but sometimes miss lunch.",
      },
      {
        speaker: "Doctor",
        time: "00:25",
        text: "Let's optimize your medication. We will increase your Metformin to 850mg BID and introduce continuous glucose monitoring.",
      },
    ],
    soap: {
      subjective:
        "62-year-old female presents for quarterly diabetic evaluation. Reports morning fasting hyperglycemia (140-155 mg/dL). No polyuria, polydipsia, or peripheral numbness.",
      objective:
        "HbA1c: 7.8% | Fasting plasma glucose: 144 mg/dL | BP: 124/78 mmHg | BMI: 26.8. Visual inspection of lower extremities reveals intact sensation and normal pedal pulses.",
      assessment:
        "1. Type 2 diabetes mellitus with suboptimal glycemic control (HbA1c 7.8%).\n2. Mild dyslipidemia, stable on current statin therapy.",
      plan:
        "1. Titrate Metformin from 500mg BID to 850mg BID with breakfast and dinner.\n2. Prescribe 14-day continuous glucose monitoring (CGM) sensor.\n3. Nutrition consult for carbohydrate distribution.\n4. Repeat HbA1c in 90 days.",
    },
    validation: {
      icd10: [
        { code: "E11.65", label: "Type 2 diabetes with hyperglycemia" },
        { code: "Z79.84", label: "Long-term (current) use of oral hypoglycemic drugs" },
      ],
      dosageCheck: "Metformin 850mg BID verified within therapeutic ceiling",
      contraindicationCheck: "Hepatic and renal panels within normal limits",
      precisionScore: "96.4% SNOMED-CT ontology match",
    },
  },
};

export function InteractiveLab() {
  // Module 1: RAG Parameter Simulator State (2025/2026 Research Grounded)
  const [chunkSize, setChunkSize] = useState(512);
  const [chunkOverlap, setChunkOverlap] = useState(64);
  const [topK, setTopK] = useState(4);
  const [temperature, setTemperature] = useState(0.1);
  const [rerankEnabled, setRerankEnabled] = useState(true);

  // Module 2: Clinical SOAP Sandbox State (demo.mp3 Flow)
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("cardio");
  const [agentStep, setAgentStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState<"pipeline" | "doc" | "audio">("pipeline");

  const scenario = soapScenarios[selectedScenarioId] || soapScenarios.cardio;

  // Empirical equations grounded in arXiv:2505.08445 & arXiv:2606.28337
  // Chunking sweet-spot: 256-512 tokens. Top-k noise penalty without reranker.
  const noisePenalty = !rerankEnabled && topK > 3 ? (topK - 3) * 3.5 : 0;
  const chunkPenalty = chunkSize > 768 ? Math.round((chunkSize - 768) / 120) : 0;
  const rerankBonus = rerankEnabled ? 6 : -4;

  const precision = Math.max(
    62,
    Math.min(
      98,
      Math.round(88 + rerankBonus - noisePenalty - chunkPenalty - temperature * 14)
    )
  );

  const recall = Math.max(
    55,
    Math.min(
      99,
      Math.round(72 + topK * 4.2 + (chunkOverlap >= 48 ? 5 : 0) - (chunkSize > 1200 ? 6 : 0))
    )
  );

  const faithfulness = Math.max(
    60,
    Math.min(
      99,
      Math.round(96 - temperature * 22 - (rerankEnabled ? 0 : topK * 2) - chunkPenalty)
    )
  );

  const latencyMs = Math.round(
    95 + topK * (rerankEnabled ? 38 : 22) + (chunkSize / 64) * 3.5
  );

  const costPer1k = ((topK * chunkSize * 0.00012) / 10).toFixed(4);

  // Dynamic SVG Pareto Frontier Curve based on current hyperparameter coordinates
  const curvePoints = Array.from({ length: 12 }, (_, i) => {
    const x = ((i / 11) * 280).toFixed(1);
    const factor = (precision / 100) * 0.75 + (recall / 100) * 0.25;
    const yVal = 68 - Math.sin((i / 11) * Math.PI) * 48 * factor - temperature * 8;
    const y = Math.max(10, Math.min(74, yVal)).toFixed(1);
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");

  const applyPreset = (preset: "sweetspot" | "lowlatency" | "deepcontext") => {
    sound.playClick(900);
    if (preset === "sweetspot") {
      setChunkSize(512);
      setChunkOverlap(64);
      setTopK(4);
      setTemperature(0.1);
      setRerankEnabled(true);
    } else if (preset === "lowlatency") {
      setChunkSize(256);
      setChunkOverlap(32);
      setTopK(2);
      setTemperature(0.0);
      setRerankEnabled(false);
    } else {
      setChunkSize(768);
      setChunkOverlap(128);
      setTopK(6);
      setTemperature(0.1);
      setRerankEnabled(true);
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
        sound.playClick(800 + st * 70);
        if (i === steps.length - 1) {
          setIsSimulating(false);
          sound.playSuccess();
        }
      }, (i + 1) * 750);
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
            <span className="text-xs font-mono text-ink-soft">/ Hands-On Systems Workbench</span>
          </div>
          <h2 className="font-serif italic text-3xl sm:text-4xl text-ink">
            The Systems Playground
          </h2>
          <p className="font-sans text-sm sm:text-base text-ink-soft max-w-3xl">
            Simulate RAG parameter trade-offs grounded in 2025/2026 empirical research, or trace the live WhisperX + Gemma 4 + Qwen 3.5 clinical SOAP pipeline from raw consultation audio (<code className="text-accent text-xs">demo.mp3</code>).
          </p>
        </div>

        {/* Two Interactive Modules Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Module 1: RAG Parameter & Curve Simulator */}
          <div
            data-cursor="tune"
            data-cursor-text="TUNE RAG"
            className="p-6 bg-paper border border-line rounded-token space-y-5 shadow-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-accent" />
                <div>
                  <h3 className="font-mono text-xs font-semibold uppercase text-ink tracking-wider">
                    RAG Parameter &amp; Curve Simulator
                  </h3>
                  <span className="text-[10px] font-mono text-ink-soft block">
                    Grounded in arXiv:2505.08445 &amp; arXiv:2606.28337
                  </span>
                </div>
              </div>
            </div>

            {/* Research Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-mono text-ink-soft mr-1">Research Presets:</span>
              <button
                onClick={() => applyPreset("sweetspot")}
                className="px-2 py-0.5 text-[10px] font-mono border border-accent/40 bg-accent-soft text-accent rounded-token hover:bg-accent hover:text-paper transition-colors cursor-pointer"
                title="Optimal 512 tokens with Cross-Encoder rerank"
              >
                arXiv:2505.08445 (Sweet Spot)
              </button>
              <button
                onClick={() => applyPreset("lowlatency")}
                className="px-2 py-0.5 text-[10px] font-mono border border-line rounded-token hover:bg-paper-2 text-ink cursor-pointer"
                title="Fast 256 tokens, 0ms rerank"
              >
                SciRet 2026 (Edge)
              </button>
              <button
                onClick={() => applyPreset("deepcontext")}
                className="px-2 py-0.5 text-[10px] font-mono border border-line rounded-token hover:bg-paper-2 text-ink cursor-pointer"
                title="768 tokens, top-k 6 with reranking"
              >
                arXiv:2606.28337 (Deep)
              </button>
            </div>

            {/* Real-time Dynamic Curve Visualizer */}
            <div className="p-3 bg-paper-2 border border-line rounded-token space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-ink-soft">
                <span>Empirical Precision-Recall Frontier</span>
                <span className="text-accent font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {precision}% Precision · {recall}% Recall
                </span>
              </div>
              <div className="h-16 w-full flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 280 80" className="w-full h-full">
                  <defs>
                    <linearGradient id="curveGradientLab" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  {/* Grid reference lines */}
                  <line x1="0" y1="20" x2="280" y2="20" stroke="var(--line)" strokeDasharray="3 3" opacity="0.6" />
                  <line x1="0" y1="50" x2="280" y2="50" stroke="var(--line)" strokeDasharray="3 3" opacity="0.6" />
                  {/* Dynamic waveform */}
                  <path
                    d={curvePoints}
                    fill="none"
                    stroke="url(#curveGradientLab)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                  {/* Active Operating Point marker */}
                  <circle
                    cx={140}
                    cy={Number(Math.max(12, Math.min(68, 68 - (precision / 100) * 45)).toFixed(1))}
                    r={4}
                    fill="var(--accent)"
                  />
                </svg>
              </div>
            </div>

            {/* Interactive Sliders */}
            <div className="space-y-3 font-mono">
              <SleekSlider
                label="Chunk Size (c)"
                value={chunkSize}
                min={128}
                max={1536}
                step={64}
                unit="tokens"
                contextNote={
                  chunkSize <= 384
                    ? "High Precision / Low Dilution"
                    : chunkSize <= 768
                    ? "arXiv:2505.08445 Sweet Spot"
                    : "Context Dilution (Lost in the Middle)"
                }
                onChange={(val) => {
                  setChunkSize(val);
                  sound.playClick(600 + val / 5);
                }}
              />

              <SleekSlider
                label="Chunk Overlap (δ)"
                value={chunkOverlap}
                min={0}
                max={128}
                step={16}
                unit="tokens"
                contextNote={
                  chunkOverlap === 0
                    ? "Zero Stitching"
                    : chunkOverlap <= 64
                    ? "Sentence Window OK"
                    : "Redundant Token Payload"
                }
                onChange={(val) => {
                  setChunkOverlap(val);
                  sound.playClick(700 + val * 2);
                }}
              />

              <SleekSlider
                label="Retrieval Depth (k)"
                value={topK}
                min={1}
                max={8}
                step={1}
                unit="chunks"
                contextNote={
                  topK <= 2
                    ? "Strict Recall"
                    : topK <= 5
                    ? "Optimal P@k"
                    : !rerankEnabled
                    ? "Noise Injected (Needs Rerank)"
                    : "Reranked Clean Context"
                }
                onChange={(val) => {
                  setTopK(val);
                  sound.playClick(800 + val * 30);
                }}
              />

              <SleekSlider
                label="LLM Temperature (T)"
                value={temperature}
                min={0}
                max={0.8}
                step={0.05}
                unit=""
                contextNote={
                  temperature === 0
                    ? "Deterministic / Zero Drift"
                    : temperature <= 0.2
                    ? "Clinical Gating (Optimal)"
                    : "Hallucination Risk > 0.3"
                }
                onChange={(val) => {
                  setTemperature(val);
                  sound.playClick(900 - val * 200);
                }}
              />

              {/* Cross-Encoder Reranking Toggle (Key finding from 2025/2026 research) */}
              <div className="p-3 bg-paper-2/60 border border-line rounded-token flex items-center justify-between text-xs">
                <div>
                  <span className="text-ink font-medium block">Cross-Encoder Re-ranking Stage:</span>
                  <span className="text-[10px] text-ink-soft">
                    {rerankEnabled
                      ? "Enabled: Filters irrelevant chunks at high top-k (arXiv:2505.08445)"
                      : "Dense-only: Context distraction penalty applies at k > 3"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    sound.playClick(rerankEnabled ? 650 : 850);
                    setRerankEnabled(!rerankEnabled);
                  }}
                  className={`px-3 py-1 rounded-token font-mono text-[11px] font-semibold border transition-colors cursor-pointer ${
                    rerankEnabled
                      ? "bg-accent text-paper border-accent"
                      : "bg-paper border-line text-ink-soft hover:text-ink"
                  }`}
                >
                  {rerankEnabled ? "Active (BGE-Rerank)" : "Disabled (Bi-Encoder)"}
                </button>
              </div>
            </div>

            {/* Simulated Live Output Meters */}
            <div className="p-4 bg-paper-2/60 border border-line rounded-token space-y-3 font-mono text-xs">
              <div className="text-[11px] text-ink-soft uppercase tracking-wider font-semibold">
                Simulated RAGAS &amp; Latency Telemetry:
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>Faithfulness (RAGAS Grounding):</span>
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
                    <span>Context Precision (P@k):</span>
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
                <span>Latency: <strong className="text-ink">{latencyMs}ms</strong></span>
                <span>Token Cost / 1k: <strong className="text-ink">${costPer1k}</strong></span>
              </div>
            </div>
          </div>

          {/* Module 2: Clinical SOAP Notes Automation Sandbox (Replacing Healthcare Audit) */}
          <div className="p-6 bg-paper border border-line rounded-token space-y-5 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-accent" />
                  <div>
                    <h3 className="font-mono text-xs font-semibold uppercase text-ink tracking-wider">
                      Agent Decision Flow Sandbox
                    </h3>
                    <span className="text-[10px] font-mono text-ink-soft block">
                      Theory SOAP Notes Pipeline · WhisperX + Gemma 4 + Qwen 3.5
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playClick(600);
                    setAgentStep(0);
                  }}
                  className="p-1 text-ink-soft hover:text-ink border border-line rounded-token cursor-pointer"
                  title="Reset pipeline simulation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Consultation Scenario Picker */}
              <div className="space-y-1">
                <span className="font-mono text-xs text-ink-soft">
                  Incoming Consultation Audio Stream:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "cardio", file: "demo.mp3", label: "Cardiology & Dyspnea" },
                    { id: "endocrine", file: "demo_endocrine.mp3", label: "Endocrine & HbA1c" },
                  ].map((sc) => (
                    <button
                      key={sc.id}
                      onClick={() => {
                        sound.playClick(750);
                        setSelectedScenarioId(sc.id);
                        setAgentStep(0);
                      }}
                      className={`p-2 font-mono text-[11px] text-left border rounded-token transition-colors cursor-pointer ${
                        selectedScenarioId === sc.id
                          ? "bg-paper-2 border-accent text-ink font-semibold shadow-xs"
                          : "border-line text-ink-soft hover:bg-paper-2"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-accent font-semibold">
                        <Volume2 className="w-3 h-3" />
                        <span>{sc.file}</span>
                      </div>
                      <div className="text-[10px] text-ink pt-0.5 truncate">{sc.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Navigation: Pipeline vs Clinical Document vs Audio Transcript */}
              <div className="flex border-b border-line font-mono text-[11px] pt-1">
                <button
                  onClick={() => {
                    sound.playClick(800);
                    setActiveTab("pipeline");
                  }}
                  className={`pb-1.5 px-2.5 border-b-2 font-medium cursor-pointer transition-colors ${
                    activeTab === "pipeline"
                      ? "border-accent text-accent"
                      : "border-transparent text-ink-soft hover:text-ink"
                  }`}
                >
                  Pipeline Flow
                </button>
                <button
                  onClick={() => {
                    sound.playClick(800);
                    setActiveTab("doc");
                  }}
                  className={`pb-1.5 px-2.5 border-b-2 font-medium cursor-pointer transition-colors ${
                    activeTab === "doc"
                      ? "border-accent text-accent"
                      : "border-transparent text-ink-soft hover:text-ink"
                  }`}
                >
                  Clinical Document View
                </button>
                <button
                  onClick={() => {
                    sound.playClick(800);
                    setActiveTab("audio");
                  }}
                  className={`pb-1.5 px-2.5 border-b-2 font-medium cursor-pointer transition-colors ${
                    activeTab === "audio"
                      ? "border-accent text-accent"
                      : "border-transparent text-ink-soft hover:text-ink"
                  }`}
                >
                  Raw Dialogue ({scenario.filename})
                </button>
              </div>

              {/* TAB 1: PIPELINE STEPS */}
              {activeTab === "pipeline" && (
                <div className="space-y-2 pt-1">
                  {[
                    {
                      step: 1,
                      label: `Audio Ingestion & WhisperX (${scenario.filename})`,
                      desc: "Denoised 16kHz audio (-14dB). WhisperX diarization distinguishing Doctor (62%) and Patient (38%) with phoneme alignment.",
                    },
                    {
                      step: 2,
                      label: "Gemma 4 SOAP Note Synthesis",
                      desc: "Notes made by Gemma 4: Extracted symptoms and formatted clinical Subjective, Objective, Assessment, Plan structure.",
                    },
                    {
                      step: 3,
                      label: "Qwen 3.5 Clinical & Safety Validation",
                      desc: `Validated by Qwen 3.5: ${scenario.validation.dosageCheck} · ${scenario.validation.precisionScore} · Contraindications: None.`,
                    },
                    {
                      step: 4,
                      label: "EHR Clinical Document Save",
                      desc: `Saved to ${scenario.patientName} (${scenario.patientId}) chart in standard clinical format. Mapped ICD-10 codes ready for billing.`,
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
              )}

              {/* TAB 2: LIVE CLINICAL DOCUMENT */}
              {activeTab === "doc" && (
                <div className="p-3 bg-paper-2 border border-line rounded-token space-y-2.5 text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-line pb-2">
                    <div>
                      <span className="font-bold text-ink block">{scenario.patientName}</span>
                      <span className="text-[10px] text-ink-soft">ID: {scenario.patientId} · Date: 2026-09-05</span>
                    </div>
                    <span className="px-2 py-0.5 bg-accent-soft text-accent border border-accent/30 rounded text-[10px]">
                      {agentStep >= 4 ? "Saved to EHR" : "Synthesizing Note..."}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div>
                      <strong className="text-accent">S (Subjective):</strong>
                      <p className="text-ink font-sans pt-0.5">{scenario.soap.subjective}</p>
                    </div>
                    <div>
                      <strong className="text-accent">O (Objective):</strong>
                      <p className="text-ink font-sans pt-0.5">{scenario.soap.objective}</p>
                    </div>
                    <div>
                      <strong className="text-accent">A (Assessment):</strong>
                      <p className="text-ink font-sans pt-0.5 whitespace-pre-line">{scenario.soap.assessment}</p>
                    </div>
                    <div>
                      <strong className="text-accent">P (Plan):</strong>
                      <p className="text-ink font-sans pt-0.5 whitespace-pre-line">{scenario.soap.plan}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-line flex flex-wrap items-center justify-between gap-1 text-[10px]">
                    <span className="text-ink-soft">Verified ICD-10:</span>
                    <div className="flex flex-wrap gap-1">
                      {scenario.validation.icd10.map((code) => (
                        <span key={code.code} className="px-1.5 py-0.5 bg-paper border border-line rounded text-ink">
                          {code.code}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: RAW AUDIO DIALOGUE (demo.mp3) */}
              {activeTab === "audio" && (
                <div className="p-3 bg-paper-2 border border-line rounded-token space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between pb-1 border-b border-line text-[11px] text-ink-soft">
                    <span className="flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-accent" />
                      {scenario.filename} · Acoustic Ingestion
                    </span>
                    <span className="text-accent">Diarized Transcripts</span>
                  </div>

                  <div className="space-y-2 pt-1 max-h-[175px] overflow-y-auto pr-1">
                    {scenario.transcript.map((item, idx) => (
                      <div key={idx} className="p-2 bg-paper rounded border border-line text-[11px]">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className={`font-semibold ${item.speaker === "Doctor" ? "text-accent" : "text-amber-500"}`}>
                            [{item.time}] {item.speaker}:
                          </span>
                        </div>
                        <p className="text-ink font-sans">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Run Button & Simulation Controller */}
            <div className="pt-4 border-t border-line flex items-center justify-between">
              <span className="font-mono text-xs text-ink-soft">
                {agentStep === 4
                  ? "SOAP Note Document Saved"
                  : agentStep === 0
                  ? "Ready to Transcribe"
                  : `Executing Step 0${agentStep} / 04`}
              </span>
              <button
                onClick={handleRunAgentSim}
                disabled={isSimulating}
                className="flex items-center gap-1.5 px-4 py-2 bg-ink text-paper text-xs font-mono font-medium rounded-token hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isSimulating ? "Synthesizing Note..." : "Run Step-by-Step"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
