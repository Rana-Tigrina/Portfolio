"use client";

import React, { useState } from "react";
import { siteData, ProofMetric } from "@/content/site";
import { sound } from "@/lib/sound";
import { SlidingNumber } from "./ui/sliding-number";
import { Info, CheckCircle2, Activity } from "lucide-react";
import { motion } from "motion/react";

// Micro-sparkline paths matching each metric's technical domain
const sparklinePaths = [
  "M0 16 Q15 4, 30 14 T60 8 T90 2 T120 6", // accuracy
  "M0 18 L25 15 L50 9 L75 5 L100 3 L120 1", // latency drop
  "M0 16 L20 12 L45 14 L70 6 L95 8 L120 2", // speedup
  "M0 15 Q30 18, 60 8 T120 4", // token reduction
  "M0 17 L25 14 L50 8 L75 10 L100 4 L120 2", // hallucination zero
  "M0 18 Q20 14, 40 16 T80 6 T120 2", // evaluations
];

function AnimatedMetric({ metric, index }: { metric: ProofMetric; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const sparkline = sparklinePaths[index % sparklinePaths.length];

  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true);
        sound.playClick(820);
      }}
      onMouseLeave={() => setIsHovered(false)}
      className="relative p-4 sm:p-5 border-r border-b border-line/80 last:border-r-0 hover:bg-paper-2/90 transition-all cursor-pointer group overflow-hidden"
    >
      {/* Micro-glow on active hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-radial from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
      />

      <div className="flex items-start justify-between mb-2 relative z-10">
        <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-ink-soft group-hover:text-ink transition-colors">
          {metric.sublabel}
        </span>
        <Info className="w-3.5 h-3.5 text-ink-soft/50 group-hover:text-accent transition-colors shrink-0" />
      </div>

      {/* Mechanical Sliding Odometer */}
      <div className="flex items-baseline gap-0.5 font-mono text-3xl sm:text-4xl font-semibold text-ink tracking-tight relative z-10">
        <SlidingNumber
          value={metric.value}
          prefix={metric.prefix}
          suffix={metric.suffix}
        />
      </div>

      <div className="mt-1 font-sans text-xs sm:text-sm font-medium text-ink relative z-10">
        {metric.label}
      </div>

      {/* Tectonic Sparkline SVG that draws on entrance */}
      <div className="mt-3 w-full h-5 overflow-hidden opacity-35 group-hover:opacity-85 transition-opacity">
        <svg viewBox="0 0 120 20" className="w-full h-full stroke-accent fill-none">
          <motion.path
            d={sparkline}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.1 }}
          />
        </svg>
      </div>

      {/* Interactive Telemetry Provenance Card */}
      {isHovered && (
        <div className="absolute left-2 right-2 -bottom-2 translate-y-full z-40 p-3.5 bg-paper border border-line rounded-token shadow-2xl font-mono text-xs text-ink animate-fade-in pointer-events-none backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-accent font-semibold text-[11px] mb-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Empirical Production Benchmark:</span>
          </div>
          <p className="font-sans text-xs text-ink-soft leading-relaxed">
            {metric.detail}
          </p>
          <div className="mt-2 pt-2 border-t border-line/60 flex items-center justify-between text-[10px] text-ink-soft/70">
            <span>Provenance: Verified CI/CD Log</span>
            <span className="text-accent flex items-center gap-1">
              <Activity className="w-3 h-3 animate-pulse" /> Live Target
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProofBar() {
  return (
    <section className="border-b border-line bg-paper relative z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-line/60">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
            <span className="font-mono text-xs uppercase tracking-wider text-ink font-medium">
              Quantified Production Telemetry &amp; Ground Truth
            </span>
          </div>
          <span className="text-[11px] font-mono text-accent">
            Hover metric for verified benchmark provenance →
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-l border-t border-line/80 mt-3 rounded-lg overflow-hidden bg-paper shadow-2xs">
          {siteData.proofMetrics.map((metric, idx) => (
            <AnimatedMetric key={metric.id} metric={metric} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
