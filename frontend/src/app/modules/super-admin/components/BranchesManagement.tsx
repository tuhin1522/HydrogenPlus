import React from "react";

interface BranchesManagementProps {
  branches: any[];
  branchAdmins: any[];
  setShowBranchModal: (show: boolean) => void;
  setShowAdminModal: (show: boolean) => void;
}

export const BranchesManagement: React.FC<BranchesManagementProps> = ({
  branches,
  branchAdmins,
  setShowBranchModal,
  setShowAdminModal,
}) => {
  return (
    <div className="space-y-10">
      {/* Branches Section Header */}
      <div className="flex items-center justify-between border-b border-[#27272A] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#FAFAFA]">Coaching Branches</h2>
          <p className="text-xs text-[#A1A1AA] mt-1">Manage physical institute branch setups across the platform</p>
        </div>
        <button
          onClick={() => setShowBranchModal(true)}
          className="px-4 py-2 bg-[#22C55E] text-[#052E16] rounded-lg text-xs font-semibold hover:opacity-90 transition duration-150"
        >
          + Create Branch
        </button>
      </div>

      {/* Branches Table */}
      <div className="rounded-xl border border-[#27272A] bg-[#1C1917] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#27272A]/40 text-[#A1A1AA] border-b border-[#27272A]">
                <th className="p-4 font-semibold uppercase tracking-wider">Branch Name</th>
                <th className="p-4 font-semibold uppercase tracking-wider">Location</th>
                <th className="p-4 font-semibold uppercase tracking-wider">Email Contact</th>
                <th className="p-4 font-semibold uppercase tracking-wider">Phone contact</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-right">Config</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]/70">
              {branches.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#A1A1AA]">
                    No branch configurations found. Click "+ Create Branch" to spin up a new platform entity.
                  </td>
                </tr>
              ) : (
                branches.map((b) => (
                  <tr key={b.id} className="hover:bg-[#0D0B0A]/20">
                    <td className="p-4 font-bold text-[#FAFAFA]">{b.name}</td>
                    <td className="p-4 text-[#A1A1AA]">{b.location}</td>
                    <td className="p-4 text-[#A1A1AA]">{b.email || "N/A"}</td>
                    <td className="p-4 text-[#A1A1AA]">{b.phone || "N/A"}</td>
                    <td className="p-4 text-right">
                      <button className="text-[#EF4444] hover:underline hover:opacity-85 font-medium">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Branch Admins Section Header */}
      <div className="flex items-center justify-between border-b border-[#27272A] pb-4 pt-4">
        <div>
          <h2 className="text-xl font-bold text-[#FAFAFA]">Branch Administrative Roles</h2>
          <p className="text-xs text-[#A1A1AA] mt-1">Assign verified academic teachers to manage specific location panels</p>
        </div>
        <button
          onClick={() => setShowAdminModal(true)}
          className="px-4 py-2 bg-[#22C55E] text-[#052E16] rounded-lg text-xs font-semibold hover:opacity-90 transition duration-150"
        >
          + Assign Branch Admin
        </button>
      </div>

      {/* Branch Admins Table */}
      <div className="rounded-xl border border-[#27272A] bg-[#1C1917] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#27272A]/40 text-[#A1A1AA] border-b border-[#27272A]">
                <th className="p-4 font-semibold uppercase tracking-wider">Admin Name</th>
                <th className="p-4 font-semibold uppercase tracking-wider">Email Address</th>
                <th className="p-4 font-semibold uppercase tracking-wider">Assigned Branch</th>
                <th className="p-4 font-semibold uppercase tracking-wider">Title / Designation</th>
                <th className="p-4 font-semibold uppercase tracking-wider">Joining Date</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-right">Config</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]/70">
              {branchAdmins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#A1A1AA]">
                    No administrative roles set up. Assign an active teacher using "+ Assign Branch Admin".
                  </td>
                </tr>
              ) : (
                branchAdmins.map((adm) => (
                  <tr key={adm.id} className="hover:bg-[#0D0B0A]/20">
                    <td className="p-4 font-bold text-[#FAFAFA]">{adm.user?.name || "N/A"}</td>
                    <td className="p-4 text-[#A1A1AA]">{adm.user?.email || "N/A"}</td>
                    <td className="p-4 text-[#22C55E] font-medium">{adm.branch?.name || "N/A"}</td>
                    <td className="p-4 text-[#FAFAFA]">{adm.designation || "Branch Admin"}</td>
                    <td className="p-4 text-[#A1A1AA]">
                      {adm.joiningDate ? new Date(adm.joiningDate).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-[#EF4444] hover:underline font-medium">Revoke Role</button>
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
