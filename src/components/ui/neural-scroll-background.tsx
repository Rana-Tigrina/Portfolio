"use client";

import React, { useEffect, useRef, useState } from "react";
import { useScroll, useSpring, useVelocity } from "motion/react";

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  radius: number;
  stage: number; // which scroll stage it activates in
  label?: string;
}

interface PulsePacket {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  progress: number;
  speed: number;
  color: string;
}

export function NeuralScrollBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const { scrollYProgress } = useScroll();
  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    // Disable on coarse pointer / mobile touch devices to free GPU fill-rate and prevent scroll lag
    if (
      typeof window === "undefined" ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth <= 768
    ) {
      return;
    }

    setMounted(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNetwork();
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Contextual Network Topology
    let nodes: NodePoint[] = [];
    let pulses: PulsePacket[] = [];

    const initNetwork = () => {
      nodes = [];
      pulses = [];

      // Grid-aligned neural nodes
      const cols = Math.floor(width / 160);
      const rows = Math.floor(height / 140);

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = (i / cols) * width + (Math.random() - 0.5) * 40;
          const y = (j / rows) * height + (Math.random() - 0.5) * 40;
          const stage = Math.floor((j / rows) * 4);

          let label: string | undefined;
          if (i === 1 && j === 1) label = "SYS_INIT";
          if (i === cols - 1 && j === 2) label = "LATENCY_GTE";
          if (i === 2 && j === Math.floor(rows / 2)) label = "STATE_GRAPH";
          if (i === cols - 2 && j === Math.floor(rows / 2)) label = "VECTOR_INDEX";
          if (i === 1 && j === rows - 1) label = "QWEN_VAL";

          nodes.push({
            x,
            y,
            baseX: x,
            baseY: y,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            radius: Math.random() * 1.8 + 1.2,
            stage,
            label,
          });
        }
      }
    };

    initNetwork();

    let lastTime = performance.now();

    const render = (now: number) => {
      animId = requestAnimationFrame(render);
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      const progress = smoothProgress.get();
      const velocity = Math.abs(scrollVelocity.get() || 0);

      // Determine active contextual stage:
      // 0: Hero, 1: Selected Work, 2: Interactive Lab, 3: Tech Depth / Research
      const currentStage = Math.min(Math.floor(progress * 4.2), 3);

      // Accent color palette based on active contextual stage
      let themeColor = "rgba(16, 185, 129, "; // emerald (Agentic default)
      if (currentStage === 1) themeColor = "rgba(6, 182, 212, "; // cyan (WhisperX / Audio)
      if (currentStage === 2) themeColor = "rgba(139, 92, 246, "; // violet (RAG / Vector)
      if (currentStage === 3) themeColor = "rgba(245, 158, 11, "; // amber (Benchmarks / Metrics)

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Update and draw connections (orthogonal & diagonal data buses)
      ctx.lineWidth = 0.8;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];

        // Slight drift
        a.x += a.vx;
        a.y += a.vy;
        if (Math.abs(a.x - a.baseX) > 20) a.vx *= -1;
        if (Math.abs(a.y - a.baseY) > 20) a.vy *= -1;

        // Mouse magnetic elasticity
        const dx = mx - a.x;
        const dy = my - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          const force = (1 - dist / 180) * 8;
          a.x += (dx / dist) * force * 0.05;
          a.y += (dy / dist) * force * 0.05;
        }

        // Draw connections to nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const cdx = b.x - a.x;
          const cdy = b.y - a.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (cdist < 190) {
            const alpha = (1 - cdist / 190) * 0.12 * (1 + velocity * 1.5);
            ctx.strokeStyle = `${themeColor}${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);

            // Orthogonal step routing for cybernetic circuit feel
            if ((i + j) % 2 === 0) {
              const midX = (a.x + b.x) / 2;
              ctx.lineTo(midX, a.y);
              ctx.lineTo(midX, b.y);
            }
            ctx.lineTo(b.x, b.y);
            ctx.stroke();

            // Randomly spawn pulses between connected nodes on scroll
            if (Math.random() < 0.003 + velocity * 0.04 && pulses.length < 35) {
              pulses.push({
                startX: a.x,
                startY: a.y,
                endX: b.x,
                endY: b.y,
                progress: 0,
                speed: 0.8 + Math.random() * 1.2 + velocity * 3,
                color: themeColor,
              });
            }
          }
        }

        // Draw nodes
        const isHighlight = a.stage === currentStage;
        const nodeAlpha = isHighlight ? 0.45 : 0.18;
        const nodeRadius = isHighlight ? a.radius * 1.3 : a.radius;

        ctx.fillStyle = `${themeColor}${nodeAlpha})`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, nodeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Node labels
        if (a.label && isHighlight) {
          ctx.font = "9px monospace";
          ctx.fillStyle = `${themeColor}0.65)`;
          ctx.fillText(a.label, a.x + 8, a.y + 3);
        }
      }

      // Update and draw traveling pulse packets
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed * dt;

        if (pulse.progress >= 1) {
          pulses.splice(p, 1);
          continue;
        }

        const px = pulse.startX + (pulse.endX - pulse.startX) * pulse.progress;
        const py = pulse.startY + (pulse.endY - pulse.startY) * pulse.progress;

        // Glowing head
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 6);
        grad.addColorStop(0, `${pulse.color}0.9)`);
        grad.addColorStop(1, `${pulse.color}0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Contextual telemetry watermark in corner
      ctx.font = "10px monospace";
      ctx.fillStyle = `${themeColor}0.35)`;
      const stageName = [
        "SYS: INITIALIZING ARCHITECTURE BUS",
        "SYS: ACTIVE MULTI-AGENT STATEGRAPH",
        "SYS: VECTOR EMBEDDING & COSINE TOPOLOGY",
        "SYS: PRODUCTION EVAL HARNESS BENCHMARKS",
      ][currentStage];

      ctx.fillText(
        `// ${stageName} · SCROLL: ${(progress * 100).toFixed(0)}%`,
        24,
        height - 24
      );
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [smoothProgress, scrollVelocity]);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-70 transition-opacity duration-700"
      />
      {/* Soft radial vignette to preserve 100% center text contrast */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--paper)_92%)] pointer-events-none" />
    </div>
  );
}
