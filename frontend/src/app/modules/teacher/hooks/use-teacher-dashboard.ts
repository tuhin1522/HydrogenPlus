"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { teacherService, type TeacherDashboardOverview } from "../services/teacher-service";

export function useTeacherDashboard() {
  const [overview, setOverview] = useState<TeacherDashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const data = await teacherService.getDashboardOverview();
      if (mounted) {
        setOverview(data);
        setLoading(false);
        toast.success("Dashboard refreshed");
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return { overview, loading };
}
