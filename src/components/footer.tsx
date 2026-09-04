"use client";

import React from "react";
import { siteData } from "@/content/site";
import { sound } from "@/lib/sound";
import { Github, Linkedin } from "./icons";
import { ArrowUp, Mail } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    sound.playClick(950);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-12 bg-paper border-t border-line text-xs font-mono text-ink-soft">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Colophon */}
        <div className="space-y-1 text-center md:text-left">
          <div className="text-ink font-semibold">
            {siteData.personal.name} · {siteData.personal.role}
          </div>
          <p className="text-[11px] text-ink-soft/80">
            Crafted with Next.js 15+, Tailwind CSS v4, Motion &amp; strict WCAG AA/AAA accessibility.
          </p>
        </div>

        {/* Center Links */}
        <div className="flex items-center gap-4">
          <a
            href={siteData.personal.github}
            target="_blank"
            rel="noreferrer"
            onClick={() => sound.playClick(750)}
            className="hover:text-ink transition-colors flex items-center gap-1"
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
            className="hover:text-ink transition-colors flex items-center gap-1"
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span>LinkedIn</span>
          </a>
          <span>·</span>
          <a
            href={`mailto:${siteData.personal.email}`}
            onClick={() => sound.playClick(750)}
            className="hover:text-ink transition-colors flex items-center gap-1"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </a>
        </div>

        {/* Right Scroll to top */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-line rounded-token bg-paper-2 hover:border-ink-soft text-ink transition-colors cursor-pointer"
        >
          <span>Back to top</span>
          <ArrowUp className="w-3.5 h-3.5 text-accent" />
        </button>
      </div>
    </footer>
  );
}
