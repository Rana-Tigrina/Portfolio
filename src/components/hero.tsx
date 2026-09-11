"use client";

import React from "react";
import { siteData } from "@/content/site";
import { ParticleButton } from "./ui/particle-button";
import { BackgroundPaths } from "./ui/background-paths";
import { motion, useReducedMotion } from "motion/react";
import {
  Sparkles,
  Briefcase,
  FileDown,
  ArrowDownRight,
  Mail,
  MapPin,
  CheckCircle2,
} from "lucide-react";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.09,
      },
    },
  };

  const riseVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
    },
  };

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 border-b border-line overflow-hidden">
      {/* Living background paths (Kokonut UI) */}
      <BackgroundPaths className="opacity-70 dark:opacity-50" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          className="space-y-8"
        >
          {/* Eyebrow & Live Status */}
          <motion.div variants={riseVariants} className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wider uppercase text-accent font-semibold px-2.5 py-1 border border-accent/40 bg-accent-soft rounded-token shadow-xs">
              <Sparkles className="w-3 h-3 animate-pulse" />
              {siteData.hero.eyebrow}
            </span>
            <span className="inline-flex items-center gap-2 text-[11px] font-mono text-ink-soft bg-paper-2/80 px-2.5 py-1 rounded-token border border-line">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              IIT Madras (B.S. Data Science) · 2 Published Papers
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={riseVariants}
            className="font-serif italic font-normal text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-[1.14] text-ink tracking-tight max-w-4xl"
          >
            {siteData.hero.headline}
          </motion.h1>

          {/* Subcopy connecting the 3 identities */}
          <motion.p
            variants={riseVariants}
            className="font-sans text-base sm:text-lg text-ink-soft max-w-2xl leading-relaxed"
          >
            {siteData.hero.subcopy}
          </motion.p>

          {/* Action CTAs: High-impact Resume & Fast Jump */}
          <motion.div
            variants={riseVariants}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            {/* Primary Resume CTA */}
            <a
              href="https://drive.google.com/file/d/1rQyxmXvSFy-8TIwRkot5Zx3l-izmFVR8/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <ParticleButton
                variant="primary"
                size="default"
                className="font-semibold shadow-md"
              >
                <FileDown className="w-4 h-4" />
                <span>Download Resume</span>
              </ParticleButton>
            </a>

            {/* Jump to Experience */}
            <ParticleButton
              variant="outline"
              size="default"
              onClick={() => {
                const el = document.querySelector("#experience");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Briefcase className="w-4 h-4 text-ink-soft" />
              <span>Work Experience</span>
            </ParticleButton>

            {/* Jump to Case Studies */}
            <ParticleButton
              variant="ghost"
              size="default"
              onClick={() => {
                const el = document.querySelector("#work");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="font-mono text-xs text-accent hover:text-accent/90"
            >
              <span>Selected Systems</span>
              <ArrowDownRight className="w-3.5 h-3.5" />
            </ParticleButton>
          </motion.div>

          {/* Quick Recruiter Summary Bar */}
          <motion.div
            variants={riseVariants}
            className="pt-4 border-t border-line/60 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-mono text-ink-soft"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Available for Full-Time Roles</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-ink-soft" />
              <span>Delhi, India · Remote / Relocation</span>
            </div>
            <a
              href="mailto:munawwar9022@email.com"
              className="flex items-center gap-1.5 hover:text-accent transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-accent" />
              <span>munawwar9022@email.com</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
