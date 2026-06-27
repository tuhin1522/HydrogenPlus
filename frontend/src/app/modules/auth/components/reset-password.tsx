"use client";

import { useMemo, useState } from "react";
import AuthShell from "./auth-shell";


export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordStrength = useMemo(() => {
    if (!password) return { label: "Enter a new password", color: "bg-[#1D3E3E]" };
    const score = [/.{8,}/.test(password), /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
    if (score >= 3) return { label: "Strong", color: "bg-[#2BCA7A]" };
    if (score === 2) return { label: "Fair", color: "bg-[#86F05C]" };
    return { label: "Weak", color: "bg-[#EF4343]" };
  }, [password]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatus("idle");

    setTimeout(() => {
      if (password.length < 8 || password !== confirmPassword) {
        setStatus("error");
        setMessage("Please use a stronger password and make sure both fields match.");
      } else {
        setStatus("success");
        setMessage("Password updated successfully. You can now sign in securely.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <AuthShell
      title="Reset password"
      subtitle="Create a new secure password for your account"
      footerText="Need help?"
      footerLinkText="Contact support"
      footerHref="/login"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#F3F7F6]">
            New password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a strong password"
            className="w-full rounded-2xl border border-[#1D3E3E] bg-[#081717] px-4 py-3 text-sm text-[#F3F7F6] outline-none transition focus:border-[#86F05C] focus:ring-2 focus:ring-[#86F05C]"
            required
          />
          <div className="mt-3">
            <div className="mb-2 flex items-center justify-between text-xs text-[#A9B7B4]">
              <span>Password strength</span>
              <span>{passwordStrength.label}</span>
            </div>
            <div className="h-2 rounded-full bg-[#0D2A2B]">
              <div className={`h-2 rounded-full ${passwordStrength.color}`} style={{ width: password ? "100%" : "0%" }} />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-[#F3F7F6]">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Re-enter your password"
            className="w-full rounded-2xl border border-[#1D3E3E] bg-[#081717] px-4 py-3 text-sm text-[#F3F7F6] outline-none transition focus:border-[#86F05C] focus:ring-2 focus:ring-[#86F05C]"
            required
          />
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
          {loading ? "Updating password..." : "Update password"}
        </button>
      </form>
    </AuthShell>
  );
}
