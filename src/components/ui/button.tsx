import * as React from "react";
import { cn } from "@/lib/utils";
import { sound } from "@/lib/sound";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline" | "accent";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      sound.playClick(variant === "primary" ? 900 : 750);
      if (onClick) onClick(e);
    };

    const baseStyles =
      "inline-flex items-center justify-center font-sans font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-token select-none cursor-pointer";

    const variants = {
      primary: "bg-ink text-paper hover:opacity-90 active:scale-[0.99]",
      accent: "bg-accent text-white hover:opacity-90 active:scale-[0.99]",
      outline:
        "border border-line text-ink hover:bg-paper-2 hover:border-ink-soft active:scale-[0.99]",
      ghost: "text-ink-soft hover:text-ink hover:bg-paper-2 active:scale-[0.99]",
    };

    const sizes = {
      default: "h-9 px-4 py-2 text-sm",
      sm: "h-8 px-3 text-xs",
      lg: "h-11 px-6 text-base",
      icon: "h-8 w-8 p-0",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
