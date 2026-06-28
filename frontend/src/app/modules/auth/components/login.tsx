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
    if (!password) return { label: "Enter password", color: "bg-muted" };
    const score = [/.{8,}/.test(password), /[A-Z]/.test(password), /[0-9]/.test(password)].filter(Boolean).length;
    if (score === 3) return { label: "Strong", color: "bg-success" };
    if (score === 2) return { label: "Medium", color: "bg-primary" };
    return { label: "Weak", color: "bg-error" };
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
        setMessage("Signed in successfully. Welcome back to Hydrogen Plus.");
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
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="teacher@northview.edu"
            className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary"
            required
          />
          <div className="mt-3">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Password strength</span>
              <span>{passwordStrength.label}</span>
            </div>
            <div className="h-2 rounded-full bg-secondary">
              <div className={`h-2 rounded-full ${passwordStrength.color}`} style={{ width: password.length ? "100%" : "0%" }} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember((prev) => !prev)}
              className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
            />
            Remember me
          </label>
          <a href="/forgot-password" className="font-medium text-primary transition hover:opacity-80">
            Forgot password?
          </a>
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
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">or continue with</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button type="button" className="rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:bg-secondary">
            Google
          </button>
          <button type="button" className="rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:bg-secondary">
            Microsoft
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
