import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "gold" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "gold", size = "md", children, disabled, ...props }, ref) => {
    const base = "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-amber-600/30 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2 gap-2",
      lg: "text-base px-6 py-3 gap-2.5",
    };

    const variantStyles = {
      gold: "gold-btn",
      primary: "bg-stone-900 hover:bg-stone-800 text-white shadow-sm",
      outline: "gold-outline-btn",
      ghost: "text-stone-700 hover:text-stone-900 hover:bg-stone-100/80",
      danger: "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(base, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
