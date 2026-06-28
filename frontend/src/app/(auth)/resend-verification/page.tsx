"use client";

import { useState } from "react";
import AuthShell from "@/app/modules/auth/components/auth-shell";
import { authService } from "@/app/modules/auth/services/auth.service";

export default function ResendVerificationPage() {
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
      setMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const data = await authService.resendVerification(email);

      if (data?.success) {
        setStatus("success");
        setMessage(data?.message || `A verification link has been sent to ${email}.`);
      } else {
        setStatus("error");
        setMessage(data?.message || "Failed to send verification link.");
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
      title="Resend Verification"
      subtitle="Didn't get the email? We'll send it again."
      footerText="Remembered you verified?"
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
          {loading ? "Sending..." : "Resend Email"}
        </button>
      </form>
    </AuthShell>
  );
}
