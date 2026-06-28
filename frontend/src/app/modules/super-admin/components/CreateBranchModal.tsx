import React from "react";
import { CreateBranchPayload } from "../services/super-admin.service";

interface CreateBranchModalProps {
  branchForm: CreateBranchPayload;
  setBranchForm: (form: CreateBranchPayload) => void;
  handleCreateBranch: (e: React.FormEvent) => void;
  setShowBranchModal: (show: boolean) => void;
  actionLoading: boolean;
}

export const CreateBranchModal: React.FC<CreateBranchModalProps> = ({
  branchForm,
  setBranchForm,
  handleCreateBranch,
  setShowBranchModal,
  actionLoading,
}) => {
  return (
    <div className="fixed inset-0 bg-[#0D0B0A]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1C1917] border border-[#27272A] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-[#27272A] flex justify-between items-center">
          <h3 className="font-bold text-sm text-[#FAFAFA]">Create New Branch</h3>
          <button onClick={() => setShowBranchModal(false)} className="text-[#A1A1AA] hover:text-[#FAFAFA]">
            ✕
          </button>
        </div>

        <form onSubmit={handleCreateBranch} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">
              Branch Name *
            </label>
            <input
              type="text"
              required
              value={branchForm.name}
              onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
              placeholder="e.g. Dhaka central"
              className="w-full bg-[#0D0B0A] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-[#F2F2F2] outline-none focus:border-[#22C55E] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">
              Address *
            </label>
            <input
              type="text"
              required
              value={branchForm.address}
              onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
              placeholder="e.g. Mirpur, Dhaka"
              className="w-full bg-[#0D0B0A] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-[#F2F2F2] outline-none focus:border-[#22C55E] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">
              Contact Email
            </label>
            <input
              type="email"
              value={branchForm.email || ""}
              onChange={(e) => setBranchForm({ ...branchForm, email: e.target.value })}
              placeholder="e.g. contact@branch.com"
              className="w-full bg-[#0D0B0A] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-[#F2F2F2] outline-none focus:border-[#22C55E] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">
              Contact Phone
            </label>
            <input
              type="text"
              value={branchForm.phone || ""}
              onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })}
              placeholder="e.g. +8801700000000"
              className="w-full bg-[#0D0B0A] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-[#F2F2F2] outline-none focus:border-[#22C55E] transition"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowBranchModal(false)}
              className="px-4 py-2 text-xs font-semibold text-[#FAFAFA] hover:bg-[#27272A] rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2 bg-[#22C55E] text-[#052E16] text-xs font-bold rounded-lg hover:bg-[#22C55E]/90 transition disabled:opacity-50"
            >
              {actionLoading ? "Creating..." : "Save Branch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
