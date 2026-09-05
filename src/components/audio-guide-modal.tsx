"use client";

import React, { useState, useEffect } from "react";
import { sound } from "@/lib/sound";
import { Headphones, X, Volume2 } from "lucide-react";

export function AudioGuideModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "a" || e.key === "A") &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) sound.playClick(900);
          return !prev;
        });
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* Floating Toggle if closed */}
      <button
        onClick={() => {
          sound.playClick(900);
          setIsOpen(true);
        }}
        className="fixed bottom-6 left-6 z-40 px-3 py-2 rounded-sm border border-[#C9A227]/40 bg-[#0e0e12]/90 backdrop-blur-md text-[#C9A227] font-mono text-xs hover:bg-[#C9A227]/10 transition-all flex items-center gap-2 shadow-2xl"
        title="Open Curatorial Audio Desk (Key: A)"
      >
        <Headphones className="w-4 h-4 text-[#C9A227] animate-pulse" />
        <span className="hidden sm:inline">AUDIO DESK [A]</span>
      </button>

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-[#0e0e13] border-l border-[#C9A227]/30 z-50 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Curatorial Audio Catalogue"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C9A227] animate-ping" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#f5f2eb] font-semibold">
                CURATORIAL AUDIO DESK
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white font-mono text-xs px-2 py-1 border border-white/10 rounded cursor-pointer"
            >
              ESC ✕
            </button>
          </div>

          <div className="space-y-4 font-serif text-sm text-[#ded8cb] leading-relaxed">
            <div className="font-mono text-[10px] text-[#C9A227] uppercase tracking-wider">
              CURATORIAL COMMENTARY · ROOM BY ROOM
            </div>

            <div className="p-3 bg-[#0a0a0c] border border-white/5 rounded space-y-1">
              <strong className="text-white block font-sans text-xs">
                Room 01: The Antechamber &amp; The Loom
              </strong>
              <p className="text-xs text-neutral-400">
                &ldquo;Notice how the orthogonal lines of Anni Albers establish the ground before any computation is shown. You are introduced to Munawwar not through boasts, but through verified empirical ratios: 91% diagnostic parity, 87% retrieval accuracy.&rdquo;
              </p>
            </div>

            <div className="p-3 bg-[#0a0a0c] border border-white/5 rounded space-y-1">
              <strong className="text-white block font-sans text-xs">
                Room 02: Four Monumental Apparatuses
              </strong>
              <p className="text-xs text-neutral-400">
                &ldquo;We reject the word &apos;projects&apos;. These are four calibrated state apparatuses. The healthcare claim auditor explicitly uses deterministic math to avoid sending unnecessary prompts to an LLM. Rigor is knowing when NOT to use artificial intelligence.&rdquo;
              </p>
            </div>

            <div className="p-3 bg-[#0a0a0c] border border-white/5 rounded space-y-1">
              <strong className="text-white block font-sans text-xs">
                Room 03: The Bench &amp; Squeegee
              </strong>
              <p className="text-xs text-neutral-400">
                &ldquo;Here the museum provides a resting point. The Richter canvas invites you to smear the telemetry with your own hands, reminding us of the tactile materiality of software.&rdquo;
              </p>
            </div>

            <div className="p-3 bg-[#0a0a0c] border border-white/5 rounded space-y-1">
              <strong className="text-white block font-sans text-xs">
                Room 04: The Gaze &amp; Teletherapy
              </strong>
              <p className="text-xs text-neutral-400">
                &ldquo;Taylor &amp; Francis published Munawwar&apos;s multimodal teletherapy research. The human eye cannot deceive; gaze fixations reveal affective distress far earlier than conversational speech.&rdquo;
              </p>
            </div>

            <div className="p-3 bg-[#0a0a0c] border border-white/5 rounded space-y-1">
              <strong className="text-white block font-sans text-xs">
                Room 05: Kintsugi &amp; Rumi
              </strong>
              <p className="text-xs text-neutral-400">
                &ldquo;The golden scar running through the failure analysis honors the Japanese tradition of Kintsugi. Empathy is not a soft sentiment; it is a fault-tolerant distributed system.&rdquo;
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 font-mono text-[11px] text-neutral-500 flex items-center justify-between">
          <span>HOTKEY: Press <kbd className="px-1 border border-neutral-600 rounded bg-neutral-900 text-white">A</kbd></span>
          <span className="text-[#C9A227]">TATE MODERN DIGITAL</span>
        </div>
      </aside>
    </>
  );
}
