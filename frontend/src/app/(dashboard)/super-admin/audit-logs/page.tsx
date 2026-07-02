"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { getAuditLogs } from "@/app/modules/super-admin/services/super-admin.service";

type AuditLogItem = {
  id: string;
  action: string;
  entityType?: string;
  entityId?: string;
  details?: string | null;
  createdAt: string;
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const params: Record<string, string> = { search, limit: "100" };
      if (entityFilter) params.entityType = entityFilter;
      const res = await getAuditLogs(params);
      setLogs(res?.data || []);
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status !== 401 && status !== 403) {
        toast.error("Failed to load audit logs");
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
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track system-wide administrative actions</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <input type="text" placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="min-w-[200px] flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground outline-none transition focus:border-primary" />
        <select value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary">
          <option value="">All Entities</option>
          <option value="User">User</option>
          <option value="Notification">Notification</option>
          <option value="SystemSetting">System Setting</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="px-5 py-3 text-left font-medium uppercase">Action</th>
              <th className="px-5 py-3 text-left font-medium uppercase">Entity</th>
              <th className="px-5 py-3 text-left font-medium uppercase">Details</th>
              <th className="px-5 py-3 text-left font-medium uppercase">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: 4 }).map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 animate-pulse rounded bg-muted/40" /></td>)}</tr>
              ))
            ) : logs.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-16 text-center text-muted-foreground">No audit logs yet. Actions will appear here as admins make changes.</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/20">
                  <td className="px-5 py-4">
                    <span className="rounded bg-muted/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">{log.action}</span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{log.entityType}{log.entityId ? ` · ${log.entityId.slice(0, 8)}…` : ""}</td>
                  <td className="max-w-md truncate px-5 py-4 text-muted-foreground">{log.details || "—"}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
