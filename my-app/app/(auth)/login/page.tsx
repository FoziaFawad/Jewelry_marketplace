"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Role } from "@/types";
import { ShieldCheck, Store, UserCheck, AlertCircle } from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role: Role) => {
    document.cookie = `user_role=${role}; path=/; max-age=604800`;
    if (role === "VENDOR") {
      router.push("/dashboard");
    } else if (role === "ADMIN") {
      router.push("/admin/vendors");
    } else {
      router.push("/jewelry");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      document.cookie = `user_role=VENDOR; path=/; max-age=604800`;
      router.push(callbackUrl);
    }, 600);
  };

  return (
    <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white border border-[#ede5dc] shadow-md space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-serif font-normal text-stone-900 tracking-tight">
          Enter Eternelle Vault
        </h1>
        <p className="text-xs text-stone-500">
          Access your fine jewelry collections, atelier, or admin governance
        </p>
      </div>

      {errorParam && (
        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorParam === "VendorAccessRequired" ? "Vendor role required to access Dashboard" : "Admin privileges required"}</span>
        </div>
      )}

      {/* Quick Role Persona Switcher */}
      <div className="space-y-2">
        <label className="text-[11px] uppercase tracking-wider text-stone-500 font-medium block">
          One-Click Demo Personas (RBAC)
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleRoleSelect("BUYER")}
            className="p-3 rounded-2xl bg-[#faf8f5] border border-[#e8ded4] hover:border-[#b48c48] hover:bg-white transition-all text-center flex flex-col items-center gap-1 shadow-2xs"
          >
            <UserCheck className="w-4 h-4 text-stone-700" />
            <span className="text-[11px] font-semibold text-stone-900">Buyer</span>
            <span className="text-[9px] text-stone-500">Collector</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect("VENDOR")}
            className="p-3 rounded-2xl bg-[#faf5ed] border border-[#ecd8b0] hover:border-[#b48c48] hover:bg-white transition-all text-center flex flex-col items-center gap-1 shadow-2xs"
          >
            <Store className="w-4 h-4 text-[#9c7936]" />
            <span className="text-[11px] font-semibold text-[#826229]">Vendor</span>
            <span className="text-[9px] text-[#9c7936]">Atelier Owner</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect("ADMIN")}
            className="p-3 rounded-2xl bg-[#faf8f5] border border-[#e8ded4] hover:border-emerald-600 hover:bg-white transition-all text-center flex flex-col items-center gap-1 shadow-2xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span className="text-[11px] font-semibold text-emerald-900">Admin</span>
            <span className="text-[9px] text-emerald-700">Governance</span>
          </button>
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-[#ede5dc] w-full" />
        <span className="bg-white px-3 text-[10px] uppercase tracking-wider text-stone-400 absolute">
          Or standard sign in
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="elena@auroragems.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="gold"
          size="md"
          className="w-full mt-2 rounded-full py-2.5"
          disabled={loading}
        >
          {loading ? "Authenticating..." : "Sign In to Vault"}
        </Button>
      </form>

      <p className="text-center text-xs text-stone-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-[#826229] hover:underline font-medium">
          Register here
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md p-8 bg-white border border-[#ede5dc] rounded-3xl animate-pulse" />}>
      <LoginFormContent />
    </Suspense>
  );
}
