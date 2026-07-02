"use client";

import { useState } from "react";

const MOCK_PAYMENTS = [
  { id: "P101", student: "Rahim Islam", course: "HSC 2026 Crash Course", amount: 2500, status: "COMPLETED", date: "2026-06-25", method: "bkash" },
  { id: "P102", student: "Karim Khan", course: "SSC Target A+", amount: 1200, status: "PENDING", date: "2026-06-27", method: "nagad" },
  { id: "P103", student: "Jamil Hasan", course: "Physics Advanced", amount: 3000, status: "OVERDUE", date: "2026-06-15", method: "cash" },
  { id: "P104", student: "Aisha Siddiqua", course: "Chemistry Pro", amount: 2000, status: "COMPLETED", date: "2026-06-28", method: "bkash" },
  { id: "P105", student: "Fatima Begum", course: "Biology Olympiad", amount: 1500, status: "FAILED", date: "2026-06-28", method: "card" },
];

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredPayments = MOCK_PAYMENTS.filter((p) => {
    if (filterStatus && p.status !== filterStatus) return false;
    if (search && !p.student.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payment Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track student fees, overdue balances, and revenue.</p>
        </div>
        <button className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/40">
          📥 Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5">
          <div className="absolute right-0 top-0 p-4 text-6xl opacity-10">💰</div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Revenue</p>
          <p className="text-3xl font-black text-emerald-600">৳45,200</p>
          <p className="mt-2 text-xs text-emerald-600">↑ 12% from last month</p>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5">
          <div className="absolute right-0 top-0 p-4 text-6xl opacity-10">⏳</div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pending Payments</p>
          <p className="text-3xl font-black text-amber-600">৳8,500</p>
          <p className="mt-2 text-xs text-amber-600">14 transactions pending</p>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5">
          <div className="absolute right-0 top-0 p-4 text-6xl opacity-10">⚠️</div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Overdue Payments</p>
          <p className="text-3xl font-black text-destructive">৳12,000</p>
          <p className="mt-2 text-xs text-destructive">Action required for 8 students</p>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
        <div className="relative max-w-sm flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">🔍</span>
          <input type="text" placeholder="Search student..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm text-foreground outline-none transition focus:border-primary" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary">
          <option value="">All Statuses</option>
          <option value="COMPLETED">Completed</option>
          <option value="PENDING">Pending</option>
          <option value="OVERDUE">Overdue</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/20 text-xs text-muted-foreground">
              <th className="px-5 py-4 text-left font-semibold uppercase tracking-wider">Transaction ID</th>
              <th className="px-5 py-4 text-left font-semibold uppercase tracking-wider">Student</th>
              <th className="px-5 py-4 text-left font-semibold uppercase tracking-wider">Course / Item</th>
              <th className="px-5 py-4 text-center font-semibold uppercase tracking-wider">Amount</th>
              <th className="px-5 py-4 text-center font-semibold uppercase tracking-wider">Method</th>
              <th className="px-5 py-4 text-center font-semibold uppercase tracking-wider">Date</th>
              <th className="px-5 py-4 text-center font-semibold uppercase tracking-wider">Status</th>
              <th className="px-5 py-4 text-right font-semibold uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredPayments.map((p) => (
              <tr key={p.id} className="transition group hover:bg-muted/20">
                <td className="px-5 py-4 font-mono text-muted-foreground">{p.id}</td>
                <td className="px-5 py-4 font-bold text-foreground">{p.student}</td>
                <td className="max-w-[200px] truncate px-5 py-4 text-muted-foreground">{p.course}</td>
                <td className="px-5 py-4 text-center font-mono font-bold text-foreground">৳{p.amount}</td>
                <td className="px-5 py-4 text-center">
                  <span className="rounded border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">{p.method}</span>
                </td>
                <td className="px-5 py-4 text-center text-muted-foreground">{new Date(p.date).toLocaleDateString()}</td>
                <td className="px-5 py-4 text-center">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider ${p.status === "COMPLETED" ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600" : p.status === "PENDING" ? "border border-amber-500/30 bg-amber-500/10 text-amber-600" : p.status === "FAILED" ? "border border-destructive/30 bg-destructive/10 text-destructive" : "border border-pink-500/30 bg-pink-500/10 text-pink-600"}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="text-xs text-muted-foreground underline underline-offset-2 transition hover:text-foreground">View</button>
                </td>
              </tr>
            ))}
            {filteredPayments.length === 0 && (
              <tr><td colSpan={8} className="px-5 py-16 text-center text-muted-foreground">No payments found matching your criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
