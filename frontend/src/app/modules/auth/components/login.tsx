"use client";

import { useMemo, useState } from "react";
import AuthShell from "./auth-shell";
import { useRouter } from "next/navigation";
import { login } from "../services/auth.service";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const passwordStrength = useMemo(() => {
    if (!password) return { label: "Enter password", color: "bg-muted" };
    const score = [/.{8,}/.test(password), /[A-Z]/.test(password), /[0-9]/.test(password)].filter(Boolean).length;
    if (score === 3) return { label: "Strong", color: "bg-success" };
    if (score === 2) return { label: "Medium", color: "bg-primary" };
    return { label: "Weak", color: "bg-error" };
  }, [password]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatus("idle");

    if (!email.includes("@") || password.length < 6) {
      setStatus("error");
      setMessage("Please enter a valid email and a password with at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const data = await login(email, password);

      if (data?.success) {
        setStatus("success");
        setMessage("Signed in successfully. Welcome back.");
        
        // Save the token and user
        const token = data.data?.token;
        const user = data.data?.user;
        
        if (token) {
          localStorage.setItem("token", token);
          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            // Dispatch a storage event so Navbar can pick it up immediately
            window.dispatchEvent(new Event("storage"));
          }
        }
        
        // Redirect to dashboard
        setTimeout(() => {
          let redirectPath = "/";
          if (user?.role === "STUDENT") {
            redirectPath = "/student";
          } else if (user?.role === "TEACHER") {
            redirectPath = "/teacher";
          } else if (user?.role === "SUPER_ADMIN") {
            redirectPath = "/super-admin";
          } else if (user?.role === "BRANCH_ADMIN") {
            redirectPath = "/branch-admin";
          }
          router.push(redirectPath);
        }, 1000);
      } else {
        setStatus("error");
        setMessage(data?.message || "Login failed. Please try again.");
      }
    } catch (error: any) {
      setStatus("error");
      setMessage(error.response?.data?.message || "An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
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
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-input bg-background px-4 py-3 pr-12 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg suppressHydrationWarning xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                  <line x1="2" y1="2" x2="22" y2="22"></line>
                </svg>
              ) : (
                <svg suppressHydrationWarning xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
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
