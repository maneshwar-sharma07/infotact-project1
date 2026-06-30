import React, { useState } from "react";

import { useWorkspace } from '../../hooks/useWorkspace.ts';
import { Plus, Hash, Search } from "lucide-react";
import type { IChannel } from '../../types/index.ts';
import CreateChannelModal from "./CreateChannelModal";

export const ChannelList: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const { activeWorkspace, activeChannel, setActiveChannel } = useWorkspace();

  const channels = (
  ((activeWorkspace?.channels || []) as any[])
    .filter(
      (chan) => chan && typeof chan === "object" && "name" in chan
    ) as IChannel[]
).filter((channel) =>
  channel.name.toLowerCase().includes(search.toLowerCase())
);

  return (
    <div className="w-[240px] h-screen bg-[#0B0B0F] border-r border-[#1E1E2F] flex flex-col select-none">
      {/* Workspace Header */}
      <div className="h-14 border-b border-[#1E1E2F] flex items-center justify-between px-4">
        <h2 className="text-sm font-heading font-bold text-[#F1F5F9] truncate" title={activeWorkspace?.name}>
          {activeWorkspace ? activeWorkspace.name : 'No Workspace'}
        </h2>
      </div>

      {/* Channels Section */}
      <div className="flex-1 overflow-y-auto px-2 py-4 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
      <div className="relative px-2 mb-2">

  <Search
    size={16}
    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
  />

  <input
    type="text"
    placeholder="Search..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
   className="
w-full
bg-[#111118]
border border-[#1E293B]
rounded-lg
pl-10
pr-3
py-2
text-sm
text-white
placeholder:text-gray-500
focus:outline-none
focus:border-[#7C3AED]
transition-all
duration-200
"
  />

</div>










        <div className="flex items-center justify-between px-2 mb-2 text-[#64748B] hover:text-[#F1F5F9] transition-colors duration-200">
          <span className="text-[11px] font-body font-bold uppercase tracking-wider">Channels</span>
          <button
            className="p-1 hover:bg-white/5 rounded transition-all duration-200 cursor-pointer"
            onClick={() => setOpenModal(true)}
            title="Create Channel"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Channels List */}
        <div className="flex flex-col gap-0.5">
          {channels.length === 0 ? (
            <span className="text-xs text-text-muted italic px-2">{search
                ? "No channels found"
                : "No channels"}</span>
          ) : (
            channels.map((chan) => {
              const isActive = activeChannel?.id === chan.id;

              return (
                <button
                  key={chan.id}
                  onClick={() => setActiveChannel(chan)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-[4px] text-sm font-body transition-all duration-200 cursor-pointer text-left
                    ${isActive 
                      ? 'bg-accent-primary/10 text-accent-primary font-semibold border-l-2 border-accent-primary pl-1.5' 
                      : 'text-[#64748B] hover:text-[#F1F5F9] hover:bg-white/5'
                    }`}
                >
                  <Hash size={14} className={isActive ? 'text-accent-primary' : 'text-[#64748B]'} />
                  <span className="truncate">{chan.name}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
      <CreateChannelModal
  isOpen={openModal}
  onClose={() => setOpenModal(false)}
/>
    </div>
  );
};

export default ChannelList;
