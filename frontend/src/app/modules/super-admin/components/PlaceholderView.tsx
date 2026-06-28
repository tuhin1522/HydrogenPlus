import React from "react";

interface PlaceholderViewProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-[500px] text-center border border-[#27272A] bg-[#1C1917] rounded-2xl p-8 space-y-6">
      <div className="h-16 w-16 bg-[#27272A] rounded-full flex items-center justify-center text-2xl border border-[#27272A]">
        📂
      </div>
      <div>
        <h3 className="text-lg font-bold text-[#FAFAFA] capitalize">{activeTab} Control Center</h3>
        <p className="text-sm text-[#A1A1AA] max-w-md mt-2">
          This submodule is configured. In production, this allows site-wide oversight of active {activeTab} data models.
        </p>
      </div>
      <div className="p-4 bg-[#0D0B0A] rounded-xl border border-[#27272A] w-full max-w-lg text-left font-mono text-[11px] text-[#A1A1AA] space-y-1">
        <p className="text-[#22C55E]">// Sandbox mock data module details</p>
        <p>Status: Ready</p>
        <p>Environment: production-simulate</p>
        <p>Subsystem: EduBranch-Core-{activeTab}</p>
        <p>Security Audit: Passed</p>
      </div>
      <button
        onClick={() => setActiveTab("dashboard")}
        className="px-4 py-2 border border-[#27272A] text-sm text-[#FAFAFA] font-medium rounded-lg hover:bg-[#27272A] transition"
      >
        Return to overview
      </button>
    </div>
  );
};
