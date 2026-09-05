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
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Curated high-performance grid nodes (reduced density for 60fps)
    let nodes: NodePoint[] = [];
    let pulses: PulsePacket[] = [];

    const initNetwork = () => {
      nodes = [];
      pulses = [];

      const cols = Math.max(3, Math.min(6, Math.floor(width / 260)));
      const rows = Math.max(3, Math.min(5, Math.floor(height / 220)));

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = (i / cols) * width + (Math.random() - 0.5) * 30;
          const y = (j / rows) * height + (Math.random() - 0.5) * 30;
          const stage = Math.floor((j / rows) * 4);

          let label: string | undefined;
          if (i === 1 && j === 1) label = "SYS_INIT";
          if (i === cols - 1 && j === 1) label = "LATENCY_GTE";
          if (i === 2 && j === Math.floor(rows / 2)) label = "STATE_GRAPH";
          if (i === cols - 1 && j === rows - 1) label = "QWEN_VAL";

          nodes.push({
            x,
            y,
            baseX: x,
            baseY: y,
            vx: (Math.random() - 0.5) * 0.18,
            vy: (Math.random() - 0.5) * 0.18,
            radius: 1.8,
            stage,
            label,
          });
        }
      }
    };

    initNetwork();

    let lastTime = performance.now();
    let isHidden = false;

    const handleVisibility = () => {
      isHidden = document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const render = (now: number) => {
      animId = requestAnimationFrame(render);
      if (isHidden) return;

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      const progress = smoothProgress.get();
      const velocity = Math.min(Math.abs(scrollVelocity.get() || 0), 2);
      const currentStage = Math.min(Math.floor(progress * 4.2), 3);

      // Museum curated palette
      let r = 201, g = 162, b = 39; // gold
      if (currentStage === 1) { r = 0; g = 47; b = 167; } // Klein Blue
      else if (currentStage === 2) { r = 59; g = 168; b = 159; } // Verdigris
      else if (currentStage === 3) { r = 158; g = 56; b = 42; } // Oxblood

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const maxDistSq = 220 * 220;

      // 1. Single batched path for all lines
      ctx.lineWidth = 0.75;
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.1 + velocity * 0.08})`;
      ctx.beginPath();

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx;
        a.y += a.vy;
        if (Math.abs(a.x - a.baseX) > 15) a.vx *= -1;
        if (Math.abs(a.y - a.baseY) > 15) a.vy *= -1;

        const dx = mx - a.x;
        const dy = my - a.y;
        const dsq = dx * dx + dy * dy;
        if (dsq < 25000 && dsq > 0) {
          const dist = Math.sqrt(dsq);
          const force = (1 - dist / 160) * 4;
          a.x += (dx / dist) * force * 0.04;
          a.y += (dy / dist) * force * 0.04;
        }

        for (let j = i + 1; j < nodes.length; j++) {
          const bNode = nodes[j];
          const cdx = bNode.x - a.x;
          const cdy = bNode.y - a.y;
          const cdistSq = cdx * cdx + cdy * cdy;

          if (cdistSq < maxDistSq) {
            ctx.moveTo(a.x, a.y);
            if ((i + j) % 2 === 0) {
              const midX = (a.x + bNode.x) / 2;
              ctx.lineTo(midX, a.y);
              ctx.lineTo(midX, bNode.y);
            }
            ctx.lineTo(bNode.x, bNode.y);

            if (Math.random() < 0.0015 + velocity * 0.02 && pulses.length < 12) {
              pulses.push({
                startX: a.x,
                startY: a.y,
                endX: bNode.x,
                endY: bNode.y,
                progress: 0,
                speed: 0.9 + Math.random() * 1.0 + velocity * 2,
                color: `rgba(${r}, ${g}, ${b},`,
              });
            }
          }
        }
      }
      ctx.stroke();

      // 2. Draw nodes in batched fill
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.28)`;
      ctx.beginPath();
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        ctx.moveTo(a.x + a.radius, a.y);
        ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
      }
      ctx.fill();

      // 3. Node labels (only when close to current stage)
      ctx.font = "9px monospace";
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.65)`;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (a.label && a.stage === currentStage) {
          ctx.fillText(a.label, a.x + 8, a.y + 3);
        }
      }

      // 4. Update and draw traveling pulse packets without allocating gradients
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed * dt;

        if (pulse.progress >= 1) {
          pulses.splice(p, 1);
          continue;
        }

        const px = pulse.startX + (pulse.endX - pulse.startX) * pulse.progress;
        const py = pulse.startY + (pulse.endY - pulse.startY) * pulse.progress;

        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Watermark telemetry in corner
      ctx.font = "10px monospace";
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.35)`;
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
      document.removeEventListener("visibilitychange", handleVisibility);
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
