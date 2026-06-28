"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type BranchAdminUser = {
  name?: string;
  email?: string;
  role?: string;
};

export default function BranchAdminDashboard() {
  const router = useRouter();
  const [user] = useState<BranchAdminUser | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const userData = window.localStorage.getItem("user");
    const token = window.localStorage.getItem("token");

    if (!token || !userData) {
      return null;
    }

    try {
      return JSON.parse(userData) as BranchAdminUser;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const token = window.localStorage.getItem("token");
    const userData = window.localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    try {
      JSON.parse(userData) as BranchAdminUser;
    } catch {
      router.push("/login");
    }
  }, [router]);

  if (!user) {
    return <div className="flex h-screen items-center justify-center bg-[#081717] text-[#F3F7F6]">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#081717] text-[#F3F7F6]">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#1D3E3E] bg-[#0A2324] p-8 shadow-2xl">
          <h1 className="text-3xl font-bold">
            Welcome Branch Admin <span className="text-[#86F05C]">{user.name}</span>
          </h1>
          <p className="mt-4 text-[#A9B7B4]">
            This is your admin dashboard. You have successfully logged in.
          </p>
        </div>
      </main>
    </div>
  );
}
