"use client";

import React, { useState, useEffect, useRef } from "react";
import { siteData, ProofMetric } from "@/content/site";
import { sound } from "@/lib/sound";
import { Info, CheckCircle2 } from "lucide-react";

function AnimatedMetric({ metric }: { metric: ProofMetric }) {
  const [currentVal, setCurrentVal] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 900;
          const steps = 30;
          const stepTime = duration / steps;
          const increment = metric.value / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= metric.value) {
              setCurrentVal(metric.value);
              clearInterval(timer);
            } else {
              setCurrentVal(Math.floor(current));
            }
          }, stepTime);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [metric.value, hasAnimated]);

  return (
    <div
      ref={ref}
      onMouseEnter={() => {
        setIsHovered(true);
        sound.playClick(820);
      }}
      onMouseLeave={() => setIsHovered(false)}
      className="relative p-4 sm:p-5 border-r border-b border-line/80 last:border-r-0 hover:bg-paper-2 transition-colors cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
          {metric.sublabel}
        </span>
        <Info className="w-3.5 h-3.5 text-ink-soft/60 group-hover:text-accent transition-colors" />
      </div>

      <div className="flex items-baseline gap-1 font-mono text-3xl sm:text-4xl font-semibold text-ink tracking-tight">
        <span>{metric.prefix}</span>
        <span>{currentVal}</span>
        <span className="text-xl sm:text-2xl text-accent">{metric.suffix}</span>
      </div>

      <div className="mt-1 font-sans text-xs sm:text-sm font-medium text-ink">
        {metric.label}
      </div>

      {/* Interactive Tooltip Card */}
      {isHovered && (
        <div className="absolute left-4 right-4 -bottom-2 translate-y-full z-30 p-3 bg-paper border border-line rounded-token shadow-lg font-mono text-xs text-ink animate-fade-in pointer-events-none">
          <div className="flex items-center gap-1.5 text-accent font-semibold text-[11px] mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Ground Truth:</span>
          </div>
          <p className="font-sans text-xs text-ink-soft leading-relaxed">
            {metric.detail}
          </p>
        </div>
      )}
    </div>
  );
}

export function ProofBar() {
  return (
    <section className="border-b border-line bg-paper">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between pb-3 border-b border-line/60">
          <span className="font-mono text-xs uppercase tracking-wider text-ink-soft">
            Quantified Production Benchmarks & Evidence
          </span>
          <span className="text-[11px] font-mono text-accent">
            Hover metric for provenance
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-l border-t border-line/80 mt-3">
          {siteData.proofMetrics.map((metric) => (
            <AnimatedMetric key={metric.id} metric={metric} />
          ))}
        </div>
      </div>
    </section>
  );
}
