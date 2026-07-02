"use client";

import { useState } from "react";

type Payment = {
  id: string;
  studentName: string;
  studentId: string;
  type: string;
  amount: number;
  method: "CASH" | "BKASH" | "NAGAD" | "CARD";
  status: "PAID" | "DUE" | "PARTIAL";
  date: string;
};

const MOCK_PAYMENTS: Payment[] = [
  { id: "1", studentName: "Arif Hossain", studentId: "STU-2024-001", type: "Monthly Fee", amount: 1500, method: "BKASH", status: "PAID", date: "2025-07-01" },
  { id: "2", studentName: "Fatema Akter", studentId: "STU-2024-002", type: "Course Fee", amount: 1200, method: "CASH", status: "PAID", date: "2025-07-02" },
  { id: "3", studentName: "Mehedi Hasan", studentId: "STU-2024-003", type: "Monthly Fee", amount: 1500, method: "NAGAD", status: "DUE", date: "—" },
  { id: "4", studentName: "Sadia Islam", studentId: "STU-2024-004", type: "Monthly Fee", amount: 1500, method: "CASH", status: "PARTIAL", date: "2025-06-28" },
  { id: "5", studentName: "Tanvir Ahmed", studentId: "STU-2024-005", type: "Course Fee", amount: 800, method: "CARD", status: "PAID", date: "2025-07-03" },
];

const STATUS_COLORS: Record<string, string> = {
  PAID: "bg-green-500/10 text-green-500",
  DUE: "bg-red-500/10 text-red-500",
  PARTIAL: "bg-yellow-500/10 text-yellow-500",
};

const METHOD_ICONS: Record<string, string> = {
  CASH: "💵", BKASH: "📱", NAGAD: "📲", CARD: "💳",
};

const TABS = ["All Payments", "Due Payments", "Statistics"];

export default function PaymentsPage() {
  const [payments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [activeTab, setActiveTab] = useState("All Payments");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [manualModal, setManualModal] = useState(false);

  const filtered = payments.filter((p) => {
    const matchSearch =
      p.studentName.toLowerCase().includes(search.toLowerCase()) ||
      p.studentId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? p.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const duePayments = payments.filter((p) => p.status === "DUE" || p.status === "PARTIAL");
  const totalRevenue = payments.filter((p) => p.status === "PAID").reduce((sum, p) => sum + p.amount, 0);
  const dueAmount = duePayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="text-sm text-muted-foreground mt-1">Track fees, collections and dues</p>
        </div>
        <button
          onClick={() => setManualModal(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition"
        >
          + Manual Payment
        </button>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Total Collected</p>
          <p className="text-2xl font-bold text-green-500">৳{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Due Amount</p>
          <p className="text-2xl font-bold text-red-500">৳{dueAmount.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Total Transactions</p>
          <p className="text-2xl font-bold text-foreground">{payments.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition ${
              activeTab === tab
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {(activeTab === "All Payments" || activeTab === "Due Payments") && (
        <>
          {/* Filters */}
          <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-[200px] bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
            {activeTab === "All Payments" && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              >
                <option value="">All Status</option>
                <option>PAID</option>
                <option>DUE</option>
                <option>PARTIAL</option>
              </select>
            )}
          </div>

          {/* Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[700px]">
                <thead className="bg-muted/50 text-muted-foreground uppercase text-xs border-b border-border">
                  <tr>
                    <th className="px-5 py-3 font-medium">Student</th>
                    <th className="px-5 py-3 font-medium">Type</th>
                    <th className="px-5 py-3 font-medium">Amount</th>
                    <th className="px-5 py-3 font-medium">Method</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(activeTab === "Due Payments" ? duePayments : filtered).map((pay) => (
                    <tr key={pay.id} className="hover:bg-muted/30 transition">
                      <td className="px-5 py-4">
                        <p className="font-medium text-foreground">{pay.studentName}</p>
                        <p className="text-xs text-muted-foreground font-mono">{pay.studentId}</p>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{pay.type}</td>
                      <td className="px-5 py-4 font-semibold text-foreground">৳{pay.amount}</td>
                      <td className="px-5 py-4 text-muted-foreground">
                        <span>{METHOD_ICONS[pay.method]} {pay.method}</span>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground text-xs">{pay.date}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[pay.status]}`}>
                          {pay.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {pay.status !== "PAID" && (
                          <button className="text-xs text-primary hover:underline font-medium">Collect</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === "Statistics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-5">Payment Methods</h3>
            <div className="space-y-3">
              {[
                { method: "BKASH", icon: "📱", amount: 1500, pct: 40 },
                { method: "CASH", icon: "💵", amount: 1200, pct: 32 },
                { method: "CARD", icon: "💳", amount: 800, pct: 21 },
                { method: "NAGAD", icon: "📲", amount: 0, pct: 7 },
              ].map(({ method, icon, amount, pct }) => (
                <div key={method}>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{icon} {method}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-5">Monthly Income</h3>
            <div className="space-y-2">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((m, i) => {
                const amt = [12000, 14500, 13200, 15800, 16200, 14900, 4700][i];
                const max = 17000;
                return (
                  <div key={m} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-6">{m}</span>
                    <div className="flex-1 h-5 bg-muted rounded overflow-hidden">
                      <div
                        className="h-full bg-primary/70 rounded transition-all"
                        style={{ width: `${(amt / max) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground w-14 text-right">৳{(amt / 1000).toFixed(1)}k</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Manual Payment Modal */}
      {manualModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Record Manual Payment</h2>
              <button onClick={() => setManualModal(false)} className="text-muted-foreground hover:text-foreground text-xl">✕</button>
            </div>
            <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setManualModal(false); }}>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Student *</label>
                <select required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                  <option value="">Select student...</option>
                  <option>Arif Hossain</option>
                  <option>Fatema Akter</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Amount (৳) *</label>
                  <input required type="number" min="1" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Method *</label>
                  <select required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                    <option>CASH</option>
                    <option>BKASH</option>
                    <option>NAGAD</option>
                    <option>CARD</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Payment Type</label>
                <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                  <option>Monthly Fee</option>
                  <option>Course Fee</option>
                  <option>Exam Fee</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Note</label>
                <textarea rows={2} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setManualModal(false)} className="px-4 py-2 text-sm text-muted-foreground">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90">Record Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
