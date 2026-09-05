"use client";

import React from "react";

/**
 * AmbientHorizonGlow
 *
 * Provides a GPU-composited, buttery smooth ambient horizon glow that harmonizes
 * Day mode (warm editorial sunset/dawn aurora) and Dark mode (deep cosmic violet aurora)
 * behind the procedural ASCII spiral.
 *
 * Transitions use pure CSS opacity for 120 FPS performance with 0 layout shift.
 */
export function AmbientHorizonGlow() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
    >
      {/* Day Mode: Subtle Editorial Sunset / Dawn Horizon Radial Gradient */}
      <div
        className="absolute inset-0 opacity-20 dark:opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[opacity]"
        style={{
          backgroundImage:
            "radial-gradient(125% 125% at 50% 101%, rgba(245,87,2,0.7) 10.5%, rgba(245,120,2,0.6) 16%, rgba(245,140,2,0.5) 17.5%, rgba(245,170,100,0.4) 25%, rgba(238,174,202,0.25) 40%, rgba(202,179,214,0.15) 65%, rgba(148,201,233,0.08) 100%)",
        }}
      />

      {/* Dark Mode: Soft Deep Cosmic Aurora Horizon Radial Gradient */}
      <div
        className="absolute inset-0 opacity-0 dark:opacity-25 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[opacity]"
        style={{
          backgroundImage:
            "radial-gradient(125% 125% at 50% 101%, rgba(15,107,92,0.4) 10.5%, rgba(10,51,42,0.35) 20%, rgba(14,16,21,0.6) 45%, rgba(14,16,21,0.95) 85%, rgba(14,16,21,1) 100%)",
        }}
      />
    </div>
  );
}

export default AmbientHorizonGlow;
