"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, SlidersHorizontal } from "lucide-react";

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  onFilterToggle?: () => void;
}

export function SearchBar({
  initialQuery = "",
  placeholder = "Search certified diamonds, 18K gold necklaces, emeralds, or ateliers...",
  onFilterToggle,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/jewelry?query=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/jewelry");
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center rounded-full bg-white border border-[#ded5cb] p-1.5 shadow-sm hover:shadow-md focus-within:border-[#b48c48] focus-within:ring-2 focus-within:ring-[#b48c48]/15 transition-all">
        <div className="pl-4 pr-2 text-[#9c7936]">
          <Search className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-2 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
        />

        {onFilterToggle && (
          <button
            type="button"
            onClick={onFilterToggle}
            className="md:hidden p-2 text-stone-400 hover:text-stone-700 transition-colors"
            title="Filter search"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="gold-btn px-5 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Explore</span>
        </button>
      </div>
    </form>
  );
}
