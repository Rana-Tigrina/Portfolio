"use client";

import React, { useEffect, useRef } from "react";

export function CaravaggioSpotlight() {
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Only run on fine pointer devices (desktop mouse)
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let running = false;
    let animId: number;

    const update = () => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;

      currentX += dx * 0.18;
      currentY += dy * 0.18;

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      if (Math.abs(dx) > 0.25 || Math.abs(dy) > 0.25) {
        animId = requestAnimationFrame(update);
      } else {
        running = false;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!running) {
        running = true;
        animId = requestAnimationFrame(update);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    running = true;
    animId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <div ref={spotlightRef} id="caravaggio-spotlight" aria-hidden="true" />
      <svg className="sr-only" aria-hidden="true">
        <defs>
          <filter id="sumi-ink-bleed" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
    </>
  );
}
