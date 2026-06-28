import React from "react";

interface CreateBranchAdminModalProps {
  adminForm: any;
  setAdminForm: (form: any) => void;
  handleCreateBranchAdmin: (e: React.FormEvent) => void;
  setShowAdminModal: (show: boolean) => void;
  actionLoading: boolean;
  teachers: any[];
  branches: any[];
}

export const CreateBranchAdminModal: React.FC<CreateBranchAdminModalProps> = ({
  adminForm,
  setAdminForm,
  handleCreateBranchAdmin,
  setShowAdminModal,
  actionLoading,
  teachers,
  branches,
}) => {
  return (
    <div className="fixed inset-0 bg-[#0D0B0A]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1C1917] border border-[#27272A] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-[#27272A] flex justify-between items-center">
          <h3 className="font-bold text-sm text-[#FAFAFA]">Assign Branch Admin</h3>
          <button onClick={() => setShowAdminModal(false)} className="text-[#A1A1AA] hover:text-[#FAFAFA]">
            ✕
          </button>
        </div>

        <form onSubmit={handleCreateBranchAdmin} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">
              Select Teacher (User) *
            </label>
            <select
              required
              value={adminForm.userId}
              onChange={(e) => setAdminForm({ ...adminForm, userId: e.target.value })}
              className="w-full bg-[#0D0B0A] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-[#F2F2F2] outline-none focus:border-[#22C55E] transition"
            >
              <option value="" disabled>
                -- Choose a teacher --
              </option>
              {teachers.map((t) => (
                <option key={t.id} value={t.userId}>
                  {t.user?.name} ({t.user?.email})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-[#A1A1AA] mt-1">Only active teachers can be promoted to Branch Admins.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">
              Assign to Branch *
            </label>
            <select
              required
              value={adminForm.branchId}
              onChange={(e) => setAdminForm({ ...adminForm, branchId: e.target.value })}
              className="w-full bg-[#0D0B0A] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-[#F2F2F2] outline-none focus:border-[#22C55E] transition"
            >
              <option value="" disabled>
                -- Choose a branch --
              </option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.location})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">
              Designation Title
            </label>
            <input
              type="text"
              value={adminForm.designation}
              onChange={(e) => setAdminForm({ ...adminForm, designation: e.target.value })}
              placeholder="e.g. Principal / Coordinator"
              className="w-full bg-[#0D0B0A] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-[#F2F2F2] outline-none focus:border-[#22C55E] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">
              Joining Date
            </label>
            <input
              type="date"
              value={adminForm.joiningDate}
              onChange={(e) => setAdminForm({ ...adminForm, joiningDate: e.target.value })}
              className="w-full bg-[#0D0B0A] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-[#F2F2F2] outline-none focus:border-[#22C55E] transition"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAdminModal(false)}
              className="px-4 py-2 text-xs font-semibold text-[#FAFAFA] hover:bg-[#27272A] rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2 bg-[#22C55E] text-[#052E16] text-xs font-bold rounded-lg hover:bg-[#22C55E]/90 transition disabled:opacity-50"
            >
              {actionLoading ? "Assigning..." : "Assign Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
