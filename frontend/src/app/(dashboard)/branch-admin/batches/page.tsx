"use client";

import { useState } from "react";
import Link from "next/link";

type Batch = {
  id: string;
  name: string;
  class: string;
  capacity: number;
  enrolled: number;
  status: "ACTIVE" | "INACTIVE";
};

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([
    { id: "1", name: "Morning Batch A", class: "Class 10", capacity: 40, enrolled: 35, status: "ACTIVE" },
    { id: "2", name: "Evening Batch B", class: "Class 9", capacity: 30, enrolled: 28, status: "ACTIVE" },
    { id: "3", name: "Weekend Special", class: "Class 12", capacity: 50, enrolled: 12, status: "INACTIVE" },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = batches.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Batches</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage class batches and their capacities</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition flex items-center gap-2"
        >
          <span>+</span> Create Batch
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border">
        <div className="flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search batches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
        <select className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
          <option value="">All Classes</option>
          <option value="Class 9">Class 9</option>
          <option value="Class 10">Class 10</option>
          <option value="Class 11">Class 11</option>
          <option value="Class 12">Class 12</option>
        </select>
        <select className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Batch Name</th>
                <th className="px-6 py-4 font-medium">Class</th>
                <th className="px-6 py-4 font-medium">Capacity</th>
                <th className="px-6 py-4 font-medium">Enrolled</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((batch) => (
                <tr key={batch.id} className="hover:bg-muted/30 transition">
                  <td className="px-6 py-4 font-medium text-foreground">{batch.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{batch.class}</td>
                  <td className="px-6 py-4 text-muted-foreground">{batch.capacity}</td>
                  <td className="px-6 py-4 text-muted-foreground">{batch.enrolled}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        batch.status === "ACTIVE"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {batch.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="text-primary hover:underline text-xs font-medium">Edit</button>
                    <button className="text-destructive hover:underline text-xs font-medium">Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No batches found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {filtered.length} of {batches.length} entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-border rounded hover:bg-muted transition">Prev</button>
            <button className="px-3 py-1 bg-primary text-primary-foreground rounded">1</button>
            <button className="px-3 py-1 border border-border rounded hover:bg-muted transition">Next</button>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
              <h2 className="text-lg font-bold text-foreground">Create New Batch</h2>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setModalOpen(false); }}>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Batch Name *</label>
                <input required type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Class *</label>
                <select required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                  <option value="">Select Class...</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Capacity *</label>
                <input required type="number" min="1" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Status</label>
                <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90">Save Batch</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
