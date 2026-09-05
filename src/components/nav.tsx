"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { siteData } from "@/content/site";
import { sound } from "@/lib/sound";
import { CommandPalette } from "./command-palette";
import { Button } from "./ui/button";
import { AnimatedDock, DockItem } from "./ui/animated-dock";
import { Menu, MenuItem, ProductItem, HoveredLink } from "./ui/navbar-menu";
import { Github, Linkedin } from "./icons";
import {
  Menu as MenuIcon,
  X,
  Command,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Bot,
  Sparkles,
  Workflow,
  Cpu,
  FlaskConical,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  FileCode2,
  ExternalLink,
} from "lucide-react";

export function Nav() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Navbar only appears when at the top/starting area of the page.
  // Smoothly disappears when scrolling away and does not reappear during mid-page scroll.
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Keep navbar locked open when interacting with menus
      if (activeMenu || mobileMenuOpen) {
        setNavVisible(true);
        return;
      }

      // Navbar is ONLY visible at top of page (scrollY <= 80)
      if (currentScrollY <= 80) {
        setNavVisible(true);
      } else {
        setNavVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeMenu, mobileMenuOpen]);

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

  const handleOpenCopilot = () => {
    sound.playClick(900);
    window.dispatchEvent(new CustomEvent("open-portfolio-chat"));
  };

  // Animated Dock Items with Magnification Physics
  const dockItems: DockItem[] = [
    {
      title: "GitHub",
      icon: <Github className="w-4 h-4" />,
      href: siteData.personal.github,
      target: "_blank",
      ariaLabel: "Munawwar's GitHub Profile",
    },
    {
      title: "LinkedIn",
      icon: <Linkedin className="w-4 h-4" />,
      href: siteData.personal.linkedin,
      target: "_blank",
      ariaLabel: "Munawwar's LinkedIn Profile",
    },
    {
      title: "AI Copilot",
      icon: <Bot className="w-4 h-4 text-accent" />,
      onClick: handleOpenCopilot,
      badge: <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />,
      ariaLabel: "Ask AI Copilot",
    },
    {
      title: "Search (⌘K)",
      icon: <Command className="w-4 h-4" />,
      onClick: () => {
        sound.playClick(850);
        setPaletteOpen(true);
      },
      ariaLabel: "Open Command Palette",
    },
    {
      title: isMuted ? "Unmute Audio (M)" : "Mute Audio (M)",
      icon: isMuted ? (
        <VolumeX className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4 text-accent" />
      ),
      onClick: toggleSound,
      ariaLabel: isMuted ? "Unmute Sound" : "Mute Sound",
    },
    {
      title: isDark ? "Editorial Paper Mode" : "Dark Terminal Mode",
      icon: (
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ scale: 0.6, rotate: -45, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.6, rotate: 45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Sun className="w-4 h-4 text-amber-500" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ scale: 0.6, rotate: 45, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.6, rotate: -45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Moon className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      ),
      onClick: toggleTheme,
      ariaLabel: "Toggle Theme",
    },
  ];

  return (
    <>
      <motion.header
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: navVisible ? 0 : -95,
          opacity: navVisible ? 1 : 0,
        }}
        transition={{
          duration: 0.4,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="fixed top-3 sm:top-4 inset-x-0 z-50 max-w-7xl mx-auto px-3 sm:px-4 pointer-events-none"
      >
        <div className={`flex items-center justify-between gap-2 sm:gap-4 p-1.5 sm:p-2 rounded-2xl bg-paper/90 border border-line/80 backdrop-blur-xl shadow-lg transition-all duration-200 ${
          navVisible ? "pointer-events-auto" : "pointer-events-none"
        }`}>
          {/* ================= ZONE 1: BRAND WORDMARK & LIVE STATUS ================= */}
          <div className="flex items-center gap-2.5 shrink-0 pl-1.5 sm:pl-2">
            <a
              href="#"
              onClick={() => sound.playClick(900)}
              className="group flex items-center gap-2 text-ink hover:text-accent transition-colors"
            >
              <span className="w-7 h-7 rounded-lg bg-paper-2 border border-line flex items-center justify-center font-mono text-xs font-bold text-accent shadow-2xs group-hover:border-accent transition-colors">
                M
              </span>
              <span className="font-mono text-xs sm:text-sm font-semibold tracking-tight hidden xs:inline">
                {siteData.personal.wordmark}
              </span>
            </a>

            {/* Live Availability Radar Dot */}
            <div className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 border border-line/70 rounded-full bg-paper-2/80 text-[10.5px] font-mono text-ink-soft shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span>Available</span>
            </div>
          </div>

          {/* ================= ZONE 2: INTERACTIVE NAVBAR MENU (DROPDOWNS) ================= */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <Menu setActive={setActiveMenu}>
              {/* Menu Item 1: Case Studies */}
              <MenuItem
                setActive={setActiveMenu}
                active={activeMenu}
                item="Case Studies"
                href="#work"
              >
                <div className="p-4 w-[540px]">
                  <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-line text-xs font-mono">
                    <span className="font-semibold text-ink flex items-center gap-1.5">
                      <Workflow className="w-3.5 h-3.5 text-accent" />
                      Production AI Case Studies
                    </span>
                    <a
                      href="#work"
                      onClick={() => {
                        sound.playClick(750);
                        setActiveMenu(null);
                      }}
                      className="text-accent hover:underline text-[11px] flex items-center gap-1"
                    >
                      View All 4 Systems <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <ProductItem
                      title="Healthcare Claims Audit"
                      badge="System 01"
                      metric="91% Precision"
                      tag="LangGraph"
                      href="#work"
                      icon={<Workflow className="w-5 h-5" />}
                      description="Deterministic CPT/ICD overlap pre-matching with Gemini 3.8 Flash reasoner & 0.72 confidence gate."
                    />
                    <ProductItem
                      title="Deep Research Engine"
                      badge="System 02"
                      metric="100% Ground Truth"
                      tag="MCP Protocol"
                      href="#work"
                      icon={<Cpu className="w-5 h-5" />}
                      description="Stateful LangGraph DAG integrated with Model Context Protocol client-server tools and cyclic reflection critic."
                    />
                    <ProductItem
                      title="Clinical SOAP Notes"
                      badge="System 03"
                      metric="0% PHI Leakage"
                      tag="WhisperX + Gemma 4"
                      href="#work"
                      icon={<FlaskConical className="w-5 h-5" />}
                      description="Phoneme-aligned speaker diarization and structured clinical documentation validated by Qwen 3.5."
                    />
                    <ProductItem
                      title="Production RAG CI/CD"
                      badge="System 04"
                      metric="-40% Tokens"
                      tag="ChromaDB + RAGAS"
                      href="#work"
                      icon={<ShieldCheck className="w-5 h-5" />}
                      description="Automated regression gate evaluating Faithfulness and Answer Relevance on every production deployment."
                    />
                  </div>
                </div>
              </MenuItem>

              {/* Menu Item 2: The Lab */}
              <MenuItem
                setActive={setActiveMenu}
                active={activeMenu}
                item="The Lab"
                href="#lab"
              >
                <div className="p-4 w-[380px] space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-line text-xs font-mono">
                    <span className="font-semibold text-ink flex items-center gap-1.5">
                      <FlaskConical className="w-3.5 h-3.5 text-accent" />
                      Interactive AI Lab
                    </span>
                    <span className="text-[10px] text-accent font-semibold px-1.5 py-0.2 bg-accent-soft rounded">
                      Live Demos
                    </span>
                  </div>

                  <div className="space-y-1">
                    <HoveredLink href="#lab" badge="Interactive">
                      Multi-Agent Latency Profiler
                    </HoveredLink>
                    <HoveredLink href="#lab" badge="Evaluation">
                      Deterministic Overlap Rule Tester
                    </HoveredLink>
                    <HoveredLink href="#lab" badge="Clinical">
                      Acoustic Diarization &amp; SOAP Synthesizer
                    </HoveredLink>
                    <HoveredLink href="#lab" badge="Observability">
                      RAGAS Faithfulness &amp; Relevance Gate
                    </HoveredLink>
                  </div>
                </div>
              </MenuItem>

              {/* Menu Item 3: Research */}
              <MenuItem
                setActive={setActiveMenu}
                active={activeMenu}
                item="Research"
                href="#research"
              >
                <div className="p-4 w-[380px] space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-line text-xs font-mono">
                    <span className="font-semibold text-ink flex items-center gap-1.5">
                      <FileCode2 className="w-3.5 h-3.5 text-accent" />
                      Applied AI Publications
                    </span>
                    <span className="text-[10px] text-ink-soft">Peer-Reviewed</span>
                  </div>

                  <div className="space-y-1">
                    <HoveredLink href="#research" badge="Clinical NLP">
                      Diagnostic Reasoning in LLMs
                    </HoveredLink>
                    <HoveredLink href="#research" badge="Affective AI">
                      Gaze Tracking &amp; Cognitive Workload
                    </HoveredLink>
                    <HoveredLink href="#research" badge="RAG Benchmark">
                      Empirical RAG Parameter Frontiers
                    </HoveredLink>
                  </div>
                </div>
              </MenuItem>

              {/* Menu Item 4: Experience */}
              <MenuItem
                setActive={setActiveMenu}
                active={activeMenu}
                item="Experience"
                href="#experience"
              >
                <div className="p-4 w-[380px] space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-line text-xs font-mono">
                    <span className="font-semibold text-ink flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-accent" />
                      Background &amp; Credentials
                    </span>
                    <span className="text-[10px] text-accent font-semibold">IIT Madras '25</span>
                  </div>

                  <div className="space-y-1">
                    <HoveredLink href="#experience" badge="Industry">
                      Jan Elaaj · Key AI Contributor
                    </HoveredLink>
                    <HoveredLink href="#education" badge="Academics">
                      IIT Madras · B.S. Data Science
                    </HoveredLink>
                    <HoveredLink href="#skills" badge="Technical">
                      Systems Depth &amp; Invariant Architecture
                    </HoveredLink>
                  </div>
                </div>
              </MenuItem>
            </Menu>
          </div>

          {/* Hairline Separator */}
          <div className="hidden md:block w-px h-5 bg-line/80 shrink-0" />

          {/* ================= ZONE 3: ANIMATED DOCK WITH MAGNIFICATION PHYSICS ================= */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Desktop Animated Dock */}
            <div className="hidden sm:flex items-center">
              <AnimatedDock items={dockItems} />
            </div>

            {/* Quick Contact CTA */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                sound.playClick(800);
                const el = document.querySelector("#contact");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="h-8 px-3 text-xs font-mono shrink-0 hidden md:inline-flex"
            >
              Contact
            </Button>

            {/* Mobile Actions: Theme + Copilot + Hamburger */}
            <div className="sm:hidden flex items-center gap-1">
              <button
                type="button"
                onClick={handleOpenCopilot}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-paper-2 border border-accent/40 text-accent"
                aria-label="Open AI Copilot"
              >
                <Bot className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-paper-2 border border-line text-ink-soft cursor-pointer active:scale-95 transition-transform"
                aria-label="Toggle Theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isDark ? (
                    <motion.div
                      key="sun-mobile"
                      initial={{ scale: 0.6, rotate: -45, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0.6, rotate: 45, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Sun className="w-4 h-4 text-amber-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon-mobile"
                      initial={{ scale: 0.6, rotate: 45, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0.6, rotate: -45, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Moon className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick(750);
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-paper-2 border border-line text-ink"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* ================= MOBILE SLIDE-DOWN DRAWER ================= */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="pointer-events-auto mt-2 p-4 rounded-2xl border border-line bg-paper/95 backdrop-blur-xl shadow-2xl space-y-3 lg:hidden"
            >
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <a
                  href="#work"
                  onClick={() => {
                    sound.playClick(750);
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-paper-2 border border-line/60 text-ink flex items-center justify-between"
                >
                  <span>Case Studies</span>
                  <span className="text-[10px] text-accent font-semibold">4 Systems</span>
                </a>
                <a
                  href="#lab"
                  onClick={() => {
                    sound.playClick(750);
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-paper-2 border border-line/60 text-ink flex items-center justify-between"
                >
                  <span>The Lab</span>
                  <span className="text-[10px] text-accent font-semibold">Demos</span>
                </a>
                <a
                  href="#research"
                  onClick={() => {
                    sound.playClick(750);
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-paper-2 border border-line/60 text-ink flex items-center justify-between"
                >
                  <span>Research</span>
                  <span className="text-[10px] text-ink-soft">Papers</span>
                </a>
                <a
                  href="#experience"
                  onClick={() => {
                    sound.playClick(750);
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-paper-2 border border-line/60 text-ink flex items-center justify-between"
                >
                  <span>Experience</span>
                  <span className="text-[10px] text-ink-soft">Career</span>
                </a>
              </div>

              {/* Mobile Quick Action Buttons */}
              <div className="pt-2 border-t border-line/70 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setPaletteOpen(true);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-paper-2 border border-line text-xs font-mono text-ink-soft flex items-center justify-center gap-1.5"
                >
                  <Command className="w-3.5 h-3.5 text-accent" />
                  <span>Search</span>
                </button>

                <a
                  href="#contact"
                  onClick={() => {
                    sound.playClick(750);
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-accent text-white text-xs font-mono font-semibold flex items-center justify-center gap-1"
                >
                  <span>Contact</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Global Command Palette */}
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}

export default Nav;
