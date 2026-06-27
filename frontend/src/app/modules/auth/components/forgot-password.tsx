"use client";

import { useState } from "react";
import AuthShell from "./auth-shell";
import { authService } from "../services/auth.service";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatus("idle");

    if (!email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address to receive the reset link.");
      setLoading(false);
      return;
    }

    try {
      const data = await authService.forgotPassword(email);

      if (data?.success) {
        setStatus("success");
        setMessage(data?.message || `A reset link has been sent to ${email}.`);
      } else {
        setStatus("error");
        setMessage(data?.message || "Failed to send reset link.");
      }
    } catch (error: any) {
      setStatus("error");
      setMessage(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Forgot password"
      subtitle="We’ll send a secure reset link to your email"
      footerText="Remember your password?"
      footerLinkText="Back to login"
      footerHref="/login"
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
            placeholder="you@school.edu"
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
          {loading ? "Sending reset link..." : "Send reset link"}
        </button>
      </form>
    </AuthShell>
  );
}
