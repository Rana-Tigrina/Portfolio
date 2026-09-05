"use client";

import React, { useState, useEffect, useRef } from "react";
import { siteData } from "@/content/site";
import { sound } from "@/lib/sound";
import { CommandPalette } from "./command-palette";
import { Button } from "./ui/button";
import {
  Menu,
  X,
  Command,
  Sun,
  Moon,
  Volume2,
  VolumeX,
} from "lucide-react";

export function Nav() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const alphaRef = useRef<HTMLSpanElement>(null);
  const betaRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const unsub = sound.subscribe((muted) => setIsMuted(muted));
    const isDarkTheme = document.documentElement.classList.contains("dark");
    setIsDark(isDarkTheme);

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
          if (alphaRef.current) {
            alphaRef.current.textContent = (progress * 100).toFixed(2);
          }
          if (betaRef.current) {
            betaRef.current.textContent = ((progress + Math.sin(progress * Math.PI * 4) * 0.04) * 100).toFixed(2);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      } else if (
        (e.key === "m" || e.key === "M") &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        sound.toggleMute();
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      unsub();
    };
  }, []);

  const toggleTheme = () => {
    sound.playClick(750);
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      setIsDark(true);
    }
  };

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const navLinks = [
    { label: "I: Threshold", href: "#act-1" },
    { label: "II: Proof", href: "#act-2" },
    { label: "III: Cathedral", href: "#act-3" },
    { label: "IV: Gaze", href: "#act-4" },
    { label: "V: Communion", href: "#act-5" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-line/80 bg-paper/95 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              onClick={() => sound.playClick(900)}
              className="group flex items-baseline gap-2 text-ink hover:text-accent transition-colors"
            >
              <span className="font-mono text-sm font-semibold tracking-tight">
                {siteData.personal.wordmark}
              </span>
              <span className="hidden sm:inline-block font-mono text-[11px] text-ink-soft group-hover:text-ink transition-colors">
                / {siteData.personal.role}
              </span>
            </a>

            {/* Status Dot */}
            <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 border border-line rounded-token bg-paper-2 text-[11px] font-mono text-ink-soft">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span>Available</span>
            </div>
          </div>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => sound.playClick(750)}
                className="text-xs font-mono uppercase tracking-wider text-ink-soft hover:text-ink transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Steve Reich Phasing Dual Tickers */}
          <div className="hidden xl:flex items-center gap-2 border-l border-line pl-4 text-[10px] text-ink-soft font-mono">
            <span>PHASE-α: <span ref={alphaRef} className="text-ink">0.00</span></span>
            <span>·</span>
            <span>PHASE-β: <span ref={betaRef} className="text-accent">0.00</span></span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Audio Catalogue Desk Modal Trigger */}
            <button
              onClick={() => {
                sound.playClick(900);
                window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
              }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-accent border border-accent/40 bg-accent/10 rounded-token hover:bg-accent/20 transition-colors cursor-pointer"
              title="Open Curatorial Audio Desk (Press A)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
              <span>DESK [A]</span>
            </button>

            {/* Quick Command Palette Trigger */}
            <button
              onClick={() => {
                sound.playClick(850);
                setPaletteOpen(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-ink-soft hover:text-ink bg-paper-2 border border-line rounded-token hover:border-ink-soft transition-colors cursor-pointer"
              title="Open Command Palette (Ctrl+K or ⌘K)"
              aria-label="Search and command palette"
            >
              <Command className="w-3.5 h-3.5 text-accent" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline-block text-[10px] text-ink-soft/70">⌘K</kbd>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className="flex items-center gap-1.5 px-2 py-1 text-xs font-mono text-ink-soft hover:text-ink border border-line rounded-token hover:border-accent/60 transition-colors cursor-pointer"
              title={isMuted ? "Unmute Audio FX (Press M)" : "Mute Audio FX (Press M)"}
              aria-label={isMuted ? "Unmute Audio FX" : "Mute Audio FX"}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Muted</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-accent" />
                  <span className="hidden sm:inline text-[11px] text-accent font-medium">Sound ON</span>
                  <div className="flex items-end gap-0.5 h-2.5">
                    <span className="w-0.5 h-2 bg-accent animate-pulse rounded-full" />
                    <span className="w-0.5 h-3 bg-accent animate-pulse delay-75 rounded-full" />
                    <span className="w-0.5 h-1.5 bg-accent animate-pulse delay-150 rounded-full" />
                  </div>
                </>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 text-ink-soft hover:text-ink border border-transparent hover:border-line rounded-token transition-colors cursor-pointer"
              title={isDark ? "Switch to Editorial Paper mode" : "Switch to Dark Terminal mode"}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Primary CTA */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                const el = document.querySelector("#contact");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="hidden sm:inline-flex ml-1"
            >
              Contact
            </Button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-ink-soft hover:text-ink border border-line rounded-token"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-line bg-paper px-4 py-4 space-y-3 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    sound.playClick(750);
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 text-sm font-mono text-ink hover:bg-paper-2 rounded-token"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => {
                  sound.playClick(750);
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-sm font-mono text-accent font-semibold hover:bg-paper-2 rounded-token"
              >
                Get in Touch
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Global Command Palette */}
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
