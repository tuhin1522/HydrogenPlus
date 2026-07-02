"use client";

import { useCallback, useEffect, useState } from "react";
import { studentService } from "@/app/modules/students/services/student.service";
import type { StudentDashboardOverview } from "@/app/modules/students/types";

export function useStudentDashboardOverview() {
  const [data, setData] = useState<StudentDashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const result = await studentService.getDashboardOverview();
      setData(result);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        await refresh();
      } finally {
        if (!isActive) {
          return;
        }
      }
    };

    void load();

    return () => {
      isActive = false;
    };
  }, [refresh]);

  return { data, loading, refresh };
}
