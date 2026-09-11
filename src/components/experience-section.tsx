"use client";

import React from "react";
import { siteData } from "@/content/site";
import { sound } from "@/lib/sound";
import { Briefcase, MapPin, Calendar, CheckCircle2 } from "lucide-react";

export function ExperienceSection() {
  return (
    <section id="experience" className="py-16 md:py-24 border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-sans text-xs text-accent font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-accent/30 bg-accent-soft">
              Career Trajectory
            </span>
            <span className="text-xs font-sans text-ink-soft">/ Production Track Record</span>
          </div>
          <h2 className="font-serif italic text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight">
            Engineering Roles &amp; Systems Shipped
          </h2>
          <p className="font-sans text-sm sm:text-base text-ink-soft max-w-2xl leading-relaxed">
            Demonstrated ownership across early-stage and production environments—from fine-tuning domain transformers to orchestrating multi-agent architectures.
          </p>
        </div>

        {/* Experience Timeline */}
        <div className="space-y-6">
          {siteData.experience.map((item, idx) => (
            <div
              key={item.company}
              className="p-6 sm:p-8 bg-paper border border-line rounded-2xl hover:border-accent/40 transition-all space-y-5 shadow-2xs"
            >
              {/* Company & Role Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-line/60">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-serif italic text-2xl sm:text-3xl text-ink">
                      {item.company}
                    </h3>
                    <span className="font-sans text-xs text-accent border border-accent/20 bg-accent-soft px-2.5 py-0.5 rounded-full font-semibold">
                      {item.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 font-sans text-xs text-ink-soft pt-1.5">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-accent" />
                      {item.period}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-ink-soft" />
                      {item.location}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1 sm:pt-0">
                  {item.stack.map((tech) => (
                    <span
                      key={tech}
                      className="font-sans text-xs text-ink-soft bg-paper-2 border border-line px-2 py-0.5 rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bullet Points */}
              <ul className="space-y-2.5">
                {item.highlights.map((highlight, hIdx) => (
                  <li key={hIdx} className="flex items-start gap-2.5 font-sans text-sm text-ink leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
