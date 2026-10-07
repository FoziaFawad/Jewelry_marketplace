"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Role } from "@/types";
import { Store, ShoppingBag } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("BUYER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    document.cookie = `user_role=${role}; path=/; max-age=604800`;
    if (role === "VENDOR") {
      router.push("/dashboard");
    } else {
      router.push("/jewelry");
    }
  };

  return (
    <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white border border-[#ede5dc] shadow-md space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-serif font-normal text-stone-900 tracking-tight">
          Join Eternelle Gems
        </h1>
        <p className="text-xs text-stone-500">
          Create an account as a fine jewelry buyer or certified atelier vendor
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-[#f5f0ea] rounded-full border border-[#e8ded4]">
        <button
          type="button"
          onClick={() => setRole("BUYER")}
          className={`py-2 px-3 rounded-full text-xs font-medium flex items-center justify-center gap-2 transition-all ${
            role === "BUYER"
              ? "bg-white text-stone-900 shadow-2xs font-semibold"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Jewelry Buyer
        </button>

        <button
          type="button"
          onClick={() => setRole("VENDOR")}
          className={`py-2 px-3 rounded-full text-xs font-medium flex items-center justify-center gap-2 transition-all ${
            role === "VENDOR"
              ? "bg-white text-stone-900 shadow-2xs font-semibold"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          Atelier Vendor
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Legal Name"
          placeholder="Genevieve Vance"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="genevieve@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {role === "VENDOR" && (
          <Input
            label="Boutique / Atelier Name"
            placeholder="e.g. Celestial Carats"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
          />
        )}

        <Input
          label="Password"
          type="password"
          placeholder="••••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" variant="gold" size="md" className="w-full mt-2 rounded-full py-2.5">
          {role === "VENDOR" ? "Apply for Atelier Verification" : "Create Buyer Account"}
        </Button>
      </form>

      <p className="text-center text-xs text-stone-500">
        Already registered?{" "}
        <Link href="/login" className="text-[#826229] hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
