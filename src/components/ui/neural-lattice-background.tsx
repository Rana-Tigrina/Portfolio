"use client";

import React, { useEffect, useRef } from "react";

/**
 * InteractiveNeuralLattice
 *
 * A sophisticated, high-performance architectural background component for
 * Mohammad Munawwar's AI & GenAI Systems Engineer portfolio.
 *
 * Replaces the overwhelming ASCII spiral with a clean, calm micro-dot matrix.
 * When the user glides their cursor, an interactive emerald radial spotlight
 * awakens nearby nodes and dynamically renders ultra-fine neural synapse connections,
 * visually evoking an active latent embedding space and GPU cluster without
 * any visual fatigue or reading distraction.
 */
export function NeuralLatticeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({
    x: -2000,
    y: -2000,
    targetX: -2000,
    targetY: -2000,
    active: false,
  });

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
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = -2000;
      mouseRef.current.targetY = -2000;
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    const spacing = 28; // Architectural spacing between grid nodes
    const cursorRadius = 175; // Proximity threshold for interactive neural connections
    const cursorRadiusSq = cursorRadius * cursorRadius;
    const startTime = performance.now();

    const render = (now: number) => {
      animId = requestAnimationFrame(render);

      // Smooth mouse lerp
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains("dark");
      const elapsed = (now - startTime) * 0.001;

      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      // Color Palette tokens
      const baseDotColor = isDark ? "rgba(148, 163, 184, 0.13)" : "rgba(100, 116, 139, 0.14)";
      const accentR = isDark ? 29 : 15;
      const accentG = isDark ? 184 : 107;
      const accentB = isDark ? 159 : 92;

      // Draw base dot matrix with sparse ambient compute pulses
      for (let c = 0; c < cols; c++) {
        const x = c * spacing;
        for (let r = 0; r < rows; r++) {
          const y = r * spacing;

          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const distSq = dx * dx + dy * dy;

          // Sparse, quiet compute flicker (0.6% of nodes pulse slowly)
          const isPulseNode = (c * 17 + r * 31) % 151 === 0;
          let pulseAlpha = 0;
          if (isPulseNode) {
            pulseAlpha = Math.sin(elapsed * 1.8 + c * 0.5 + r * 0.7) * 0.5 + 0.5;
          }

          if (distSq < cursorRadiusSq) {
            // Node is inside the cursor spotlight
            const proximity = 1 - Math.sqrt(distSq) / cursorRadius;
            const boostedAlpha = 0.25 + proximity * 0.75;
            const dotSize = 1.3 + proximity * 1.4;

            ctx.fillStyle = `rgba(${accentR}, ${accentG}, ${accentB}, ${boostedAlpha.toFixed(2)})`;
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            ctx.fill();

            // Draw neural synaptic connections to adjacent horizontal and vertical neighbors
            // only if they also reside within or close to the spotlight
            if (c + 1 < cols) {
              const nx = (c + 1) * spacing;
              const ndx = nx - mouse.x;
              const nDistSq = ndx * ndx + dy * dy;
              if (nDistSq < cursorRadiusSq) {
                const nProx = 1 - Math.sqrt(nDistSq) / cursorRadius;
                const lineAlpha = Math.min(proximity, nProx) * (isDark ? 0.38 : 0.45);
                ctx.strokeStyle = `rgba(${accentR}, ${accentG}, ${accentB}, ${lineAlpha.toFixed(2)})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(nx, y);
                ctx.stroke();
              }
            }

            if (r + 1 < rows) {
              const ny = (r + 1) * spacing;
              const ndy = ny - mouse.y;
              const nDistSq = dx * dx + ndy * ndy;
              if (nDistSq < cursorRadiusSq) {
                const nProx = 1 - Math.sqrt(nDistSq) / cursorRadius;
                const lineAlpha = Math.min(proximity, nProx) * (isDark ? 0.38 : 0.45);
                ctx.strokeStyle = `rgba(${accentR}, ${accentG}, ${accentB}, ${lineAlpha.toFixed(2)})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, ny);
                ctx.stroke();
              }
            }
          } else if (isPulseNode && pulseAlpha > 0.3) {
            // Calm ambient compute node
            const alpha = 0.15 + pulseAlpha * 0.35;
            ctx.fillStyle = `rgba(${accentR}, ${accentG}, ${accentB}, ${alpha.toFixed(2)})`;
            ctx.beginPath();
            ctx.arc(x, y, 1.2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Calm background grid dot
            ctx.fillStyle = baseDotColor;
            ctx.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
          }
        }
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", configureCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
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

export default NeuralLatticeBackground;
