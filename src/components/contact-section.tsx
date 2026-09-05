"use client";

import React, { useState } from "react";
import { siteData } from "@/content/site";
import { sound } from "@/lib/sound";
import { Github, Linkedin } from "./icons";
import {
  Mail,
  Copy,
  Check,
  MapPin,
  Send,
  Sparkles,
} from "lucide-react";

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleCopyEmail = () => {
    sound.playSuccess();
    navigator.clipboard.writeText(siteData.personal.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();
    const mailtoUrl = `mailto:${siteData.personal.email}?subject=${encodeURIComponent(
      subject || "Conversation via Portfolio"
    )}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <section id="contact" className="py-16 md:py-24 border-b border-line bg-paper-2/40 relative overflow-hidden">
      {/* 20. Voyager Golden Record Engraved Pulsar Map */}
      <svg
        className="absolute top-4 right-4 w-72 h-72 text-accent/15 pointer-events-none"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden="true"
      >
        <circle cx="100" cy="100" r="90" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="60" />
        <circle cx="100" cy="100" r="30" />
        <line x1="100" y1="10" x2="100" y2="190" />
        <line x1="10" y1="100" x2="190" y2="100" />
        <line x1="36" y1="36" x2="164" y2="164" />
        <line x1="164" y1="36" x2="36" y2="164" />
      </svg>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10 relative z-10">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-accent font-semibold tracking-wider uppercase">
              PLAQUE NO. 1977-VOYAGER · TRANSMISSION CONSOLE
            </span>
            <span className="text-xs font-mono text-ink-soft">/ 28.6139° N, 77.2090° E [DELHI]</span>
          </div>
          <h2 className="font-serif italic text-3xl sm:text-4xl text-ink">
            Commission a New Monument
          </h2>
          <p className="font-sans text-sm sm:text-base text-ink-soft max-w-2xl">
            Currently receptive to appointments for <strong>Senior AI/ML Engineer</strong> and <strong>Founding Systems Engineer</strong> roles. Whether you are building mission-critical agentic architectures or regulated clinical intelligence, let us build something that endures.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Direct Info & Quick Copy */}
          <div className="p-6 bg-paper border border-line rounded-token space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-xs text-ink-soft uppercase tracking-wider">
                Direct Inquiries
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${siteData.personal.email}`}
                  onClick={() => sound.playClick(850)}
                  className="font-mono text-base sm:text-lg text-ink font-semibold hover:text-accent transition-colors"
                >
                  {siteData.personal.email}
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="p-1.5 border border-line rounded-token hover:bg-paper-2 text-ink-soft hover:text-ink transition-colors cursor-pointer"
                  title="Copy email to clipboard"
                  aria-label="Copy email"
                >
                  {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {copied && (
                <div className="font-mono text-xs text-accent animate-fade-in">
                  Email copied to clipboard!
                </div>
              )}
            </div>

            {/* Social & Code Repositories */}
            <div className="space-y-3 pt-2">
              <span className="font-mono text-xs text-ink-soft uppercase tracking-wider block">
                Connect &amp; Review Code
              </span>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={siteData.personal.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sound.playClick(850)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-paper-2 border border-line rounded-token text-xs font-mono text-ink hover:border-accent transition-colors group"
                >
                  <Github className="w-4 h-4 text-ink-soft group-hover:text-accent transition-colors" />
                  <span>github.com/Rana-Tigrina</span>
                </a>

                <a
                  href={siteData.personal.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sound.playClick(850)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-paper-2 border border-line rounded-token text-xs font-mono text-ink hover:border-accent transition-colors group"
                >
                  <Linkedin className="w-4 h-4 text-ink-soft group-hover:text-accent transition-colors" />
                  <span>linkedin.com/in/munawwar-malook</span>
                </a>
              </div>
            </div>

            {/* Location & Response Time */}
            <div className="pt-3 border-t border-line/60 flex items-center justify-between text-xs font-mono text-ink-soft">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                {siteData.personal.location}
              </span>
              <span>Response Time: &lt; 24 hours</span>
            </div>
          </div>

          {/* Right Column: Quick Email Dispatcher */}
          <form
            onSubmit={handleSendMessage}
            className="p-6 bg-paper border border-line rounded-token space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <span className="font-mono text-xs font-semibold uppercase text-ink">
                Quick Message Composer
              </span>
              <span className="font-mono text-[11px] text-accent flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Opens Default Mail Client
              </span>
            </div>

            <div className="space-y-1">
              <label htmlFor="subject-input" className="block font-mono text-xs text-ink-soft">
                Subject
              </label>
              <input
                id="subject-input"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. AI Engineering Opportunity / Multi-Agent Collaboration"
                className="w-full px-3 py-2 bg-paper-2 border border-line rounded-token text-xs font-sans text-ink placeholder:text-ink-soft/70 focus:outline-none focus:border-accent"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="message-input" className="block font-mono text-xs text-ink-soft">
                Message Outline
              </label>
              <textarea
                id="message-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share a brief overview of your team, challenges, or problem statement..."
                rows={4}
                className="w-full px-3 py-2 bg-paper-2 border border-line rounded-token text-xs font-sans text-ink placeholder:text-ink-soft/70 focus:outline-none focus:border-accent resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-ink text-paper text-xs font-mono font-medium rounded-token hover:opacity-90 active:scale-98 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Compose Email via Client</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
