"use client";

import React, { useEffect, useRef } from "react";

export function RichterSqueegee() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = 640);
    const height = (canvas.height = 120);

    function initCanvas() {
      if (!ctx) return;
      ctx.fillStyle = "#121218";
      ctx.fillRect(0, 0, width, height);

      // Impasto oil streaks
      for (let i = 0; i < 28; i++) {
        ctx.fillStyle = i % 2 === 0 ? "rgba(201, 162, 39, 0.3)" : "rgba(0, 47, 167, 0.35)";
        ctx.fillRect(Math.random() * width, 0, Math.random() * 25 + 5, height);
      }

      ctx.fillStyle = "#f5f2eb";
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillText("// EMPIRICAL TRACE: 87% P@5 RETRIEVAL · RAGAS 0.85 PASS · 0 REGRESSION", 20, 65);
    }

    initCanvas();

    let isDragging = false;

    const onMouseDown = () => { isDragging = true; };
    const onMouseUp = () => { isDragging = false; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;

      ctx.save();
      ctx.filter = "blur(4px)";
      ctx.drawImage(canvas, x - 20, 0, 40, height, x - 15, (Math.random() - 0.5) * 8, 40, height);
      ctx.restore();

      ctx.fillStyle = "rgba(201, 162, 39, 0.45)";
      ctx.fillRect(x - 2, 0, 4, height);
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mousemove", onMouseMove);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div className="py-6 my-8 p-6 bg-[#0e0e13] border border-white/10 rounded text-center space-y-3">
      <div className="flex items-center justify-between font-mono text-[11px] text-[#a6a297] uppercase tracking-widest">
        <span>GERHARD RICHTER SQUEEGEE TELEMETRY PLATE</span>
        <span className="text-[#C9A227]">DRAG MOUSE TO SMEAR TEMPORAL TRACE</span>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full max-w-2xl h-28 border border-white/10 rounded cursor-crosshair mx-auto bg-[#121218] shadow-inner"
      />
      <div className="font-mono text-[10px] text-neutral-500">
        Instruction #02: Click and drag across the plate to blend digital telemetry into oil impasto.
      </div>
    </div>
  );
}
