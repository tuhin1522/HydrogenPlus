"use client";

import { useMemo, useState } from "react";
import AuthShell from "./auth-shell";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [message, setMessage] = useState("");

  const passwordStrength = useMemo(() => {
    if (!formData.password) return { label: "Enter password", color: "bg-muted" };
    const score = [
      /.{8,}/.test(formData.password),
      /[A-Z]/.test(formData.password),
      /[0-9]/.test(formData.password),
    ].filter(Boolean).length;
    if (score === 3) return { label: "Strong", color: "bg-success" };
    if (score === 2) return { label: "Medium", color: "bg-primary" };
    return { label: "Weak", color: "bg-error" };
  }, [formData.password]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;
    const checked = type === "checkbox" ? (event.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatus("idle");
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!formData.agreeTerms) {
      setStatus("error");
      setMessage("Please agree to the Terms & Conditions.");
      setLoading(false);
      return;
    }

    try {
      const { authService } = await import("./../services/auth.service");
      const response = await authService.signup({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      if (response.success && response.data?.token) {
        setStatus("success");
        setMessage("Account created successfully. Redirecting...");

        // Save the token and user
        localStorage.setItem("token", response.data.token);
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          // Dispatch a storage event so Navbar picks it up immediately
          window.dispatchEvent(new Event("storage"));
        }
        
        // Redirect to dashboard (default is student)
        const userRole = response.data.user?.role || "STUDENT";
        setTimeout(() => {
          if (userRole === "TEACHER") router.push("/teacher");
          else if (userRole === "SUPER_ADMIN") router.push("/super-admin");
          else if (userRole === "BRANCH_ADMIN") router.push("/branch-admin");
          else router.push("/student");
        }, 1000);
      } else {
        setStatus("error");
        setMessage(response.message || "Signup failed. Please try again.");
      }
    } catch (error: any) {
      setStatus("error");
      if (error.response?.data?.errors) {
        const errs = error.response.data.errors;
        setMessage(errs.map((e: any) => e.message).join(", "));
      } else {
        setMessage(error.response?.data?.message || "An error occurred during signup.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create an account"
      subtitle="Sign up for your coaching and branch management workspace"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerHref="/login"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-foreground">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Alicia Johnson"
            className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="alicia@school.edu"
            className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-medium text-foreground">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="01712345678"
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
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a strong password"
            className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary"
            required
          />
          <div className="mt-3">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Password strength</span>
              <span>{passwordStrength.label}</span>
            </div>
            <div className="h-2 rounded-full bg-secondary">
              <div className={`h-2 rounded-full ${passwordStrength.color}`} style={{ width: formData.password.length ? "100%" : "0%" }} />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-foreground">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            id="agreeTerms"
            name="agreeTerms"
            type="checkbox"
            checked={formData.agreeTerms}
            onChange={handleChange}
            className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
            required
          />
          <label htmlFor="agreeTerms" className="text-sm text-muted-foreground">
            I agree to the Terms & Conditions and Privacy Policy.
          </label>
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
          {loading ? "Creating account..." : "Sign up"}
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
