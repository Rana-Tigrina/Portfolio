"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { sound } from "@/lib/sound";
import { ChevronsLeftRight, Sparkles, AlertTriangle, ShieldCheck } from "lucide-react";

export function CodeCompareSlider() {
  const [sliderPos, setSliderPos] = useState(48);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    };
    const onMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        sound.playClick(680);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    };
    const onTouchEnd = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchend", onTouchEnd);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isDragging, handleMove]);

  return (
    <div className="w-full max-w-5xl mx-auto my-12 border border-line rounded-lg bg-paper-2 overflow-hidden shadow-lg">
      {/* Header bar */}
      <div className="px-4 py-3 bg-paper border-b border-line flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-ink">
            Interactive Architecture Comparator
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <span className="text-red-500/90 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Naive RAG (Left)
          </span>
          <span className="text-ink-soft">↔</span>
          <span className="text-accent flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Production DAG (Right)
          </span>
        </div>
      </div>

      {/* Comparison Stage */}
      <div
        ref={containerRef}
        className="relative select-none h-[420px] bg-[#0c0d12] text-white font-mono text-xs overflow-hidden"
      >
        {/* Right Pane: Munawwar's Production Architecture */}
        <div className="absolute inset-0 p-5 overflow-x-auto">
          <div className="text-emerald-400 font-bold mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            # [PRODUCTION ARCHITECTURE: MUNAWWAR]
          </div>
          <pre className="text-gray-300 leading-relaxed">
            <span className="text-emerald-400">from</span> langgraph.graph{" "}
            <span className="text-emerald-400">import</span> StateGraph, END{"\n"}
            <span className="text-emerald-400">from</span> pydantic{" "}
            <span className="text-emerald-400">import</span> BaseModel, Field{"\n\n"}
            <span className="text-gray-500"># 1. Deterministic CPT/ICD overlap code filter</span>{"\n"}
            <span className="text-emerald-400">def</span>{" "}
            <span className="text-amber-300 font-bold">deterministic_gate</span>(state: ClaimState):{"\n"}
            {"    "}overlap = calc_code_overlap(state.cpt, state.icd){"\n"}
            {"    "}<span className="text-amber-400">if</span> overlap &gt;= 0.85:{"\n"}
            {"        "}<span className="text-amber-400">return</span> &#123;&quot;skip_llm&quot;:{" "}
            <span className="text-emerald-300">True</span>, &quot;status&quot;: &quot;APPROVED&quot;&#125;{"\n"}
            {"    "}<span className="text-amber-400">return</span> &#123;&quot;skip_llm&quot;:{" "}
            <span className="text-emerald-300">False</span>&#125;{"\n\n"}
            <span className="text-gray-500"># 2. BioClinicalBERT + Gemini 3.8 Flash Adjudication</span>{"\n"}
            <span className="text-emerald-400">def</span>{" "}
            <span className="text-amber-300 font-bold">clinical_reasoner</span>(state: ClaimState):{"\n"}
            {"    "}verdict = gemini.invoke(CMS_PROMPT.format(state)){"\n"}
            {"    "}composite = 0.6 * verdict.conf + 0.4 * state.overlap{"\n"}
            {"    "}<span className="text-amber-400">return</span> &#123;&quot;composite_score&quot;: composite&#125;{"\n\n"}
            <span className="text-gray-500"># 3. Gated router: human-in-the-loop if &lt; 0.72</span>{"\n"}
            <span className="text-emerald-400">def</span>{" "}
            <span className="text-amber-300 font-bold">safety_gate</span>(state: ClaimState):{"\n"}
            {"    "}<span className="text-amber-400">return</span> &quot;draft_appeal&quot;{" "}
            <span className="text-amber-400">if</span> state.composite_score &gt;= 0.72{" "}
            <span className="text-amber-400">else</span> &quot;human_review&quot;
          </pre>
        </div>

        {/* Left Pane: Naive Implementation */}
        <div
          className="absolute inset-y-0 left-0 bg-[#160b0e] border-r-2 border-amber-400 p-5 overflow-x-auto"
          style={{ width: `${sliderPos}%` }}
        >
          <div className="text-red-400 font-bold mb-2 flex items-center gap-1.5 whitespace-nowrap">
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            # [NAIVE ENTERPRISE IMPLEMENTATION: UNCALIBRATED]
          </div>
          <pre className="text-red-200/90 leading-relaxed whitespace-pre">
            <span className="text-red-400">import</span> openai{"\n\n"}
            <span className="text-gray-500"># Direct un-gated prompt directly into raw LLM</span>{"\n"}
            <span className="text-red-400">def</span>{" "}
            <span className="text-amber-200 font-bold">adjudicate_claim</span>(raw_claim_text):{"\n"}
            {"    "}prompt = f&quot;Review this Medicare claim: &#123;raw_claim_text&#125;&quot;{"\n"}
            {"    "}response = openai.ChatCompletion.create({"\n"}
            {"        "}model=&quot;gpt-4o&quot;,{"\n"}
            {"        "}messages=[&#123;&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: prompt&#125;]{"\n"}
            {"    "}){"\n"}
            {"    "}<span className="text-red-400"># RISK: No deterministic validation</span>{"\n"}
            {"    "}<span className="text-red-400"># RISK: Zero confidence calibration</span>{"\n"}
            {"    "}<span className="text-red-400"># RISK: Hallucinated medical codes</span>{"\n"}
            {"    "}<span className="text-red-400">return</span> response.choices[0].message.content
          </pre>
        </div>

        {/* Squeegee Drag Handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-400 text-black flex items-center justify-center cursor-ew-resize shadow-[0_0_16px_rgba(251,191,36,0.6)] z-20 transition-transform active:scale-110"
          style={{ left: `${sliderPos}%` }}
          onMouseDown={() => {
            setIsDragging(true);
            sound.playHover();
          }}
          onTouchStart={() => {
            setIsDragging(true);
          }}
        >
          <ChevronsLeftRight className="w-4 h-4" />
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="px-4 py-2 bg-paper text-ink-soft font-mono text-[11px] flex items-center justify-between border-t border-line">
        <span>← Drag handle to contrast architectural failure modes</span>
        <span>Benchmark: +91% Accuracy on CMS Medicare rules</span>
      </div>
    </div>
  );
}
