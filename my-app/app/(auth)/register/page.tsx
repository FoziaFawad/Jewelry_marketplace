"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { Role } from "@/types";
import {
  ShoppingBag,
  Store,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState<Role>("BUYER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Password strength check
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "" };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-amber-400" };
    if (score === 2) return { score: 2, label: "Medium", color: "bg-blue-500" };
    return { score: 3, label: "Strong", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength(password);

  // Submit registration form
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          shopName: role === "VENDOR" ? shopName : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Could not create account. Please check your details.");
        setLoading(false);
        return;
      }

      setSuccessMessage(
        role === "VENDOR"
          ? `Welcome, ${name}! Your seller shop is ready.`
          : `Welcome, ${name}! Your account has been created.`
      );

      setTimeout(() => {
        router.push(data.redirectUrl || (role === "VENDOR" ? "/dashboard" : "/jewelry"));
        router.refresh();
      }, 700);
    } catch {
      setErrorMessage("Could not connect. Please check your internet connection.");
      setLoading(false);
    }
  };

  // Google sign up
  const handleGoogleSignUp = async () => {
    setErrorMessage("");
    setGoogleLoading(true);

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "google.collector@eternelle.com",
          name: "Google Customer",
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Google sign-up failed. Please try again.");
        setGoogleLoading(false);
        return;
      }

      setSuccessMessage("Account created with Google! Redirecting...");
      setTimeout(() => {
        router.push(data.redirectUrl || (role === "VENDOR" ? "/dashboard" : "/jewelry"));
        router.refresh();
      }, 600);
    } catch {
      setErrorMessage("Could not connect to Google sign-up.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg p-7 sm:p-9 rounded-2xl bg-white border border-stone-200 shadow-lg space-y-6">
      {/* Title */}
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl font-serif text-stone-900 font-semibold tracking-tight">
          Create Your Account
        </h1>
        <p className="text-sm text-stone-500">
          Join to buy jewelry or start selling your own collection
        </p>
      </div>

      {/* Notifications */}
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

      {/* Account Type Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
          Choose Account Type
        </label>
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-stone-100 rounded-xl">
          <button
            type="button"
            onClick={() => setRole("BUYER")}
            className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              role === "BUYER"
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#b48c48]" />
            <span>Buyer (Shop Jewelry)</span>
          </button>

          <button
            type="button"
            onClick={() => setRole("VENDOR")}
            className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              role === "VENDOR"
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Store className="w-3.5 h-3.5 text-[#b48c48]" />
            <span>Seller (Sell Jewelry)</span>
          </button>
        </div>

        <div className="text-xs text-stone-500 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#b48c48] shrink-0" />
          <span>
            {role === "BUYER"
              ? "Browse certified fine jewelry, save favorites, and place orders."
              : "Create your jewelry shop, list products, and get customer orders."}
          </span>
        </div>
      </div>

      {/* Google Sign-Up Button */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading || loading}
          className="w-full py-2.5 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-sm font-medium flex items-center justify-center gap-3 transition-colors shadow-2xs active:scale-[0.99] disabled:opacity-60 cursor-pointer"
        >
          {googleLoading ? (
            <div className="w-4 h-4 border-2 border-stone-400 border-t-stone-800 rounded-full animate-spin" />
          ) : (
            <GoogleIcon className="w-4 h-4 shrink-0" />
          )}
          <span>{googleLoading ? "Signing up..." : "Sign up with Google"}</span>
        </button>

        <div className="relative flex items-center justify-center py-1">
          <div className="border-t border-stone-200 w-full" />
          <span className="bg-white px-3 text-xs text-stone-400 absolute">
            or sign up with email
          </span>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleRegister} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="e.g. Sarah Jenkins"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl bg-white border border-stone-300 pl-10 pr-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#b48c48] focus:ring-1 focus:ring-[#b48c48]/30 transition-colors"
            />
          </div>
        </div>

        {/* Email */}
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
              placeholder="sarah@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl bg-white border border-stone-300 pl-10 pr-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#b48c48] focus:ring-1 focus:ring-[#b48c48]/30 transition-colors"
            />
          </div>
        </div>

        {/* Shop Name (Only for Sellers) */}
        {role === "VENDOR" && (
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
              Your Jewelry Shop Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Store className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. Golden Glow Jewelry"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                required
                className="w-full rounded-xl bg-white border border-stone-300 pl-10 pr-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#b48c48] focus:ring-1 focus:ring-[#b48c48]/30 transition-colors"
              />
            </div>
          </div>
        )}

        {/* Password */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
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

          {/* Password Strength Meter */}
          {password.length > 0 && (
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-stone-500">Password strength:</span>
                <span className="font-medium text-stone-700">{strength.label}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 h-1">
                <div
                  className={`rounded-full ${
                    strength.score >= 1 ? strength.color : "bg-stone-200"
                  }`}
                />
                <div
                  className={`rounded-full ${
                    strength.score >= 2 ? strength.color : "bg-stone-200"
                  }`}
                />
                <div
                  className={`rounded-full ${
                    strength.score >= 3 ? strength.color : "bg-stone-200"
                  }`}
                />
              </div>
            </div>
          )}
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
              <span>Creating your account...</span>
            </>
          ) : (
            <>
              <span>
                {role === "VENDOR" ? "Create Seller Account" : "Create Buyer Account"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      {/* Link to Login */}
      <p className="text-center text-xs text-stone-500 pt-1">
        Already have an account?{" "}
        <Link href="/login" className="text-[#b48c48] hover:underline font-semibold">
          Sign In
        </Link>
      </p>
    </div>
  );
}
