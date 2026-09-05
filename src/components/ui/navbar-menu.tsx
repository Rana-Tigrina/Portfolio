"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { sound } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Sparkles } from "lucide-react";

const transition = {
  type: "spring" as const,
  mass: 0.35,
  damping: 18,
  stiffness: 220,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
  href,
}: {
  setActive: (item: string | null) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
  href?: string;
}) => {
  const isCurrentActive = active === item;

  const handleClick = () => {
    sound.playClick(750);
    setActive(null);
  };

  return (
    <div
      onMouseEnter={() => {
        sound.playClick(650);
        setActive(item);
      }}
      className="relative"
    >
      {href ? (
        <a
          href={href}
          onClick={handleClick}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer block",
            isCurrentActive
              ? "text-ink font-semibold bg-paper-2/80 shadow-2xs"
              : "text-ink-soft hover:text-ink"
          )}
        >
          {item}
        </a>
      ) : (
        <button
          type="button"
          onClick={() => setActive(isCurrentActive ? null : item)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer bg-transparent border-none",
            isCurrentActive
              ? "text-ink font-semibold bg-paper-2/80 shadow-2xs"
              : "text-ink-soft hover:text-ink"
          )}
        >
          {item}
        </button>
      )}

      <AnimatePresence>
        {isCurrentActive && children && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 6 }}
            transition={transition}
            className="absolute top-[calc(100%+0.75rem)] left-1/2 -translate-x-1/2 z-50 pt-2"
          >
            <div className="relative rounded-2xl border border-line/80 bg-paper/95 backdrop-blur-2xl shadow-2xl overflow-hidden min-w-[320px] max-w-[560px]">
              {/* Subtle top ambient indicator */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-accent/80 rounded-full" />
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
  className,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className={cn(
        "relative flex items-center gap-1 rounded-2xl bg-paper/85 border border-line/70 px-2 py-1 shadow-xs backdrop-blur-md",
        className
      )}
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  badge,
  metric,
  tag,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  badge?: string;
  metric?: string;
  tag?: string;
  icon?: React.ReactNode;
}) => {
  const handleClick = () => {
    sound.playClick(850);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="group flex items-start gap-3.5 p-3 rounded-xl hover:bg-paper-2/80 transition-all border border-transparent hover:border-line/70 focus:outline-none"
    >
      {icon && (
        <div className="w-10 h-10 rounded-lg bg-paper-2 border border-line/80 flex items-center justify-center shrink-0 text-accent group-hover:scale-105 group-hover:border-accent/40 transition-all shadow-2xs">
          {icon}
        </div>
      )}

      <div className="flex flex-col space-y-1 min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h4 className="font-mono text-xs font-semibold text-ink group-hover:text-accent transition-colors truncate">
              {title}
            </h4>
            {badge && (
              <span className="font-mono text-[9.5px] px-1.5 py-0.2 rounded border border-accent/40 bg-accent-soft text-accent shrink-0">
                {badge}
              </span>
            )}
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-ink-soft/60 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
        </div>

        <p className="font-sans text-[11px] text-ink-soft leading-relaxed line-clamp-2">
          {description}
        </p>

        {(metric || tag) && (
          <div className="flex items-center gap-2 pt-0.5">
            {metric && (
              <span className="font-mono text-[10px] font-bold text-accent">
                {metric}
              </span>
            )}
            {tag && (
              <span className="font-mono text-[10px] text-ink-soft/80">
                · {tag}
              </span>
            )}
          </div>
        )}
      </div>
    </a>
  );
};

export const HoveredLink = ({
  children,
  href,
  className,
  onClick,
  badge,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  onClick?: () => void;
  badge?: string;
}) => {
  const handleClick = () => {
    sound.playClick(750);
    if (onClick) onClick();
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        "flex items-center justify-between text-xs font-mono text-ink-soft hover:text-accent transition-colors py-1 px-2 rounded-md hover:bg-paper-2/60",
        className
      )}
    >
      <span>{children}</span>
      {badge && (
        <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-paper-2 border border-line text-ink-soft">
          {badge}
        </span>
      )}
    </a>
  );
};

export default {
  Menu,
  MenuItem,
  ProductItem,
  HoveredLink,
};
