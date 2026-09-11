"use client";

import React, { useEffect, useState } from "react";
import { sound } from "@/lib/sound";
import {
  Search,
  FolderGit2,
  FlaskConical,
  BookOpen,
  Briefcase,
  GraduationCap,
  Mail,
  Copy,
  Check,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  ExternalLink,
  Terminal,
  Bot,
  Sparkles,
  ShieldCheck,
  FileDown,
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onRunTrace?: () => void;
}

export function CommandPalette({ isOpen, onClose, onRunTrace }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    setIsMuted(sound.getIsMuted());
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        sound.playClick(900);
        if (isOpen) {
          onClose();
        } else {
          // Open
        }
      }
      if (e.key === "Escape" && isOpen) {
        sound.playClick(600);
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    sound.playSuccess();
    navigator.clipboard.writeText("munawwar9022@email.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleTheme = () => {
    sound.playClick(700);
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      setIsDark(true);
    }
  };

  const toggleAudio = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  const navigateTo = (hash: string) => {
    sound.playClick(850);
    onClose();
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const allItems = [
    {
      category: "Navigation",
      items: [
        { label: "Download Resume (Google Drive)", icon: FileDown, action: () => window.open("https://drive.google.com/file/d/1rQyxmXvSFy-8TIwRkot5Zx3l-izmFVR8/view?usp=drive_link", "_blank") },
        { label: "Engineering Experience", icon: Briefcase, action: () => navigateTo("#experience") },
        { label: "Selected Case Studies", icon: FolderGit2, action: () => navigateTo("#work") },
        { label: "Research & Publications", icon: BookOpen, action: () => navigateTo("#research") },
        { label: "Technical Depth Matrix", icon: Terminal, action: () => navigateTo("#skills") },
        { label: "Education & Credentials", icon: GraduationCap, action: () => navigateTo("#education") },
        { label: "Get in Touch / Contact", icon: Mail, action: () => navigateTo("#contact") },
      ],
    },
    {
      category: "AI & Interactive Simulation",
      items: [
        {
          label: "Ask Portfolio Architecture Copilot",
          icon: Bot,
          action: () => {
            sound.playClick(900);
            onClose();
            window.dispatchEvent(new CustomEvent("open-portfolio-chat"));
          },
        },
        {
          label: "Execute Live Pipeline Trace",
          icon: Terminal,
          action: () => {
            onClose();
            navigateTo("#trace");
            if (onRunTrace) onRunTrace();
          },
        },
      ],
    },
    {
      category: "Actions & Links",
      items: [
        {
          label: copied ? "Copied munawwar9022@email.com!" : "Copy Email to Clipboard",
          icon: copied ? Check : Copy,
          action: handleCopyEmail,
        },
        {
          label: isDark ? "Switch to Editorial Paper Theme" : "Switch to Dark Terminal Theme",
          icon: isDark ? Sun : Moon,
          action: toggleTheme,
        },
        {
          label: isMuted ? "Enable Tactile Audio Clicks" : "Mute Tactile Audio",
          icon: isMuted ? VolumeX : Volume2,
          action: toggleAudio,
        },
        {
          label: "GitHub — @Rana-Tigrina",
          icon: ExternalLink,
          action: () => {
            window.open("https://github.com/Rana-Tigrina", "_blank");
          },
        },
        {
          label: "LinkedIn — Mohammad Munawwar Malook",
          icon: ExternalLink,
          action: () => {
            window.open("https://www.linkedin.com/in/munawwar-malook/", "_blank");
          },
        },
      ],
    },
  ];

  const filteredCategories = allItems
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-ink/40 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-xl bg-paper border border-line rounded-token shadow-2xl overflow-hidden animate-scale-in"
        role="dialog"
        aria-modal="true"
      >
        {/* Search input header */}
        <div className="flex items-center px-4 py-3 border-b border-line gap-2">
          <Search className="w-4 h-4 text-ink-soft" aria-hidden="true" />
          <input
            type="text"
            placeholder="Type a command or jump to section..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-ink placeholder:text-ink-soft/70 text-sm font-sans focus:outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-block font-mono text-[10px] text-ink-soft bg-paper-2 border border-line px-1.5 py-0.5 rounded-token">
            ESC
          </kbd>
        </div>

        {/* List of actions */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-line/40">
          {filteredCategories.length === 0 ? (
            <div className="p-4 text-center text-xs font-mono text-ink-soft">
              No matching commands found.
            </div>
          ) : (
            filteredCategories.map((group) => (
              <div key={group.category} className="py-1">
                <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-ink-soft">
                  {group.category}
                </div>
                {group.items.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={item.action}
                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-sans text-ink hover:bg-paper-2 rounded-token text-left transition-colors cursor-pointer group"
                    >
                      <Icon className="w-4 h-4 text-ink-soft group-hover:text-accent transition-colors" />
                      <span className="flex-1">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-line bg-paper-2/50 flex items-center justify-between text-[11px] font-mono text-ink-soft">
          <span>Navigate with mouse or keyboard</span>
          <span>Mohammad Munawwar Malook</span>
        </div>
      </div>
    </div>
  );
}
