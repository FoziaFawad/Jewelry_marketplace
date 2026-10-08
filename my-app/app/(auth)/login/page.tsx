"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Store,
  ShieldCheck,
  UserCheck,
  ArrowRight,
} from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    errorParam === "VendorAccessRequired"
      ? "Please log in with a Vendor account to view the seller dashboard."
      : errorParam === "AdminAccessRequired"
      ? "Admin access required for this area."
      : ""
  );
  const [successMessage, setSuccessMessage] = useState("");

  // Quick fill for testing
  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setErrorMessage("");
  };

  // Regular Email + Password Login
  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Wrong email or password. Please try again.");
        setLoading(false);
        return;
      }

      setSuccessMessage(`Welcome back, ${data.user.name || "User"}! Logging you in...`);

      const target =
        callbackUrl && callbackUrl !== "/login" && callbackUrl !== "/register"
          ? callbackUrl
          : data.redirectUrl || "/";

      setTimeout(() => {
        window.location.href = target;
      }, 500);
    } catch {
      setErrorMessage("Could not connect. Please check your internet connection.");
      setLoading(false);
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    const target = callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : "";
    window.location.href = `/api/auth/google${target}`;
  };

  return (
    <div className="w-full max-w-md p-7 sm:p-9 rounded-2xl bg-white border border-stone-200 shadow-lg space-y-6">
      {/* Title */}
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl font-serif text-stone-900 font-semibold tracking-tight">
          Welcome Back
        </h1>
        <p className="text-sm text-stone-500">
          Sign in to your account to continue
        </p>
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Google Login Button */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="w-full py-2.5 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-sm font-medium flex items-center justify-center gap-3 transition-colors shadow-2xs active:scale-[0.99] disabled:opacity-60 cursor-pointer"
        >
          {googleLoading ? (
            <div className="w-4 h-4 border-2 border-stone-400 border-t-stone-800 rounded-full animate-spin" />
          ) : (
            <GoogleIcon className="w-4 h-4 shrink-0" />
          )}
          <span>{googleLoading ? "Signing in..." : "Continue with Google"}</span>
        </button>

        <div className="relative flex items-center justify-center py-1">
          <div className="border-t border-stone-200 w-full" />
          <span className="bg-white px-3 text-xs text-stone-400 absolute">
            or sign in with email
          </span>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleStandardLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl bg-white border border-stone-300 pl-10 pr-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#b48c48] focus:ring-1 focus:ring-[#b48c48]/30 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
              Password
            </label>
            <span className="text-xs text-[#b48c48] hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl bg-white border border-stone-300 pl-10 pr-10 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#b48c48] focus:ring-1 focus:ring-[#b48c48]/30 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="gold"
          size="md"
          className="w-full mt-2 rounded-xl py-2.5 text-sm flex items-center justify-center gap-2 cursor-pointer"
          disabled={loading || googleLoading}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      {/* 1-Click Demo Accounts for easy testing */}
      <div className="pt-3 border-t border-stone-200 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-stone-500">
            Quick Test Accounts:
          </span>
          <span className="text-[11px] text-stone-400 font-mono">Password: password123</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => fillDemoAccount("elena@aurorafine.com")}
            className="p-2 rounded-xl bg-amber-50/60 border border-amber-200 hover:bg-amber-100/60 transition-colors text-center flex flex-col items-center gap-0.5 cursor-pointer"
          >
            <Store className="w-4 h-4 text-amber-800" />
            <span className="text-xs font-semibold text-amber-900">Seller</span>
            <span className="text-[10px] text-amber-700">Elena</span>
          </button>

          <button
            type="button"
            onClick={() => fillDemoAccount("buyer@eternelle.com")}
            className="p-2 rounded-xl bg-stone-50 border border-stone-200 hover:bg-stone-100 transition-colors text-center flex flex-col items-center gap-0.5 cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-stone-700" />
            <span className="text-xs font-semibold text-stone-900">Buyer</span>
            <span className="text-[10px] text-stone-500">Customer</span>
          </button>

          <button
            type="button"
            onClick={() => fillDemoAccount("admin@eternelle.com")}
            className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200 hover:bg-emerald-100/70 transition-colors text-center flex flex-col items-center gap-0.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-semibold text-emerald-900">Admin</span>
            <span className="text-[10px] text-emerald-700">Manager</span>
          </button>
        </div>
      </div>

      {/* Link to Register */}
      <p className="text-center text-xs text-stone-500 pt-1">
        Don&apos;t have an account yet?{" "}
        <Link href="/register" className="text-[#b48c48] hover:underline font-semibold">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md p-8 bg-white border border-stone-200 rounded-2xl animate-pulse h-[400px]" />
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
