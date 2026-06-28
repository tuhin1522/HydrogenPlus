"use client";

import { useEffect, useState, useCallback } from "react";
import { getAuditLogs } from "@/app/modules/super-admin/services/super-admin.service";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const params: Record<string, string> = { search, limit: "100" };
      if (entityFilter) params.entityType = entityFilter;
      const res = await getAuditLogs(params);
      setLogs(res?.data || []);
    } catch (error: any) {
      if (error?.response?.status !== 401 && error?.response?.status !== 403) {
        setToast({ msg: "Failed to load audit logs", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  }, [search, entityFilter]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="p-6 space-y-6">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg border text-sm font-medium shadow-lg ${toast.type === "success" ? "bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]" : "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]"}`}>
          {toast.msg}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-[#F2F2F2]">Audit Logs</h1>
        <p className="text-sm text-[#71717A] mt-1">Track system-wide administrative actions</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <input type="text" placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] bg-[#111010] border border-[#1C1917] rounded-lg px-4 py-2 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]" />
        <select value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)}
          className="bg-[#111010] border border-[#1C1917] rounded-lg px-3 py-2 text-sm text-[#F2F2F2] outline-none focus:border-[#22C55E]">
          <option value="">All Entities</option>
          <option value="User">User</option>
          <option value="Notification">Notification</option>
          <option value="SystemSetting">System Setting</option>
        </select>
      </div>

      <div className="rounded-xl border border-[#1C1917] bg-[#111010] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1C1917] text-[#71717A] text-xs">
              <th className="px-5 py-3 text-left font-medium uppercase">Action</th>
              <th className="px-5 py-3 text-left font-medium uppercase">Entity</th>
              <th className="px-5 py-3 text-left font-medium uppercase">Details</th>
              <th className="px-5 py-3 text-left font-medium uppercase">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1917]">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: 4 }).map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 bg-[#1C1917] rounded animate-pulse" /></td>)}</tr>
              ))
            ) : logs.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-16 text-center text-[#71717A]">No audit logs yet. Actions will appear here as admins make changes.</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#1C1917]/20">
                  <td className="px-5 py-4">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#27272A] text-[#A1A1AA]">{log.action}</span>
                  </td>
                  <td className="px-5 py-4 text-[#A1A1AA]">{log.entityType}{log.entityId ? ` · ${log.entityId.slice(0, 8)}…` : ""}</td>
                  <td className="px-5 py-4 text-[#71717A] max-w-md truncate">{log.details || "—"}</td>
                  <td className="px-5 py-4 text-[#71717A] whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
