import React from "react";
import { useWorkspace } from "../../hooks/useWorkspace.ts";
import NotificationDropdown from "../user/NotificationDropdown";
import { Users, Search, Hash } from "lucide-react";

export const ChannelHeader: React.FC = () => {
  const { activeWorkspace, activeChannel } = useWorkspace();

  const memberCount = activeWorkspace?.members?.length || 0;

  return (
    <header className="h-16 bg-[#111118] border-b border-[#1E293B] flex items-center justify-between px-6 shadow-sm">

      {/* Left */}
      <div className="flex items-center gap-4 overflow-hidden">

        {activeChannel ? (
          <>
            {/* Channel Name */}
            <div className="flex items-center gap-2">

              <Hash
                size={20}
                className="text-violet-400 flex-shrink-0"
              />

              <h2 className="text-white text-lg font-semibold truncate">
                {activeChannel.name}
              </h2>

            </div>

            {/* Divider */}

            <div className="w-px h-6 bg-[#2A2A35]" />

            {/* Members */}

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A24] border border-[#2A2A35]">

              <Users
                size={15}
                className="text-[#94A3B8]"
              />

              <span className="text-sm text-[#CBD5E1] font-medium">
                {memberCount} Member{memberCount !== 1 ? "s" : ""}
              </span>

            </div>
          </>
        ) : (
          <span className="text-[#64748B] text-sm italic">
            No channel selected
          </span>
        )}
      </div>

      {/* Right */}

      <div className="flex items-center gap-3">

        {/* Search */}

        <button
          onClick={() => console.log("Search")}
          className="w-10 h-10 rounded-xl bg-[#1A1A24] border border-[#2A2A35] flex items-center justify-center text-[#94A3B8] hover:text-white hover:border-violet-500 hover:bg-violet-500/10 transition-all duration-200"
          title="Search"
        >
          <Search size={18} />
        </button>

        {/* Notifications */}

        <NotificationDropdown />

      </div>

    </header>
  );
};

export default ChannelHeader;