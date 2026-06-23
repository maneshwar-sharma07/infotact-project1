import React from 'react';
import { useWorkspace } from '../../hooks/useWorkspace.ts';
import { Plus, Hash } from 'lucide-react';
import type { IChannel } from '../../types/index.ts';

export const ChannelList: React.FC = () => {
  const { activeWorkspace, activeChannel, setActiveChannel } = useWorkspace();

  const channels = ((activeWorkspace?.channels || []) as any[]).filter(
    (chan) => chan && typeof chan === 'object' && 'name' in chan
  ) as IChannel[];

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
        <div className="flex items-center justify-between px-2 mb-2 text-[#64748B] hover:text-[#F1F5F9] transition-colors duration-200">
          <span className="text-[11px] font-body font-bold uppercase tracking-wider">Channels</span>
          <button
            className="p-1 hover:bg-white/5 rounded transition-all duration-200 cursor-pointer"
            onClick={() => console.log('Add channel clicked')}
            title="Create Channel"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Channels List */}
        <div className="flex flex-col gap-0.5">
          {channels.length === 0 ? (
            <span className="text-xs text-text-muted italic px-2">No channels</span>
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
    </div>
  );
};

export default ChannelList;
