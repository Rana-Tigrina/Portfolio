"use client";

import React, { useState } from "react";
import { siteData, Publication } from "@/content/site";
import { sound } from "@/lib/sound";
import { EncryptedText } from "./ui/encrypted-text";
import { BorderTrail } from "./ui/border-trail";
import { BookOpen, Copy, Check, ExternalLink, Quote, Sparkles, Compass, Eye } from "lucide-react";

export function ResearchSection() {
  const [selectedBibtex, setSelectedBibtex] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyBibtex = (bibtex: string) => {
    sound.playSuccess();
    navigator.clipboard.writeText(bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="research" className="py-16 md:py-24 border-b border-line relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10 relative z-10">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-accent font-semibold tracking-wider uppercase">
              Applied Research &amp; Publications
            </span>
            <span className="text-xs font-mono text-ink-soft">/ 02 Published + 01 Under Review</span>
          </div>
          <h2 className="font-serif italic text-3xl sm:text-5xl text-ink">
            Bridging Mathematical Theory to Production Systems
          </h2>
          <p className="font-sans text-sm sm:text-base text-ink-soft max-w-2xl leading-relaxed">
            Investigating multimodal affective computing in clinical psychiatric healthcare and the systemic cognitive workload dynamics of generative AI tools.
          </p>
        </div>

        {/* Papers Grid with Sculpted Mass and Encrypted Decryption */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {siteData.publications.map((pub: Publication, idx: number) => {
            const isFlagship = pub.status === "Published";

            return (
              <div
                key={pub.id}
                data-cursor="paper"
                data-cursor-text="PAPER"
                className="relative p-6 sm:p-7 bg-paper border border-line rounded-2xl flex flex-col justify-between space-y-6 hover:border-accent/50 transition-all group overflow-hidden shadow-xs hover:shadow-md"
              >
                {/* Cybernetic Laser Trail on Flagship Published Papers */}
                {isFlagship && idx === 0 && <BorderTrail size={100} duration={8} />}

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-token border ${
                        pub.status === "Published"
                          ? "bg-accent-soft text-accent border-accent/30 font-semibold"
                          : pub.status === "Accepted"
                          ? "bg-paper-2 text-ink border-line"
                          : "bg-paper-2 text-ink-soft border-line/60"
                      }`}
                    >
                      {pub.status} · {pub.year}
                    </span>
                    <span className="font-mono text-[11px] text-ink-soft flex items-center gap-1">
                      {pub.title.toLowerCase().includes("gaze") && (
                        <Eye className="w-3 h-3 text-accent animate-pulse" />
                      )}
                      {pub.venue.includes("(") ? pub.venue.split("(")[1].replace(")", "") : "Peer-Reviewed"}
                    </span>
                  </div>

                  {/* Scramble Decrypt Title on Scroll Entrance */}
                  <h3 className="font-serif italic text-xl text-ink leading-snug tracking-tight">
                    <EncryptedText
                      text={pub.title}
                      className="font-serif italic"
                      interval={18}
                      triggerOnHover={true}
                    />
                  </h3>

                  <p className="font-mono text-xs text-accent font-medium">
                    {pub.venue}
                  </p>

                  <p className="font-sans text-xs text-ink-soft leading-relaxed line-clamp-4">
                    {pub.abstract}
                  </p>

                  {/* Research Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {pub.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] text-ink-soft bg-paper-2 px-2 py-0.5 rounded-token border border-line"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-line/60 flex items-center justify-between relative z-10">
                  <button
                    onClick={() => {
                      sound.playClick(850);
                      setSelectedBibtex(pub.bibtex);
                    }}
                    className="flex items-center gap-1.5 font-mono text-xs text-accent hover:text-accent/80 transition-colors cursor-pointer"
                  >
                    <Quote className="w-3.5 h-3.5" />
                    <span>Cite (BibTeX)</span>
                  </button>

                  <span className="font-mono text-[11px] text-ink-soft/70">
                    IIT Madras
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* The Epistemological Continuum Banner (Poetic & Mathematical) */}
        <div className="p-4 sm:p-5 bg-paper-2 border border-line rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-ink-soft">
          <div className="flex items-center gap-2 text-ink">
            <Compass className="w-4 h-4 text-accent shrink-0" />
            <span className="font-semibold">The Rigor-to-Production Continuum:</span>
          </div>
          <div className="flex items-center gap-2 text-ink-soft text-[11px] overflow-x-auto">
            <span>Hypothesis</span>
            <span className="text-accent font-bold">→</span>
            <span>Empirical Dataset</span>
            <span className="text-accent font-bold">→</span>
            <span>Peer Review</span>
            <span className="text-accent font-bold">→</span>
            <span className="text-accent font-semibold">Production Hardening</span>
          </div>
        </div>

        {/* BibTeX Modal */}
        {selectedBibtex && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setSelectedBibtex(null)}
          >
            <div
              className="bg-paper border border-line rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2 font-mono text-xs text-accent font-semibold">
                  <BookOpen className="w-4 h-4" />
                  <span>BibTeX Citation</span>
                </div>
                <button
                  onClick={() => setSelectedBibtex(null)}
                  className="text-ink-soft hover:text-ink font-mono text-xs cursor-pointer"
                >
                  [ESC / Close]
                </button>
              </div>

              <pre className="p-4 bg-paper-2 border border-line rounded-lg font-mono text-xs text-ink overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {selectedBibtex}
              </pre>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => handleCopyBibtex(selectedBibtex)}
                  className="px-4 py-2 bg-accent text-white font-mono text-xs rounded-token flex items-center gap-1.5 cursor-pointer shadow-sm hover:opacity-90 transition-opacity"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied Citation" : "Copy to Clipboard"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
