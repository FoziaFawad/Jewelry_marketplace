import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "silver" | "emerald" | "ruby" | "outline" | "success" | "warning";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-stone-100 text-stone-700 border-stone-200",
    gold: "bg-[#faf5ed] text-[#826229] border-[#ecd8b0] font-medium",
    silver: "bg-slate-100 text-slate-700 border-slate-200",
    emerald: "bg-emerald-50 text-emerald-800 border-emerald-200",
    ruby: "bg-rose-50 text-rose-800 border-rose-200",
    outline: "border-stone-300 text-stone-700 bg-white",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
