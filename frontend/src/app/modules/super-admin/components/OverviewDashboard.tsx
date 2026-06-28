import React from "react";

interface OverviewDashboardProps {
  students: any[];
  teachers: any[];
  branches: any[];
  batches: any[];
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  students,
  teachers,
  branches,
  batches,
}) => {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stat 1 */}
        <div className="rounded-xl border border-[#27272A] bg-[#1C1917] p-5">
          <div className="flex items-center justify-between text-xs text-[#A1A1AA] uppercase tracking-wider font-semibold">
            <span>Total Students</span>
            <span>🎓</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold">{students?.length || 0}</span>
            <span className="text-xs text-[#00D084] font-medium">Registered</span>
          </div>
        </div>
        {/* Stat 2 */}
        <div className="rounded-xl border border-[#27272A] bg-[#1C1917] p-5">
          <div className="flex items-center justify-between text-xs text-[#A1A1AA] uppercase tracking-wider font-semibold">
            <span>Total Teachers</span>
            <span>👩‍🏫</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold">{teachers?.length || 0}</span>
            <span className="text-xs text-[#00D084] font-medium">Active</span>
          </div>
        </div>
        {/* Stat 3 */}
        <div className="rounded-xl border border-[#27272A] bg-[#1C1917] p-5">
          <div className="flex items-center justify-between text-xs text-[#A1A1AA] uppercase tracking-wider font-semibold">
            <span>Total Courses/Batches</span>
            <span>📚</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold">{batches?.length || 0}</span>
            <span className="text-xs text-[#FCB900] font-medium">Available</span>
          </div>
        </div>
        {/* Stat 4 */}
        <div className="rounded-xl border border-[#27272A] bg-[#1C1917] p-5">
          <div className="flex items-center justify-between text-xs text-[#A1A1AA] uppercase tracking-wider font-semibold">
            <span>Active Branches</span>
            <span>🏢</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold">{branches?.length || 0}</span>
            <span className="text-xs text-[#00D084] font-medium">Operating</span>
          </div>
        </div>
      </div>

      {/* Recent Branches Overview */}
      <div className="rounded-xl border border-[#27272A] bg-[#1C1917] p-6">
        <h3 className="text-sm font-semibold mb-4 text-[#FAFAFA]">Active Branches System Check</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#27272A] text-[#A1A1AA]">
                <th className="pb-3 font-medium">Branch Name</th>
                <th className="pb-3 font-medium">Location</th>
                <th className="pb-3 font-medium">Contact</th>
                <th className="pb-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]/50">
              {branches?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[#A1A1AA]">
                    No branches currently active.
                  </td>
                </tr>
              ) : (
                branches?.map((branch) => (
                  <tr key={branch.id} className="hover:bg-[#0D0B0A]/30">
                    <td className="py-3 font-medium">{branch.name}</td>
                    <td className="py-3">{branch.location}</td>
                    <td className="py-3">{branch.phone || branch.email || "N/A"}</td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-[#00D084]/10 text-[#00D084] border border-[#00D084]/20 font-medium">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
