"use client";

import React from "react";
import { siteData } from "@/content/site";
import { sound } from "@/lib/sound";
import { Github, Linkedin } from "./icons";
import { ArrowUp, Mail, Sparkles } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    sound.playClick(950);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-16 bg-[#08080a] border-t border-line text-xs font-mono text-ink-soft">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-line pb-6">
          <div>
            <div className="font-serif italic text-lg text-ink font-normal">
              MUSEUM OF COGNITIVE RIGOR · EXHIBITION NO. 2026.09
            </div>
            <div className="text-[11px] text-ink-soft/80 mt-0.5">
              Curated for {siteData.personal.name} · IIT Madras Data Science Graduate
            </div>
          </div>
          <div className="text-[11px] text-accent font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NO SAAS DERIVATIVES · ZERO STOCHASTIC GUESSING</span>
          </div>
        </div>

        {/* 4-Column Museum Colophon Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-[11px] border-b border-line pb-8">
          
          {/* Col 1: Mined Pigments */}
          <div className="space-y-2">
            <span className="text-ink font-semibold uppercase tracking-wider block">
              Mined Pigments
            </span>
            <ul className="space-y-1 text-ink-soft">
              <li><span className="text-neutral-300 font-mono">#0a0a0c</span>: Soulages Outrenoir</li>
              <li><span className="text-neutral-300 font-mono">#f5f2eb</span>: Gesso Bone White</li>
              <li><span className="text-neutral-300 font-mono">#002FA7</span>: Yves Klein Blue</li>
              <li><span className="text-neutral-300 font-mono">#C9A227</span>: 24K Kintsugi Gold</li>
              <li><span className="text-neutral-300 font-mono">#3BA89F</span>: Oxidized Verdigris</li>
            </ul>
          </div>

          {/* Col 2: Typographic Hierarchy */}
          <div className="space-y-2">
            <span className="text-ink font-semibold uppercase tracking-wider block">
              Typographic System
            </span>
            <ul className="space-y-1 text-ink-soft">
              <li>Display: Monumental Serif</li>
              <li>Wall Serifs: Newsreader &amp; Cormorant</li>
              <li>Functional Body: IBM Plex Sans</li>
              <li>Telemetry: JetBrains &amp; Plex Mono</li>
            </ul>
          </div>

          {/* Col 3: Curatorial Lineage */}
          <div className="space-y-2">
            <span className="text-ink font-semibold uppercase tracking-wider block">
              Curatorial Lineage
            </span>
            <ul className="space-y-1 text-ink-soft">
              <li>Caravaggio (Tenebrist Light)</li>
              <li>Anni Albers (Loom Warp &amp; Weft)</li>
              <li>Guo Xi (Three Discrete Distances)</li>
              <li>Gerhard Richter (Temporal Blur)</li>
              <li>Rumi (The Masnavi Epigraph)</li>
            </ul>
          </div>

          {/* Col 4: Engine & Codebase */}
          <div className="space-y-2">
            <span className="text-ink font-semibold uppercase tracking-wider block">
              Runtime Architecture
            </span>
            <ul className="space-y-1 text-ink-soft">
              <li>Core: Next.js 16 + React 19</li>
              <li>Physics: Motion 12.4 + GSAP 3.12</li>
              <li>Audio: Web Audio API (432Hz Harmonic)</li>
              <li>Gating: RAGAS CI/CD Regression</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Links & Scroll to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-4">
            <a
              href={siteData.personal.github}
              target="_blank"
              rel="noreferrer"
              onClick={() => sound.playClick(750)}
              className="hover:text-ink transition-colors flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <span>·</span>
            <a
              href={siteData.personal.linkedin}
              target="_blank"
              rel="noreferrer"
              onClick={() => sound.playClick(750)}
              className="hover:text-ink transition-colors flex items-center gap-1.5"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
            <span>·</span>
            <a
              href={`mailto:${siteData.personal.email}`}
              onClick={() => sound.playClick(750)}
              className="hover:text-ink transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] text-ink-soft/70">
              ALL RIGHTS RESERVED &copy; 2026 MOHAMMAD MUNAWWAR MALOOK
            </span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-line rounded-token bg-paper-2 hover:border-ink-soft text-ink transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5 text-accent" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
