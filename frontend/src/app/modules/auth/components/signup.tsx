"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ThemeMode = "dark" | "light";

const steps = [
  { id: 1, title: "Account" },
  { id: 2, title: "Security" },
  { id: 3, title: "Consent" },
  { id: 4, title: "Ready" },
];

const metricCards = [
  { value: "2.4k+", label: "schools onboarded" },
  { value: "98.7%", label: "rollout success" },
  { value: "24/7", label: "support coverage" },
];

const benefits = [
  "Unified attendance, grading, and communication workflows",
  "AI-powered insights for district and campus leaders",
  "Enterprise-grade security with SSO and audit trails",
];

function getPasswordStrength(password: string) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  const score = checks.filter(Boolean).length;
  let label = "Very weak";
  let tone = "bg-[#EF4343]";

  if (score >= 3) {
    label = "Strong";
    tone = "bg-[#2BCA7A]";
  } else if (score === 2) {
    label = "Good";
    tone = "bg-[#86F05C]";
  } else if (score === 1) {
    label = "Fair";
    tone = "bg-[#A9B7B4]";
  }

  return { score, label, tone, checks };
}

export default function Signup() {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [validationErrors, setValidationErrors] = useState<any[]>([]);

  const passwordStrength = useMemo(
    () => getPasswordStrength(formData.password),
    [formData.password]
  );

  const isDark = theme === "dark";
  const surface = isDark ? "bg-[#0A2324] text-[#F3F7F6]" : "bg-white text-[#081717]";
  const muted = isDark ? "bg-[#0D2A2B] text-[#A9B7B4]" : "bg-[#F4FFF8] text-[#4B5A58]";
  const border = isDark ? "border-[#1D3E3E]" : "border-[#D9ECE4]";
  const focus = isDark ? "focus:ring-[#86F05C]" : "focus:ring-[#2BCA7A]";
  const accent = isDark ? "from-[#B7FF63] via-[#86F05C] to-[#0E8B6E]" : "from-[#86F05C] via-[#2BCA7A] to-[#0E8B6E]";

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

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      setValidationErrors([]); // Clear errors on step change
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setValidationErrors([]); // Clear errors on step change
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidationErrors([]);

    if (formData.password === formData.confirmPassword && formData.agreeTerms) {
      try {
        const { authService } = await import("./../services/auth.service");
        const response = await authService.signup({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });

        if (response.success && response.data?.token) {
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
            if (userRole === "TEACHER") window.location.href = "/teacher";
            else if (userRole === "SUPER_ADMIN") window.location.href = "/super-admin";
            else if (userRole === "BRANCH_ADMIN") window.location.href = "/branch-admin";
            else window.location.href = "/student";
          }, 500);
        } else {
          alert(response.message || "Signup failed. Please try again.");
        }
      } catch (error: any) {
        if (error.response?.data?.errors) {
          setValidationErrors(error.response.data.errors);
        } else {
          alert(error.response?.data?.message || "An error occurred during signup.");
        }
      }
    }
  };

  return (
    <main className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-[#081717] text-[#F3F7F6]" : "bg-[#F4FFF8] text-[#081717]"}`}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <header className={`flex flex-wrap items-center justify-between gap-3 rounded-[28px] border px-4 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.14)] sm:px-6 ${surface} ${border}`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${accent}`}>
              <span className="text-lg font-semibold text-[#081717]">EP</span>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-[#86F05C] uppercase">
                EduBranch Pro
              </p>
              <p className={`text-sm ${isDark ? "text-[#A9B7B4]" : "text-[#4B5A58]"}`}>
                Education management system
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={`rounded-full px-3 py-2 text-sm font-medium transition ${isDark ? "text-[#A9B7B4] hover:bg-[#0D2A2B]" : "text-[#4B5A58] hover:bg-[#EDF9F1]"}`}
            >
              Back to overview
            </Link>
            <button
              type="button"
              aria-label="Toggle color theme"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`rounded-full border px-3 py-2 text-sm font-medium transition ${border} ${isDark ? "hover:bg-[#0D2A2B]" : "hover:bg-[#EDF9F1]"}`}
            >
              {isDark ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className={`rounded-[32px] border p-6 shadow-[0_20px_60px_rgba(0,0,0,0.16)] sm:p-8 lg:p-10 ${surface} ${border}`}>
            <div className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${border} ${isDark ? "bg-[#0D2A2B] text-[#86F05C]" : "bg-[#EEFDF4] text-[#0E8B6E]"}`}>
              Enterprise-grade onboarding
            </div>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Build a modern campus experience from day one.
            </h1>
            <p className={`mt-4 max-w-2xl text-base leading-7 ${isDark ? "text-[#A9B7B4]" : "text-[#4B5A58]"}`}>
              Launch your institution with a secure workspace for teachers, staff, and administrators. Manage enrollment, communication, and analytics in a single elegant platform.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {metricCards.map((card) => (
                <div key={card.label} className={`rounded-[22px] border p-4 ${border} ${muted}`}>
                  <p className="text-2xl font-semibold text-[#F3F7F6]">{card.value}</p>
                  <p className={`mt-1 text-sm ${isDark ? "text-[#A9B7B4]" : "text-[#4B5A58]"}`}>{card.label}</p>
                </div>
              ))}
            </div>

            <div className={`mt-8 rounded-[24px] border p-5 ${border} ${isDark ? "bg-[#0D2A2B]" : "bg-[#F7FFF8]"}`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#86F05C]">
                  Launch readiness
                </p>
                <p className="text-sm font-semibold">92%</p>
              </div>
              <div className={`mt-3 h-2 overflow-hidden rounded-full ${isDark ? "bg-[#081717]" : "bg-[#E7F5EB]"}`}>
                <div className={`h-full w-[92%] rounded-full bg-gradient-to-r ${accent}`} />
              </div>
              <ul className="mt-4 space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className={`flex gap-3 text-sm ${isDark ? "text-[#A9B7B4]" : "text-[#4B5A58]"}`}>
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#2BCA7A]" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className={`rounded-[32px] border p-5 shadow-[0_20px_60px_rgba(0,0,0,0.16)] sm:p-7 lg:p-8 ${surface} ${border}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#86F05C]">
                  Step {currentStep} of 4
                </p>
                <h2 className="mt-1 text-2xl font-semibold">Create your workspace</h2>
              </div>
              <div className={`rounded-full border px-3 py-2 text-sm ${border} ${isDark ? "bg-[#0D2A2B]" : "bg-[#F7FFF8]"}`}>
                Secure onboarding
              </div>
            </div>

            <p className={`mt-4 text-sm ${isDark ? "text-[#A9B7B4]" : "text-[#4B5A58]"}`}>
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-[#86F05C] transition hover:text-[#B7FF63]">
                Sign in
              </Link>
            </p>

            <div className="mt-6 grid grid-cols-4 gap-2">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col gap-2">
                  <div className={`h-2 rounded-full ${step.id <= currentStep ? "bg-gradient-to-r " + accent : isDark ? "bg-[#0D2A2B]" : "bg-[#E7F5EB]"}`} />
                  <span className={`text-xs ${step.id <= currentStep ? "text-[#86F05C]" : isDark ? "text-[#A9B7B4]" : "text-[#4B5A58]"}`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>

            <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
              {validationErrors.length > 0 && (
                <div className={`rounded-2xl border px-4 py-3 text-sm border-[#EF4343]/50 bg-[#EF4343]/10 text-[#EF4343]`}>
                  <p className="font-semibold mb-1">Please fix the following errors:</p>
                  <ul className="list-disc pl-5">
                    {validationErrors.map((err, i) => (
                      <li key={i}>{err.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              {currentStep === 1 && (
                <>
                  <div>
                    <label htmlFor="fullName" className="mb-2 block text-sm font-medium">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Alicia Johnson"
                      className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${border} ${focus} ${isDark ? "bg-[#081717]" : "bg-white"}`}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="alicia@school.edu"
                      className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${border} ${focus} ${isDark ? "bg-[#081717]" : "bg-white"}`}
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="col-span-2">
                      <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="01712345678"
                        className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${border} ${focus} ${isDark ? "bg-[#081717]" : "bg-white"}`}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-medium">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${border} ${focus} ${isDark ? "bg-[#081717]" : "bg-white"}`}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${border} ${focus} ${isDark ? "bg-[#081717]" : "bg-white"}`}
                      required
                    />
                  </div>

                  <div className={`rounded-[22px] border p-4 ${border} ${muted}`}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Password strength</p>
                      <p className="text-sm font-semibold text-[#86F05C]">{passwordStrength.label}</p>
                    </div>
                    <div className={`mt-3 h-2 overflow-hidden rounded-full ${isDark ? "bg-[#081717]" : "bg-[#E7F5EB]"}`}>
                      <div className={`h-full rounded-full ${passwordStrength.tone}`} style={{ width: `${(passwordStrength.score / 4) * 100}%` }} />
                    </div>
                    <ul className="mt-4 space-y-2 text-sm">
                      {[
                        "8+ characters",
                        "One uppercase letter",
                        "One number",
                        "One special symbol",
                      ].map((item, index) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${passwordStrength.checks[index] ? "bg-[#2BCA7A]" : isDark ? "bg-[#1D3E3E]" : "bg-[#D5E8DD]"}`} />
                          <span className={isDark ? "text-[#A9B7B4]" : "text-[#4B5A58]"}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <div className={`rounded-[24px] border p-5 ${border} ${muted}`}>
                  <div className="flex items-start gap-3">
                    <input
                      id="agreeTerms"
                      name="agreeTerms"
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 rounded border-[#1D3E3E] text-[#86F05C] focus:ring-[#86F05C]"
                      required
                    />
                    <label htmlFor="agreeTerms" className="text-sm leading-6">
                      I agree to the Terms & Conditions and the Privacy Policy for EduBranch Pro. I understand that my data will be processed to provision the platform and support my onboarding journey.
                    </label>
                  </div>
                  <div className="mt-4 rounded-2xl border border-dashed border-[#2BCA7A] p-4 text-sm">
                    <p className="font-semibold">Included with your account</p>
                    <ul className="mt-2 space-y-2 text-[#A9B7B4]">
                      <li>• District-wide analytics dashboards</li>
                      <li>• Role-based permissions and SSO support</li>
                      <li>• Onboarding concierge and implementation playbooks</li>
                    </ul>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className={`rounded-[24px] border p-6 text-center ${border} ${isDark ? "bg-[#0D2A2B]" : "bg-[#F7FFF8]"}`}>
                  <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${accent}`}>
                    <span className="text-2xl font-semibold text-[#081717]">✓</span>
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold">You are ready to launch.</h3>
                  <p className={`mt-2 text-sm leading-6 ${isDark ? "text-[#A9B7B4]" : "text-[#4B5A58]"}`}>
                    Your EduBranch Pro workspace is being prepared for {formData.fullName || "your institution"}. A confirmation email has been sent to {formData.email || "your inbox"}.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link
                      href="/student"
                      className={`rounded-full px-4 py-2.5 text-sm font-semibold text-[#081717] transition ${isDark ? "bg-[#86F05C] hover:bg-[#B7FF63]" : "bg-[#2BCA7A] hover:bg-[#86F05C]"}`}
                    >
                      Go to dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${border} ${isDark ? "hover:bg-[#0D2A2B]" : "hover:bg-[#EEFDF4]"}`}
                    >
                      Start over
                    </button>
                  </div>
                </div>
              )}

              {currentStep < 4 && (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${border} ${isDark ? "hover:bg-[#0D2A2B] disabled:opacity-40" : "hover:bg-[#EEFDF4] disabled:opacity-40"}`}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={currentStep === 3 ? handleSubmit : handleNext}
                    className={`rounded-full px-5 py-2.5 text-sm font-semibold text-[#081717] transition ${isDark ? "bg-[#86F05C] hover:bg-[#B7FF63]" : "bg-[#2BCA7A] hover:bg-[#86F05C]"}`}
                  >
                    {currentStep === 3 ? "Create account" : "Continue"}
                  </button>
                </div>
              )}
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
