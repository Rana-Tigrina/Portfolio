"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "motion/react";
import { sound } from "@/lib/sound";
import { cn } from "@/lib/utils";

export interface DockItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  target?: string;
  onClick?: (e?: React.MouseEvent) => void;
  badge?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

interface AnimatedDockProps {
  items: DockItem[];
  className?: string;
}

function DockIcon({
  item,
  mouseX,
}: {
  item: DockItem;
  mouseX: any;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-110, 0, 110], [34, 48, 34]);
  const heightTransform = useTransform(distance, [-110, 0, 110], [34, 48, 34]);

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 180,
    damping: 14,
  });

  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 180,
    damping: 14,
  });

  const iconScaleTransform = useTransform(distance, [-110, 0, 110], [1, 1.25, 1]);
  const iconScale = useSpring(iconScaleTransform, {
    mass: 0.1,
    stiffness: 180,
    damping: 14,
  });

  const handleClick = (e: React.MouseEvent) => {
    sound.playClick(850);
    if (item.onClick) {
      if (!item.href) e.preventDefault();
      item.onClick(e);
    }
  };

  const content = (
    <motion.div
      ref={ref}
      style={{ width, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex items-center justify-center rounded-xl bg-paper/60 hover:bg-paper-2 border border-line/60 hover:border-line text-ink-soft hover:text-ink transition-colors shadow-2xs cursor-pointer group shrink-0",
        item.className
      )}
      aria-label={item.ariaLabel || item.title}
    >
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute -top-8 px-2 py-0.5 rounded-md bg-ink text-paper text-[10px] font-mono whitespace-nowrap shadow-md pointer-events-none z-50"
          >
            {item.title}
          </motion.span>
        )}
      </AnimatePresence>

      <motion.div
        style={{ scale: iconScale }}
        className="flex items-center justify-center relative"
      >
        {item.icon}
        {item.badge && (
          <span className="absolute -top-1 -right-1">{item.badge}</span>
        )}
      </motion.div>
    </motion.div>
  );

  if (item.href) {
    return (
      <a
        href={item.href}
        target={item.target}
        rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
        onClick={handleClick}
        className="flex items-center justify-center focus:outline-none"
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center justify-center focus:outline-none cursor-pointer bg-transparent border-none p-0"
    >
      {content}
    </button>
  );
}

export function AnimatedDock({ items, className }: AnimatedDockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "flex items-center gap-1.5 px-1.5 py-1 rounded-2xl bg-paper-2/40 border border-line/50 shadow-2xs backdrop-blur-sm",
        className
      )}
    >
      {items.map((item) => (
        <DockIcon key={item.title} item={item} mouseX={mouseX} />
      ))}
    </motion.div>
  );
}

export default AnimatedDock;
