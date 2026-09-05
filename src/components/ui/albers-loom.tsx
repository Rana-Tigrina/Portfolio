"use client";

import React, { useEffect, useRef } from "react";

export function AlbersLoom() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 800);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
      draw();
    };

    window.addEventListener("resize", handleResize);

    let step = 40;
    let progress = 0;
    let animId: number;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;

      // Warp threads (Vertical) - Batched
      ctx.strokeStyle = "rgba(245, 242, 235, 0.08)";
      ctx.beginPath();
      for (let x = 0; x < width * progress; x += step) {
        if (x % 120 !== 0) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }
      }
      ctx.stroke();

      ctx.strokeStyle = "rgba(201, 162, 39, 0.35)";
      ctx.beginPath();
      for (let x = 0; x < width * progress; x += step) {
        if (x % 120 === 0) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }
      }
      ctx.stroke();

      // Weft threads (Horizontal) - Batched
      ctx.strokeStyle = "rgba(245, 242, 235, 0.06)";
      ctx.beginPath();
      for (let y = 0; y < height * progress; y += step) {
        if (y % 120 !== 0) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
      }
      ctx.stroke();

      ctx.strokeStyle = "rgba(0, 47, 167, 0.25)";
      ctx.beginPath();
      for (let y = 0; y < height * progress; y += step) {
        if (y % 120 === 0) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
      }
      ctx.stroke();

      if (progress < 1) {
        progress += 0.04;
        animId = requestAnimationFrame(draw);
      }
    }

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0"
      aria-hidden="true"
    />
  );
}
