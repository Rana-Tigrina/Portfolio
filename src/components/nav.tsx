"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  Bot,
} from "lucide-react";

export function Nav() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const unsub = sound.subscribe((muted) => setIsMuted(muted));
    const isDarkTheme = document.documentElement.classList.contains("dark");
    setIsDark(isDarkTheme);

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
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      unsub();
    };
  }, []);

  const toggleTheme = () => {
    sound.playClick(750);
    const root = document.documentElement;
    const nextDark = !root.classList.contains("dark");
    if (nextDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    setIsDark(nextDark);
    try {
      localStorage.setItem("theme", nextDark ? "dark" : "light");
    } catch {}
  };

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const navLinks = [
    { label: "Work", href: "#work" },
    { label: "The Lab", href: "#lab" },
    { label: "Research", href: "#research" },
    { label: "Experience", href: "#experience" },
    { label: "Skills", href: "#skills" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-line/80 bg-paper/95 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* Brand Wordmark & Live Status */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#"
              onClick={() => sound.playClick(900)}
              className="group flex items-center gap-2 text-ink hover:text-accent transition-colors"
            >
              <span className="font-mono text-sm font-semibold tracking-tight">
                {siteData.personal.wordmark}
              </span>
              <span className="hidden xl:inline-block font-mono text-[11px] text-ink-soft group-hover:text-ink transition-colors">
                / {siteData.personal.role}
              </span>
            </a>

            {/* Status Dot */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 border border-line/70 rounded-full bg-paper-2/80 text-[10.5px] font-mono text-ink-soft shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span>Available</span>
            </div>
          </div>

          {/* Center Links (Desktop) - Centered with balanced breathing room */}
          <nav
            className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 flex-1 mx-6 xl:mx-10"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => sound.playClick(750)}
                className="text-xs font-mono uppercase tracking-wider text-ink-soft hover:text-ink transition-colors py-1 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-accent after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 justify-end">
            {/* AI Copilot Trigger */}
            <button
              onClick={() => {
                sound.playClick(900);
                window.dispatchEvent(new CustomEvent("open-portfolio-chat"));
              }}
              className="flex items-center gap-1.5 px-2.5 h-8 text-xs font-mono text-ink hover:text-accent bg-paper-2/90 border border-accent/40 rounded-token hover:border-accent hover:shadow-xs transition-colors cursor-pointer group"
              title="Ask Munawwar AI Copilot (Ctrl+J or ⌘J)"
              aria-label="Open AI Copilot"
            >
              <Bot className="w-3.5 h-3.5 text-accent" />
              <span className="hidden sm:inline font-medium">Copilot</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            </button>

            {/* Quick Command Palette Trigger */}
            <button
              onClick={() => {
                sound.playClick(850);
                setPaletteOpen(true);
              }}
              className="flex items-center gap-1.5 px-2.5 h-8 text-xs font-mono text-ink-soft hover:text-ink bg-paper-2/50 border border-line/70 rounded-token hover:border-ink-soft transition-colors cursor-pointer"
              title="Open Command Palette (Ctrl+K or ⌘K)"
              aria-label="Search and command palette"
            >
              <Command className="w-3.5 h-3.5 text-accent" />
              <span className="hidden xl:inline text-xs">Search</span>
              <kbd className="hidden sm:inline-block text-[10px] text-ink-soft/80 font-mono px-1 py-0.2 bg-paper/90 border border-line/60 rounded">⌘K</kbd>
            </button>

            {/* Hairline Separator */}
            <div className="hidden sm:block w-px h-4 bg-line/80 mx-0.5" />

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className="w-8 h-8 flex items-center justify-center text-ink-soft hover:text-ink bg-paper-2/50 border border-line/70 hover:border-line rounded-token transition-colors cursor-pointer relative"
              title={isMuted ? "Unmute Audio FX (Press M)" : "Mute Audio FX (Press M)"}
              aria-label={isMuted ? "Unmute Audio FX" : "Mute Audio FX"}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-accent" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                </>
              )}
            </button>

            {/* Theme Toggle with smooth icon animation */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              className="w-8 h-8 flex items-center justify-center text-ink-soft hover:text-ink bg-paper-2/50 border border-line/70 hover:border-line rounded-token transition-colors cursor-pointer relative overflow-hidden"
              title={isDark ? "Switch to Editorial Paper mode" : "Switch to Dark Terminal mode"}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ scale: 0.6, rotate: -45, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0.6, rotate: 45, opacity: 0 }}
                    transition={{ duration: 0.14, ease: "easeOut" }}
                    className="flex items-center justify-center"
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ scale: 0.6, rotate: 45, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0.6, rotate: -45, opacity: 0 }}
                    transition={{ duration: 0.14, ease: "easeOut" }}
                    className="flex items-center justify-center"
                  >
                    <Moon className="w-3.5 h-3.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Primary CTA */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                const el = document.querySelector("#contact");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="hidden sm:inline-flex h-8 px-3.5 text-xs font-mono ml-0.5"
            >
              Contact
            </Button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 flex items-center justify-center text-ink-soft hover:text-ink border border-line rounded-token"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-line bg-paper px-4 py-4 space-y-3 animate-fade-in">
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
              <button
                onClick={() => {
                  sound.playClick(900);
                  setMobileMenuOpen(false);
                  window.dispatchEvent(new CustomEvent("open-portfolio-chat"));
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-mono text-ink hover:text-accent bg-paper-2 border border-line rounded-token text-left"
              >
                <span className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-accent" />
                  <span>Ask Portfolio Copilot</span>
                </span>
                <span className="text-[10px] text-accent font-semibold px-1.5 py-0.5 bg-accent-soft rounded-token">
                  Active
                </span>
              </button>
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
