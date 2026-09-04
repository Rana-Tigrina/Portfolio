"use client";

import React from "react";
import { siteData } from "@/content/site";
import { GraduationCap, Award } from "lucide-react";

export function EducationSection() {
  return (
    <section id="education" className="py-16 md:py-24 border-b border-line bg-paper">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-accent font-semibold tracking-wider uppercase">
              Academic Background
            </span>
            <span className="text-xs font-mono text-ink-soft">/ IIT Madras Foundation</span>
          </div>
          <h2 className="font-serif italic text-3xl sm:text-4xl text-ink">
            Education &amp; Credentials
          </h2>
          <p className="font-sans text-sm sm:text-base text-ink-soft max-w-2xl">
            Rigorous mathematical, statistical, and computer science foundations from India&apos;s premier technological institution.
          </p>
        </div>

        {/* Education Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {siteData.education.map((item) => (
            <div
              key={item.institution}
              className="p-6 bg-paper border border-line rounded-token space-y-3 hover:border-ink-soft/60 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-accent">
                  <GraduationCap className="w-5 h-5" />
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider">
                    {item.period}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold px-2 py-0.5 border border-accent/30 bg-accent-soft text-accent rounded-token">
                  <Award className="w-3 h-3" />
                  {item.grade}
                </span>
              </div>

              <h3 className="font-serif italic text-2xl text-ink">
                {item.institution}
              </h3>

              <div className="font-mono text-sm text-ink font-medium">
                {item.degree}
              </div>

              <p className="font-sans text-xs sm:text-sm text-ink-soft leading-relaxed pt-1">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
