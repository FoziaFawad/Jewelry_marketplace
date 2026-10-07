"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Gem } from "lucide-react";

interface CaratSelectorProps {
  currentCarat: number;
  availableCarats?: number[];
  onChange?: (carat: number) => void;
}

export function CaratSelector({
  currentCarat,
  availableCarats = [1.0, 1.5, 2.0, 2.5, 3.2],
  onChange,
}: CaratSelectorProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-stone-600 font-medium uppercase tracking-wider flex items-center gap-1.5">
          <Gem className="w-3.5 h-3.5 text-[#9c7936]" /> Carat Weight
        </span>
        <span className="text-[#826229] font-semibold">{currentCarat.toFixed(2)} Carats</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {availableCarats.map((c) => {
          const isSelected = Math.abs(c - currentCarat) < 0.05;
          return (
            <button
              key={c}
              type="button"
              onClick={() => onChange?.(c)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border",
                isSelected
                  ? "bg-[#faf5ed] text-[#826229] border-[#d8be89] shadow-xs font-semibold"
                  : "bg-white text-stone-600 border-[#e8ded4] hover:border-[#b48c48] hover:text-stone-900"
              )}
            >
              {c.toFixed(1)} ct
            </button>
          );
        })}
      </div>
    </div>
  );
}
