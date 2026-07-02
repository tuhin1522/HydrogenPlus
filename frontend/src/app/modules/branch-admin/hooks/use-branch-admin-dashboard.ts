"use client";

import { useEffect, useState } from "react";
import { branchAdminService, type BranchAdminDashboardData } from "../services/branch-admin.service";

export function useBranchAdminDashboard() {
  const [data, setData] = useState<BranchAdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const dashboardData = await branchAdminService.getDashboardOverview();
        if (isMounted) {
          setData(dashboardData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unable to load dashboard data");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}
