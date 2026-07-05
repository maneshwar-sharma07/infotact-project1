import React from 'react';
import { useWorkspace } from '../../hooks/useWorkspace.ts';
import NotificationDropdown from "../user/NotificationDropdown";
import { Users, Search, Hash } from 'lucide-react';

export const ChannelHeader: React.FC = () => {
  const { activeWorkspace, activeChannel } = useWorkspace();

  const memberCount = activeWorkspace?.members?.length || 0;

  return (
    <div className="h-14 bg-[#0F0F16] border-b border-[#1E1E2F] flex items-center justify-between px-6 select-none w-full">
      {/* Channel Title & Info */}
      <div className="flex items-center gap-3 truncate">
        {activeChannel ? (
          <>
            <div className="flex items-center gap-1 text-[#F1F5F9] font-heading font-bold text-base truncate">
              <Hash size={18} className="text-[#64748B] flex-shrink-0" />
              <span className="truncate">{activeChannel.name}</span>
            </div>
            
            <div className="h-4 w-[1px] bg-[#1E1E2F]" />

            <div className="flex items-center gap-1 text-xs text-[#64748B] hover:text-[#F1F5F9] transition-colors duration-200 cursor-pointer">
              <Users size={14} />
              <span className="font-body font-medium">{memberCount}</span>
            </div>
          </>
        ) : (
          <span className="text-[#64748B] font-body text-sm italic">No channel selected</span>
        )}
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2">

        <button
          className="p-2 hover:bg-white/5 rounded-full text-[#64748B] hover:text-[#F1F5F9] transition-all duration-200 cursor-pointer"
          onClick={() => console.log("Search clicked")}
          title="Search"
        >
          <Search size={16} />
        </button>

        <NotificationDropdown />

      </div>
    </div>
  );
};

export default ChannelHeader;
