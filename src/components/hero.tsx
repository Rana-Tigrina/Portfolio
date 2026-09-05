"use client";

import React from "react";
import { siteData } from "@/content/site";
import { TracePanel } from "./trace-panel";
import { ParticleButton } from "./ui/particle-button";
import { BackgroundPaths } from "./ui/background-paths";
import { AlbersLoom } from "./ui/albers-loom";
import { ContainerScroll } from "./ui/container-scroll";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDownRight, Sparkles, Terminal, FileCode2 } from "lucide-react";

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
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-28 border-b border-line overflow-hidden">
      {/* 8. Anni Albers Loom Weaving Canvas */}
      <AlbersLoom />

      {/* 16. Girih 5-Fold Sacred Geometry Watermark */}
      <svg
        className="girih-watermark top-0 right-0 w-96 h-96 sm:w-[480px] sm:h-[480px] text-amber-500"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        aria-hidden="true"
      >
        <polygon points="100,10 126,62 184,71 142,112 152,170 100,143 48,170 58,112 16,71 74,62" />
        <circle cx="100" cy="100" r="80" />
        <circle cx="100" cy="100" r="50" />
        <line x1="20" y1="20" x2="180" y2="180" />
        <line x1="180" y1="20" x2="20" y2="180" />
      </svg>

      {/* Living background paths (Kokonut UI) */}
      <BackgroundPaths className="opacity-50 dark:opacity-30" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          className="space-y-8"
        >
          {/* Eyebrow, Accession Number & Live Status */}
          <motion.div variants={riseVariants} className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-[10px] tracking-widest uppercase text-accent font-semibold px-2 py-0.5 border border-accent/40 bg-accent-soft rounded-token shadow-xs">
              ACCESSION NO. IITM-2025-01 · GALLERY OF FIRST PRINCIPLES
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wider uppercase text-neutral-300 font-medium px-2.5 py-0.5 border border-line bg-paper-2/80 rounded-token">
              <Sparkles className="w-3 h-3 text-accent animate-pulse" />
              {siteData.hero.eyebrow}
            </span>
            <span className="inline-flex items-center gap-2 text-[11px] font-mono text-ink-soft bg-paper-2/80 px-2.5 py-0.5 rounded-token border border-line">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              IIT Madras (B.S. Data Science) · 2 Published Papers
            </span>
          </motion.div>

          {/* Headline with Sumi-e Ink Filter */}
          <motion.h1
            variants={riseVariants}
            className="font-serif italic font-normal text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-[1.14] text-ink tracking-tight max-w-4xl sumi-e-title"
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

          {/* Action CTAs with tactile particle feedback */}
          <motion.div
            variants={riseVariants}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            <ParticleButton
              variant="primary"
              size="default"
              onClick={() => {
                const el = document.querySelector(siteData.hero.ctaPrimary.href);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>{siteData.hero.ctaPrimary.label}</span>
              <ArrowDownRight className="w-4 h-4" />
            </ParticleButton>

            <ParticleButton
              variant="outline"
              size="default"
              onClick={() => {
                const el = document.querySelector(siteData.hero.ctaSecondary.href);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <FileCode2 className="w-4 h-4 text-ink-soft" />
              <span>{siteData.hero.ctaSecondary.label}</span>
            </ParticleButton>

            <ParticleButton
              variant="ghost"
              size="default"
              onClick={() => {
                const el = document.querySelector(siteData.hero.ctaLab.href);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="font-mono text-xs text-accent hover:text-accent/90"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{siteData.hero.ctaLab.label}</span>
            </ParticleButton>
          </motion.div>

          {/* Hero Signature Element: Wrapped in Aceternity UI 3D Container Scroll */}
          <motion.div variants={riseVariants} className="pt-4">
            <ContainerScroll>
              <TracePanel />
            </ContainerScroll>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
