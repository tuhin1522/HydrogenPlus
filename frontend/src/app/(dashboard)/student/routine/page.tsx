"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/app/modules/students/components/PageShell";
import { studentService } from "@/app/modules/students/services/student.service";
import { toast } from "sonner";
import { ContentSkeleton } from "@/app/modules/teacher/components/ContentSkeleton";

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};

const getDayName = (day: string) => {
  return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
};

export default function StudentRoutinePage() {
  const [routines, setRoutines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const data = await studentService.getMyProfile();
        if (mounted && data?.data?.batch?.routines) {
          const allRoutines = data.data.batch.routines.map((routine: any) => ({
            id: routine.id,
            day: getDayName(routine.dayOfWeek),
            rawDay: routine.dayOfWeek,
            session: `${formatTime(routine.startTime)} - ${formatTime(routine.endTime)}`,
            subject: routine.batchSubject?.subject?.name || "Unknown Subject",
            teacher: routine.batchSubject?.teacher?.user?.name || "Unknown Teacher",
            room: routine.room,
            startTime: new Date(routine.startTime),
          }));
          
          // Sort routines by Day then Time
          const dayOrder: Record<string, number> = {
            MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3, THURSDAY: 4, FRIDAY: 5, SATURDAY: 6, SUNDAY: 7
          };
          
          allRoutines.sort((a: any, b: any) => {
            const dayDiff = (dayOrder[a.rawDay] || 0) - (dayOrder[b.rawDay] || 0);
            if (dayDiff !== 0) return dayDiff;
            return a.startTime.getTime() - b.startTime.getTime();
          });

          setRoutines(allRoutines);
        }
      } catch (error) {
        if (mounted) toast.error("Failed to load routine");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => { mounted = false; };
  }, []);

  // Calculate today's classes
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
  const todaysClasses = routines.filter(r => r.rawDay === today);

  return (
    <PageShell
      title="Routine"
      description="Review your weekly schedule, today’s classes, and upcoming live sessions."
      badge="Schedule"
    >
      {loading ? (
        <ContentSkeleton />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm h-fit">
            <h2 className="text-lg font-semibold text-foreground">Today’s classes</h2>
            <div className="mt-4 space-y-3">
              {todaysClasses.length > 0 ? (
                todaysClasses.map((cls) => (
                  <div key={cls.id} className="rounded-2xl border border-border/60 bg-background/70 p-3">
                    <p className="font-medium text-foreground">{cls.subject}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{cls.session.split(' - ')[0]} · {cls.teacher}</p>
                    {cls.room && <p className="text-xs text-muted-foreground mt-1">Room: {cls.room}</p>}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4 text-center">
                  <p className="text-sm text-muted-foreground">No classes scheduled for today.</p>
                </div>
              )}
            </div>
          </div>
          <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">Weekly timetable</h2>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-border/70">
              <table className="min-w-full divide-y divide-border text-sm">
                <thead className="bg-muted/60 text-left text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Day</th>
                    <th className="px-4 py-3 font-medium">Time</th>
                    <th className="px-4 py-3 font-medium">Subject</th>
                    <th className="px-4 py-3 font-medium">Teacher</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {routines.length > 0 ? (
                    routines.map((entry) => (
                      <tr key={entry.id} className="hover:bg-muted/30 transition">
                        <td className="px-4 py-3 font-medium text-foreground">{entry.day}</td>
                        <td className="px-4 py-3 text-muted-foreground">{entry.session}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {entry.subject}
                          {entry.room && <span className="block text-xs mt-0.5">Room {entry.room}</span>}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{entry.teacher}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                        Your batch currently has no routines assigned.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
