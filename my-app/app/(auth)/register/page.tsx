"use client";

import React, { useState, useEffect, useRef } from "react";
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
  RotateCcw,
  ArrowLeft,
  KeyRound,
  Sparkles,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  // Step state: "details" | "verify"
  const [step, setStep] = useState<"details" | "verify">("details");

  // Form Fields
  const [role, setRole] = useState<Role>("BUYER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Verification Code State
  const [codeDigits, setCodeDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [devHint, setDevHint] = useState<string | null>(null);

  // Status State
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

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

  // STEP 1: Request Email Verification Code via Nodemailer
  const handleInitiateRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          purpose: "register",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Could not send verification email. Please try again.");
        setLoading(false);
        return;
      }

      // Transition to verification step
      setStep("verify");
      setResendCooldown(60);
      setSuccessMessage(data.message || `Verification code sent to ${email}`);

      if (data.devHintCode) {
        setDevHint(data.devHintCode);
      }

      setLoading(false);
      // Focus first digit box
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 200);
    } catch {
      setErrorMessage("Network error occurred. Please check your internet connection.");
      setLoading(false);
    }
  };

  // Resend code
  const handleResendCode = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          purpose: "register",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to resend code.");
        setResending(false);
        return;
      }

      setResendCooldown(60);
      setSuccessMessage(`A fresh verification code has been dispatched to ${email}.`);
      if (data.devHintCode) {
        setDevHint(data.devHintCode);
      }
      setResending(false);
    } catch {
      setErrorMessage("Failed to resend code. Please check your network.");
      setResending(false);
    }
  };

  // Handle OTP digit changes
  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...codeDigits];

    // Handle pasting a full 6-digit code
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, "").slice(0, 6);
      pasted.split("").forEach((char, i) => {
        newDigits[i] = char;
      });
      setCodeDigits(newDigits);
      const nextIndex = Math.min(pasted.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    newDigits[index] = value;
    setCodeDigits(newDigits);

    // Auto-advance to next box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // STEP 2: Verify Code and Finalize Account Creation
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = codeDigits.join("");

    if (fullCode.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          shopName: role === "VENDOR" ? shopName : undefined,
          verificationCode: fullCode,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Verification failed. Please check the code.");
        setLoading(false);
        return;
      }

      setSuccessMessage(
        role === "VENDOR"
          ? `Welcome to Éternelle Atelier, ${name}! Your seller suite is ready.`
          : `Welcome to Éternelle, ${name}! Your account has been verified.`
      );

      setTimeout(() => {
        window.location.href = data.redirectUrl || "/";
      }, 600);
    } catch {
      setErrorMessage("Could not complete registration. Please check your connection.");
      setLoading(false);
    }
  };

  // Google Sign-Up Trigger
  const handleGoogleSignUp = () => {
    setGoogleLoading(true);
    // Redirects to real Google OAuth endpoint
    window.location.href = `/api/auth/google?role=${role}`;
  };

  return (
    <div className="w-full max-w-lg p-7 sm:p-9 rounded-2xl bg-white border border-stone-200 shadow-xl space-y-6">
      {/* Title */}
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl font-serif text-stone-900 font-semibold tracking-tight">
          {step === "details" ? "Create Your Account" : "Verify Your Email"}
        </h1>
        <p className="text-sm text-stone-500">
          {step === "details"
            ? "Join Éternelle to collect certified fine jewelry or showcase your atelier."
            : `Enter the 6-digit authentication key sent to ${email}`}
        </p>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Dev Mode Helper Notice */}
      {devHint && step === "verify" && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-amber-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Developer Preview (SMTP not yet configured in .env)</span>
          </div>
          <div className="text-[11px] text-amber-700">
            Your verification code is: <strong className="font-mono text-sm tracking-wider bg-amber-100 px-1.5 py-0.5 rounded">{devHint}</strong>
          </div>
          <button
            type="button"
            onClick={() => {
              setCodeDigits(devHint.split(""));
              inputRefs.current[5]?.focus();
            }}
            className="text-[11px] text-amber-900 underline font-medium self-start cursor-pointer hover:text-amber-950"
          >
            Auto-fill this code
          </button>
        </div>
      )}

      {/* STEP 1: Registration Details */}
      {step === "details" && (
        <div className="space-y-6">
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
                <span>Buyer (Collector)</span>
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
                <span>Seller (Atelier)</span>
              </button>
            </div>

            <div className="text-xs text-stone-500 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#b48c48] shrink-0" />
              <span>
                {role === "BUYER"
                  ? "Browse museum-grade jewelry, save curated pieces, and order with secure escrow."
                  : "Curate your boutique, hallmarked listings, and accept collector orders."}
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
              <span>{googleLoading ? "Connecting to Google..." : "Continue with Google"}</span>
            </button>

            <div className="relative flex items-center justify-center py-1">
              <div className="border-t border-stone-200 w-full" />
              <span className="bg-white px-3 text-xs text-stone-400 absolute">
                or sign up with email verification
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleInitiateRegistration} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                Full Legal Name
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
                Email Address (Code will be sent here)
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
                  Your Jewelry Atelier Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Store className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Jenkins Haute Horlogerie"
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
                  <span>Sending verification email...</span>
                </>
              ) : (
                <>
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      )}

      {/* STEP 2: Enter 6-digit OTP code */}
      {step === "verify" && (
        <form onSubmit={handleVerifyAndRegister} className="space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#faf4ea] border border-[#e6d3b3] flex items-center justify-center text-[#b48c48]">
              <KeyRound className="w-6 h-6" />
            </div>
            <p className="text-xs text-stone-600">
              Code sent to <strong className="text-stone-900">{email}</strong>
            </p>
            <button
              type="button"
              onClick={() => {
                setStep("details");
                setErrorMessage("");
              }}
              className="inline-flex items-center gap-1 text-[11px] text-[#b48c48] hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Change email address</span>
            </button>
          </div>

          {/* 6 Digit Input Boxes */}
          <div className="space-y-2">
            <label className="block text-center text-xs font-semibold uppercase tracking-wider text-stone-600">
              6-Digit Security Code
            </label>
            <div className="flex justify-center gap-2.5 sm:gap-3">
              {codeDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono rounded-xl bg-white border-2 border-stone-300 text-stone-900 focus:outline-none focus:border-[#b48c48] focus:ring-2 focus:ring-[#b48c48]/20 transition-all"
                />
              ))}
            </div>
          </div>

          {/* Resend Action */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-stone-500">Didn&apos;t receive the email?</span>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendCooldown > 0 || resending}
              className="text-[#b48c48] font-semibold hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className={`w-3 h-3 ${resending ? "animate-spin" : ""}`} />
              <span>
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
              </span>
            </button>
          </div>

          {/* Verify & Create Account Button */}
          <Button
            type="submit"
            variant="gold"
            size="md"
            className="w-full rounded-xl py-3 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
            disabled={loading || codeDigits.join("").length !== 6}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Verifying and creating account...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Create Account</span>
              </>
            )}
          </Button>

          <button
            type="button"
            onClick={() => {
              setStep("details");
              setErrorMessage("");
            }}
            className="w-full py-2 text-xs text-stone-500 hover:text-stone-800 transition-colors text-center"
          >
            &larr; Back to account details
          </button>
        </form>
      )}

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
