import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = "text", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-medium uppercase tracking-wider text-stone-600">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "w-full rounded-lg bg-white border border-[#dcd1c4] px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 shadow-2xs",
            "focus:outline-none focus:border-[#b48c48] focus:ring-1 focus:ring-[#b48c48]/30 transition-colors",
            error && "border-rose-400 focus:border-rose-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
