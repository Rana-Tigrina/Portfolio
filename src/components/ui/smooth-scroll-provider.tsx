"use client";

import { ReactNode } from "react";
import { ReactLenis } from "lenis/react";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.12,
        duration: 0.9,
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.2,
      }}
    >
      {children}
    </ReactLenis>
  );
}
