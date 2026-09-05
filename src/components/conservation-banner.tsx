"use client";

import React, { useState, useEffect } from "react";

export function ConservationBanner() {
  const [ambientTemp, setAmbientTemp] = useState("ROOM I · 16°C · DRY ASH");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const sectionTemps: Record<string, string> = {
      "act-1": "ROOM I · 16°C · DRY ASH",
      "act-2": "ROOM II · 14°C · CAST IRON & SLATE",
      "act-3": "ROOM III · 18°C · HONED LIMESTONE",
      "act-4": "ROOM IV · 21°C · VERDIGRIS & VELVET",
      "act-5": "ROOM V · 23°C · GOLD LEAF & GESSO",
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            if (id && sectionTemps[id]) {
              setAmbientTemp(sectionTemps[id]);
            }
          }
        });
      },
      { rootMargin: "-25% 0px -45% 0px" }
    );

    const sections = document.querySelectorAll("section[id^='act-']");
    sections.forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, []);

  const toggleMotion = () => {
    const nextState = !reducedMotion;
    setReducedMotion(nextState);
    if (nextState) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
  };

  return (
    <aside
      id="conservation-banner"
      className="sticky top-0 z-50 bg-[#0e0e12] border-b border-[#2d2d33] px-4 py-1.5 text-xs font-mono flex items-center justify-between text-[#ded8cb]"
      aria-label="Museum Preservation & Ambient Environment"
    >
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[#C9A227] animate-pulse" />
        <span className="hidden sm:inline">
          CONSERVATION NOTICE: TATE DIGITAL EXHIBITION NO. 2026.09 · AMBIENT LIGHT: 14 LUX · PRESS{" "}
          <kbd className="px-1.5 py-0.5 border border-neutral-600 bg-neutral-900 text-white rounded text-[10px]">
            A
          </kbd>{" "}
          FOR AUDIO CURATOR
        </span>
        <span className="sm:hidden text-[10px]">
          TATE DIGITAL · NO. 2026.09
        </span>
      </div>
      <div className="flex items-center gap-4 text-[11px]">
        <span className="text-neutral-400 font-mono hidden md:inline">{ambientTemp}</span>
        <button
          onClick={toggleMotion}
          className="hover:text-[#C9A227] underline transition-colors cursor-pointer text-[11px]"
          title="Toggle conservation static fallback"
        >
          {reducedMotion ? "Conserve Motion [Static]" : "Conserve Motion [Normal]"}
        </button>
      </div>
    </aside>
  );
}
