"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { sound } from "@/lib/sound";
import { Play, RotateCcw, Activity, Eye } from "lucide-react";

interface Fixation {
  x: number;
  y: number;
  r: number;
  duration: number;
}

export function GazeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fixations, setFixations] = useState<Fixation[]>([]);
  const [pupilDiam, setPupilDiam] = useState("3.82");
  const [velocity, setVelocity] = useState("0.0");
  const [cognitiveState, setCognitiveState] = useState("Equilibrium");

  const lastPosRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const drawCanvas = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, items: Fixation[]) => {
      ctx.clearRect(0, 0, width, height);

      // Subtle Dürer grid lines (Batched single path)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 36) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += 36) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Connecting saccadic paths
      if (items.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(58, 169, 159, 0.5)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.moveTo(items[0].x, items[0].y);
        for (let i = 1; i < items.length; i++) {
          ctx.lineTo(items[i].x, items[i].y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Fixation centroids (Botticelli organic bloom)
      items.forEach((f, idx) => {
        const isLatest = idx === items.length - 1;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = isLatest ? "rgba(212, 175, 55, 0.3)" : "rgba(58, 169, 159, 0.2)";
        ctx.fill();
        ctx.strokeStyle = isLatest ? "#d4af37" : "#3aa99f";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Centroid dot
        ctx.beginPath();
        ctx.arc(f.x, f.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      });
    },
    []
  );

  const addPoint = useCallback(
    (x: number, y: number, duration: number = 220) => {
      const now = Date.now();
      let vel = 0;
      if (lastPosRef.current) {
        const dt = Math.max(1, now - lastPosRef.current.time);
        const dist = Math.hypot(x - lastPosRef.current.x, y - lastPosRef.current.y);
        vel = Math.round((dist / dt) * 100);
      }
      lastPosRef.current = { x, y, time: now };

      const computedPupil = (3.4 + Math.min(2.2, duration / 140)).toFixed(2);
      const newFixation: Fixation = {
        x,
        y,
        r: Math.min(18, 4 + duration / 30),
        duration,
      };

      setFixations((prev) => {
        const next = [...prev, newFixation];
        if (next.length > 24) next.shift();
        return next;
      });

      setPupilDiam(computedPupil);
      setVelocity(vel.toString());
      setCognitiveState(
        vel > 350
          ? "Saccadic Search"
          : duration > 300
          ? "Deep Analytical Processing"
          : "Steady Inspection"
      );
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    const height = (canvas.height = 240);
    drawCanvas(ctx, width, height, fixations);
  }, [fixations, drawCanvas]);

  const lastMoveTimeRef = useRef(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const now = Date.now();
    if (now - lastMoveTimeRef.current < 50) return;
    lastMoveTimeRef.current = now;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    addPoint(x, y, 260);
  };

  const handleReset = () => {
    setFixations([]);
    setVelocity("0.0");
    setPupilDiam("3.82");
    setCognitiveState("Equilibrium");
    sound.playClick(400);
  };

  const handleSimulate = () => {
    handleReset();
    sound.playClick(850);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;

    const samplePts = [
      { x: w * 0.18, y: h * 0.35, d: 240 },
      { x: w * 0.32, y: h * 0.3, d: 190 },
      { x: w * 0.48, y: h * 0.65, d: 380 },
      { x: w * 0.62, y: h * 0.42, d: 420 },
      { x: w * 0.78, y: h * 0.55, d: 310 },
      { x: w * 0.86, y: h * 0.25, d: 260 },
    ];

    samplePts.forEach((pt, i) => {
      setTimeout(() => {
        addPoint(pt.x, pt.y, pt.d);
        sound.playHover();
      }, i * 360);
    });
  };

  return (
    <div className="w-full border border-line rounded-lg bg-paper-2 p-6 md:p-8 space-y-6 my-10 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-accent font-semibold block">
            EMPIRICAL STUDY 02 // INTERACTIVE RECONSTRUCTION
          </span>
          <h4 className="font-serif italic text-2xl text-ink">
            Live Saccadic Fixation &amp; Pupillometry Telemetry Canvas
          </h4>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulate}
            className="px-3 py-1.5 rounded-token border border-line bg-paper text-xs font-mono text-ink hover:border-accent hover:text-accent transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-accent" />
            <span>Playback Cognitive Trace</span>
          </button>
          <button
            onClick={handleReset}
            className="px-2.5 py-1.5 rounded-token border border-line bg-paper text-xs font-mono text-ink-soft hover:text-ink transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <p className="font-sans text-xs text-ink-soft max-w-3xl leading-relaxed">
        Glide your cursor over the field below to simulate eye-gaze trajectories captured during
        software engineer interaction with autonomous GenAI code assistants (Malook, 2025). Fixation
        centroids bloom proportional to dwell duration; connecting saccades map cognitive model
        reconstruction.
      </p>

      {/* Canvas & Telemetry Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 relative rounded-lg border border-line bg-[#070709] overflow-hidden">
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            className="w-full h-[240px] block cursor-crosshair"
          />
          <div className="absolute top-3 left-3 pointer-events-none font-mono text-[10px] text-gray-400 bg-black/60 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1.5">
            <Eye className="w-3 h-3 text-emerald-400" />
            <span>EYE-TRACKING FIELD // 60HZ</span>
          </div>
        </div>

        {/* Real-time Telemetry readouts */}
        <div className="lg:col-span-4 space-y-2.5 font-mono text-xs">
          <div className="p-3 rounded-token bg-paper border border-line flex items-center justify-between">
            <span className="text-ink-soft">Active Fixations:</span>
            <span className="text-accent font-bold">{fixations.length}</span>
          </div>
          <div className="p-3 rounded-token bg-paper border border-line flex items-center justify-between">
            <span className="text-ink-soft">Pupil Diameter:</span>
            <span className="text-amber-500 font-bold">{pupilDiam} mm</span>
          </div>
          <div className="p-3 rounded-token bg-paper border border-line flex items-center justify-between">
            <span className="text-ink-soft">Saccadic Velocity:</span>
            <span className="text-ink font-bold">{velocity} deg/s</span>
          </div>
          <div className="p-3 rounded-token bg-paper border border-line flex items-center justify-between">
            <span className="text-ink-soft flex items-center gap-1">
              <Activity className="w-3 h-3 text-accent" /> State:
            </span>
            <span className="text-accent font-bold">{cognitiveState}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
