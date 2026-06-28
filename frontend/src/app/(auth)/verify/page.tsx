"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthShell from "@/app/modules/auth/components/auth-shell";
import { authService } from "@/app/modules/auth/services/auth.service";

type VerificationStatus = "loading" | "success" | "error";

interface VerificationResponse {
  success?: boolean;
  message?: string;
  data?: {
    token?: string;
    user?: {
      role?: string;
    };
  };
}

interface VerificationErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [status, setStatus] = useState<VerificationStatus>(() => (token ? "loading" : "error"));
  const [message, setMessage] = useState(() =>
    token ? "Verifying your email address..." : "Verification token is missing."
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    let isActive = true;

    const verify = async () => {
      try {
        const data = (await authService.verifyEmail(token)) as VerificationResponse;

        if (!isActive) return;

        if (data?.success) {
          setStatus("success");
          setMessage(data?.message || "Email verified successfully!");

          if (data.data?.token) {
            localStorage.setItem("token", data.data.token);
            if (data.data.user) {
              localStorage.setItem("user", JSON.stringify(data.data.user));
              window.dispatchEvent(new Event("storage"));
            }
          }

          setTimeout(() => {
            if (!isActive) return;

            const userData = localStorage.getItem("user");
            if (userData) {
              try {
                const user = JSON.parse(userData) as { role?: string };
                const role = user.role || "STUDENT";
                if (role === "TEACHER") router.push("/teacher");
                else if (role === "SUPER_ADMIN") router.push("/super-admin");
                else if (role === "BRANCH_ADMIN") router.push("/branch-admin");
                else router.push("/student");
                return;
              } catch {
                // Ignore
              }
            }
            router.push("/login");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data?.message || "Failed to verify email.");
        }
      } catch (error: unknown) {
        if (!isActive) return;

        const err = error as VerificationErrorResponse;
        setStatus("error");
        setMessage(err.response?.data?.message || "An error occurred during verification.");
      }
    };

    void verify();

    return () => {
      isActive = false;
    };
  }, [token, router]);

  return (
    <AuthShell
      title="Email Verification"
      subtitle="Checking your credentials"
      footerText="Need help?"
      footerLinkText="Contact support"
      footerHref="/login"
    >
      <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
        {status === "loading" && (
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        )}
        
        {status === "success" && (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/20 text-success">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}

        {status === "error" && (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error/20 text-error">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}

        <p className={`text-lg font-medium ${status === "error" ? "text-error" : status === "success" ? "text-success" : "text-foreground"}`}>
          {message}
        </p>
        
        {status === "success" && (
          <p className="text-sm text-muted-foreground">Redirecting you shortly...</p>
        )}
      </div>
    </AuthShell>
  );
}
