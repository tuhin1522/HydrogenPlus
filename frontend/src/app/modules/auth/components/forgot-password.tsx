"use client";

import { useState } from "react";
import AuthShell from "./auth-shell";
import { forgotPassword } from "../services/auth.service";

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
      const data = await forgotPassword(email);

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
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@school.edu"
            className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {status !== "idle" && (
          <div className={`rounded-2xl border px-4 py-3 text-sm ${status === "error" ? "border-error/50 bg-error/10 text-error" : "border-success/50 bg-success/10 text-success"}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Sending reset link..." : "Send reset link"}
        </button>
      </form>
    </AuthShell>
  );
}
