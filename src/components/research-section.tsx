"use client";

import React, { useState } from "react";
import { siteData, Publication } from "@/content/site";
import { sound } from "@/lib/sound";
import { BookOpen, Copy, Check, ExternalLink, Quote, Sparkles } from "lucide-react";

export function ResearchSection() {
  const [selectedBibtex, setSelectedBibtex] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyBibtex = (bibtex: string) => {
    navigator.clipboard.writeText(bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="research" className="py-20 md:py-28 border-b border-line bg-paper">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-sans text-xs text-accent font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-accent/30 bg-accent-soft">
              Publications
            </span>
            <span className="text-xs font-sans text-ink-soft">/ 02 Peer-Reviewed + 01 Under Review</span>
          </div>
          <h2 className="font-serif italic text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight">
            Applied Research &amp; Publications
          </h2>
          <p className="font-sans text-sm sm:text-base text-ink-soft max-w-2xl leading-relaxed">
            Bridging mathematical theory to production systems—investigating multimodal teletherapy and systematic cognitive dynamics at IIT Madras.
          </p>
        </div>

        {/* Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {siteData.publications.map((pub: Publication) => {
            return (
              <div
                key={pub.id}
                className="p-6 sm:p-7 bg-paper border border-line rounded-2xl flex flex-col justify-between space-y-5 hover:border-accent/50 transition-all duration-200 shadow-2xs"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-sans text-xs tracking-wide px-2.5 py-0.5 rounded-full border ${
                        pub.status === "Published"
                          ? "bg-accent-soft text-accent border-accent/30 font-semibold"
                          : pub.status === "Accepted"
                          ? "bg-paper-2 text-ink border-line font-medium"
                          : "bg-paper-2 text-ink-soft border-line/60"
                      }`}
                    >
                      {pub.status} · {pub.year}
                    </span>
                    <span className="font-sans text-xs text-ink-soft">
                      {pub.venue.includes("(") ? pub.venue.split("(")[1].replace(")", "") : "Journal"}
                    </span>
                  </div>

                  <h3 className="font-serif italic text-lg text-ink leading-snug">
                    {pub.title}
                  </h3>

                  <p className="font-mono text-xs text-accent font-medium">
                    {pub.venue}
                  </p>

                  <p className="font-sans text-xs text-ink-soft leading-relaxed line-clamp-4">
                    {pub.abstract}
                  </p>

                  {/* Research Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {pub.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] text-ink-soft bg-paper-2 px-1.5 py-0.5 rounded-token border border-line"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-line/60 flex items-center justify-between">
                  <button
                    onClick={() => {
                      sound.playClick(850);
                      setSelectedBibtex(pub.bibtex);
                    }}
                    className="flex items-center gap-1 font-mono text-xs text-ink-soft hover:text-ink transition-colors cursor-pointer"
                  >
                    <Quote className="w-3 h-3 text-accent" />
                    <span>Cite (BibTeX)</span>
                  </button>

                  <span className="font-mono text-[11px] text-ink-soft">
                    IIT Madras
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Narrative Progression Banner */}
        <div className="p-4 bg-paper-2 border border-line rounded-token flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-ink-soft">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent shrink-0" />
            <span>The Research-to-Production Continuum:</span>
          </div>
          <div className="flex items-center gap-2 text-ink text-[11px] overflow-x-auto">
            <span>Formulate Hypothesis</span>
            <span className="text-accent">&rarr;</span>
            <span>Empirical Benchmarking</span>
            <span className="text-accent">&rarr;</span>
            <span>Model Optimization</span>
            <span className="text-accent">&rarr;</span>
            <strong className="text-accent">Production Serving</strong>
          </div>
        </div>
      </div>

      {/* BibTeX Modal */}
      {selectedBibtex && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-paper border border-line rounded-token shadow-2xl overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <span className="font-mono text-xs font-semibold uppercase text-ink">
                BibTeX Citation
              </span>
              <button
                onClick={() => {
                  sound.playClick(600);
                  setSelectedBibtex(null);
                }}
                className="font-mono text-xs text-ink-soft hover:text-ink"
              >
                Close (ESC)
              </button>
            </div>

            <pre className="p-3 bg-paper-2 border border-line rounded-token font-mono text-xs text-ink overflow-x-auto whitespace-pre-wrap">
              {selectedBibtex}
            </pre>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleCopyBibtex(selectedBibtex)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-ink text-paper text-xs font-mono rounded-token hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied to Clipboard!" : "Copy BibTeX"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
