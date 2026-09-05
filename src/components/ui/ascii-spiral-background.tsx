"use client";

import React, { useEffect, useRef } from "react";

const HEX_CHARS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

/**
 * Procedural Hexdump ASCII Spiral Background
 *
 * Implements an interactive mathematical domain-warped ASCII spiral
 * rendered with Canvas2D. Reliably renders across all device DPIs,
 * dark and light modes, with tranquil emerald & ink aesthetics.
 */
export function AsciiSpiralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const configureCanvas = () => {
      if (!canvas || !ctx) return;
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    configureCanvas();
    window.addEventListener("resize", configureCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let startTime = performance.now();

    const render = (now: number) => {
      animId = requestAnimationFrame(render);

      // Smooth mouse lerp
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const elapsed = (now - startTime) * 0.001;
      // Meditative, fluid orbital speed
      const speed = 0.07;
      const time = elapsed * speed * 2.0;

      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains("dark");
      // Balanced cell size: 16px provides breathing room, crisp glyphs, and distinct spiral arms
      const cellSize = width < 640 ? 18 : 16;
      const cols = Math.ceil(width / cellSize);
      const rows = Math.ceil(height / cellSize);

      const cx = width / 2;
      const cy = height / 2;
      const minDim = Math.min(width, height);

      // Interactive mouse swirl
      const cursorStrength = 0.35;
      const cursorRadius = 0.42 * minDim;
      const mx = mouse.x;
      const my = mouse.y;
      const mouseActive = mx > -500;

      ctx.font = "600 10px var(--font-mono), 'IBM Plex Mono', 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const warpAmount = 0.24;
      const paramA = 4.2;

      for (let c = 0; c < cols; c++) {
        const x = c * cellSize + cellSize * 0.5;
        for (let r = 0; r < rows; r++) {
          const y = r * cellSize + cellSize * 0.5;

          let dx = (x - cx) / minDim;
          let dy = (y - cy) / minDim;

          if (mouseActive) {
            const distM = Math.hypot(x - mx, y - my);
            if (distM < cursorRadius) {
              const swirl = Math.pow(1 - distM / cursorRadius, 2) * cursorStrength * Math.PI * 1.5;
              const relX = (x - mx) / minDim;
              const relY = (y - my) / minDim;
              const cosS = Math.cos(swirl);
              const sinS = Math.sin(swirl);
              dx = (mx - cx) / minDim + (relX * cosS - relY * sinS);
              dy = (my - cy) / minDim + (relX * sinS + relY * cosS);
            }
          }

          const radius = Math.hypot(dx, dy) * 1.9;
          const angle = Math.atan2(dy, dx);

          // Domain warp
          const warpVal =
            Math.sin(angle * 3 + time * 1.4) * warpAmount * 0.35 +
            Math.cos(radius * 5 - time) * warpAmount * 0.25;

          // Procedural spiral & harmonic rings
          const spiralPhase = radius * paramA - angle * 2.5 - time * 1.6 + warpVal;
          const ring1 = Math.sin(spiralPhase);
          const ring2 = Math.cos(radius * (paramA * 0.55) + angle * 1.8 + time * 1.1);
          let intensity = 0.5 + 0.5 * (ring1 * 0.72 + ring2 * 0.28);

          // Fine procedural grain
          const grain = (Math.sin(c * 127.1 + r * 311.7 + time * 15) * 0.5) * 0.06;
          intensity = Math.max(0, Math.min(1, intensity + grain));

          // Select Hex Glyph (0-9, A-F)
          const hexIndex = Math.min(15, Math.max(0, Math.floor(intensity * 16)));
          const char = HEX_CHARS[hexIndex];

          // Calibrated theme colors matching Munawwar's emerald & ink tokens
          if (isDark) {
            // Dark Terminal Mode
            if (intensity > 0.62) {
              // Spiral crests: Bright vivid emerald (#1DB89F)
              ctx.fillStyle = `rgba(29, 184, 159, ${(0.65 + intensity * 0.25).toFixed(2)})`;
            } else if (intensity > 0.32) {
              // Spiral body: Deep emerald teal (#0F6B5C)
              ctx.fillStyle = `rgba(15, 107, 92, ${(0.38 + intensity * 0.22).toFixed(2)})`;
            } else {
              // Troughs: Ambient slate matrix grid (#5B5D63)
              ctx.fillStyle = `rgba(91, 93, 99, 0.16)`;
            }
          } else {
            // Day / Paper Mode
            if (intensity > 0.62) {
              // Spiral crests: Deep emerald (#0F6B5C)
              ctx.fillStyle = `rgba(15, 107, 92, ${(0.65 + intensity * 0.25).toFixed(2)})`;
            } else if (intensity > 0.32) {
              // Spiral body: Crisp architectural ink (#15161B)
              ctx.fillStyle = `rgba(21, 22, 27, ${(0.38 + intensity * 0.22).toFixed(2)})`;
            } else {
              // Troughs: Ambient graphite (#78716C)
              ctx.fillStyle = `rgba(120, 113, 108, 0.14)`;
            }
          }

          ctx.fillText(char, x, y);
        }
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", configureCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}

export default AsciiSpiralBackground;
