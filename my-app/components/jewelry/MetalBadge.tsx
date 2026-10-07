import React from "react";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Sparkles } from "lucide-react";

interface MetalBadgeProps {
  metalType: string;
  purity?: string | null;
  certifiedBy?: string | null;
}

export function MetalBadge({ metalType, purity, certifiedBy }: MetalBadgeProps) {
  const getVariant = () => {
    const lower = metalType.toLowerCase();
    if (lower.includes("gold") && !lower.includes("white")) return "gold";
    if (lower.includes("platinum") || lower.includes("white") || lower.includes("silver")) return "silver";
    return "default";
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Badge variant={getVariant()} className="text-[11px] font-medium tracking-wide">
        <Sparkles className="w-3 h-3 text-[#9c7936]" />
        {purity ? `${purity} ${metalType}` : metalType}
      </Badge>

      {certifiedBy && certifiedBy !== "None" && (
        <Badge variant="emerald" className="text-[11px] font-medium">
          <ShieldCheck className="w-3 h-3 text-emerald-700" />
          {certifiedBy} Certified
        </Badge>
      )}
    </div>
  );
}
