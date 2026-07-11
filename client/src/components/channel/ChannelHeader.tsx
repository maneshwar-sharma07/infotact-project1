import React from "react";
import { useWorkspace } from "../../hooks/useWorkspace";
import NotificationDropdown from "../user/NotificationDropdown";
import { Hash, Search } from "lucide-react";

const ChannelHeader: React.FC = () => {
  const { activeWorkspace, activeChannel } = useWorkspace();

  const memberCount = activeWorkspace?.members?.length || 0;

  return (
    <header className="h-16 bg-[#111318] border-b border-[#202330] flex items-center justify-between px-6">

      {/* Left */}
      <div className="flex flex-col">

        <div className="flex items-center gap-2">
          <Hash size={20} className="text-violet-400" />

          <h2 className="text-white text-lg font-bold">
            {activeChannel?.name || "No Channel"}
          </h2>
        </div>

        <p className="text-xs text-slate-400">
          Workspace Collaboration Channel
        </p>

      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        <div className="px-3 py-1 rounded-full bg-[#1C1E26] text-xs text-slate-300">
          👥 {memberCount} Member{memberCount !== 1 ? "s" : ""}
        </div>

        <button
          className="w-10 h-10 rounded-xl bg-[#1C1E26] hover:bg-violet-600 transition flex items-center justify-center"
        >
          <Search size={18} />
        </button>

        <NotificationDropdown />

      </div>

    </header>
  );
};

export default ChannelHeader;