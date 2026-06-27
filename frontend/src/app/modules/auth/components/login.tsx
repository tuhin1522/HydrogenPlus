"use client";

import { useMemo, useState } from "react";
import AuthShell from "./auth-shell";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [message, setMessage] = useState("");

  const passwordStrength = useMemo(() => {
    if (!password) return { label: "Enter password", color: "bg-[#1D3E3E]" };
    const score = [/.{8,}/.test(password), /[A-Z]/.test(password), /[0-9]/.test(password)].filter(Boolean).length;
    if (score === 3) return { label: "Strong", color: "bg-[#2BCA7A]" };
    if (score === 2) return { label: "Medium", color: "bg-[#86F05C]" };
    return { label: "Weak", color: "bg-[#EF4343]" };
  }, [password]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatus("idle");

    setTimeout(() => {
      if (!email.includes("@") || password.length < 6) {
        setStatus("error");
        setMessage("Please enter a valid email and a password with at least 6 characters.");
      } else {
        setStatus("success");
        setMessage("Signed in successfully. Welcome back to EduBranch Pro.");
      }
      setLoading(false);
    }, 900);
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to your coaching and branch management workspace"
      footerText="Don’t have an account?"
      footerLinkText="Create one"
      footerHref="/signup"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#F3F7F6]">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="teacher@northview.edu"
            className="w-full rounded-2xl border border-[#1D3E3E] bg-[#081717] px-4 py-3 text-sm text-[#F3F7F6] outline-none transition focus:border-[#86F05C] focus:ring-2 focus:ring-[#86F05C]"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#F3F7F6]">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className="w-full rounded-2xl border border-[#1D3E3E] bg-[#081717] px-4 py-3 text-sm text-[#F3F7F6] outline-none transition focus:border-[#86F05C] focus:ring-2 focus:ring-[#86F05C]"
            required
          />
          <div className="mt-3">
            <div className="mb-2 flex items-center justify-between text-xs text-[#A9B7B4]">
              <span>Password strength</span>
              <span>{passwordStrength.label}</span>
            </div>
            <div className="h-2 rounded-full bg-[#0D2A2B]">
              <div className={`h-2 rounded-full ${passwordStrength.color}`} style={{ width: password.length ? "100%" : "0%" }} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="flex items-center gap-2 text-[#A9B7B4]">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember((prev) => !prev)}
              className="h-4 w-4 rounded border-[#1D3E3E] bg-[#081717] text-[#86F05C] focus:ring-[#86F05C]"
            />
            Remember me
          </label>
          <a href="/forgot-password" className="font-medium text-[#86F05C] transition hover:text-[#B7FF63]">
            Forgot password?
          </a>
        </div>

        {status !== "idle" && (
          <div className={`rounded-2xl border px-4 py-3 text-sm ${status === "error" ? "border-[#EF4343]/50 bg-[#EF4343]/10 text-[#EF4343]" : "border-[#2BCA7A]/50 bg-[#2BCA7A]/10 text-[#2BCA7A]"}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#B7FF63] via-[#86F05C] to-[#0E8B6E] px-4 py-3 text-sm font-semibold text-[#081717] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[#1D3E3E]" />
          <span className="text-xs uppercase tracking-[0.24em] text-[#A9B7B4]">or continue with</span>
          <div className="h-px flex-1 bg-[#1D3E3E]" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button type="button" className="rounded-2xl border border-[#1D3E3E] bg-[#081717] px-4 py-3 text-sm font-medium text-[#F3F7F6] transition hover:bg-[#0D2A2B]">
            Google
          </button>
          <button type="button" className="rounded-2xl border border-[#1D3E3E] bg-[#081717] px-4 py-3 text-sm font-medium text-[#F3F7F6] transition hover:bg-[#0D2A2B]">
            Microsoft
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
