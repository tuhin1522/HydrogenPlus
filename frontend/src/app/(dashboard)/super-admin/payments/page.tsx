"use client";

import { useState } from "react";

// Mock data for payments dashboard
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

  const filteredPayments = MOCK_PAYMENTS.filter(p => {
    if (filterStatus && p.status !== filterStatus) return false;
    if (search && !p.student.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F2F2F2]">Payment Management</h1>
          <p className="text-sm text-[#71717A] mt-1">Track student fees, overdue balances, and revenue.</p>
        </div>
        <button className="px-4 py-2 bg-[#1C1917] text-[#F2F2F2] border border-[#27272A] text-sm font-medium rounded-lg hover:border-[#F2F2F2] transition">
          📥 Export CSV
        </button>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111010] border border-[#1C1917] rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">💰</div>
          <p className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-2">Total Revenue</p>
          <p className="text-3xl font-black text-[#22C55E]">৳45,200</p>
          <p className="text-xs text-[#22C55E] mt-2">↑ 12% from last month</p>
        </div>
        <div className="bg-[#111010] border border-[#1C1917] rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">⏳</div>
          <p className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-2">Pending Payments</p>
          <p className="text-3xl font-black text-[#F59E0B]">৳8,500</p>
          <p className="text-xs text-[#F59E0B] mt-2">14 transactions pending</p>
        </div>
        <div className="bg-[#111010] border border-[#1C1917] rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">⚠️</div>
          <p className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-2">Overdue Payments</p>
          <p className="text-3xl font-black text-[#EF4444]">৳12,000</p>
          <p className="text-xs text-[#EF4444] mt-2">Action required for 8 students</p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-[#111010] p-4 rounded-xl border border-[#1C1917]">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute inset-y-0 left-3 flex items-center text-[#71717A]">🔍</span>
          <input type="text" placeholder="Search student..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0D0B0A] border border-[#1C1917] rounded-lg pl-9 pr-4 py-2 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#0D0B0A] border border-[#1C1917] rounded-lg px-3 py-2 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
          <option value="">All Statuses</option>
          <option value="COMPLETED">Completed</option>
          <option value="PENDING">Pending</option>
          <option value="OVERDUE">Overdue</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      <div className="rounded-xl border border-[#1C1917] bg-[#111010] overflow-hidden shadow-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1C1917] bg-[#080706]">
              <th className="px-5 py-4 text-left font-semibold text-[#71717A] uppercase text-xs">Transaction ID</th>
              <th className="px-5 py-4 text-left font-semibold text-[#71717A] uppercase text-xs">Student</th>
              <th className="px-5 py-4 text-left font-semibold text-[#71717A] uppercase text-xs">Course / Item</th>
              <th className="px-5 py-4 text-center font-semibold text-[#71717A] uppercase text-xs">Amount</th>
              <th className="px-5 py-4 text-center font-semibold text-[#71717A] uppercase text-xs">Method</th>
              <th className="px-5 py-4 text-center font-semibold text-[#71717A] uppercase text-xs">Date</th>
              <th className="px-5 py-4 text-center font-semibold text-[#71717A] uppercase text-xs">Status</th>
              <th className="px-5 py-4 text-right font-semibold text-[#71717A] uppercase text-xs">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1917]">
            {filteredPayments.map((p) => (
              <tr key={p.id} className="hover:bg-[#1C1917]/30 transition group">
                <td className="px-5 py-4 font-mono text-[#71717A]">{p.id}</td>
                <td className="px-5 py-4 font-bold text-[#F2F2F2]">{p.student}</td>
                <td className="px-5 py-4 text-[#A1A1AA] max-w-[200px] truncate">{p.course}</td>
                <td className="px-5 py-4 text-center font-bold font-mono text-[#F2F2F2]">৳{p.amount}</td>
                <td className="px-5 py-4 text-center">
                  <span className="uppercase text-[10px] font-bold text-[#71717A] bg-[#1C1917] px-2 py-0.5 rounded border border-[#27272A]">{p.method}</span>
                </td>
                <td className="px-5 py-4 text-center text-[#71717A]">{new Date(p.date).toLocaleDateString()}</td>
                <td className="px-5 py-4 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider
                    ${p.status === 'COMPLETED' ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30' : 
                      p.status === 'PENDING' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30' : 
                      p.status === 'FAILED' ? 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30' :
                      'bg-[#EC4899]/10 text-[#EC4899] border border-[#EC4899]/30'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="text-xs text-[#A1A1AA] hover:text-[#F2F2F2] underline underline-offset-2">View</button>
                </td>
              </tr>
            ))}
            {filteredPayments.length === 0 && (
              <tr><td colSpan={8} className="px-5 py-16 text-center text-[#71717A]">No payments found matching your criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
