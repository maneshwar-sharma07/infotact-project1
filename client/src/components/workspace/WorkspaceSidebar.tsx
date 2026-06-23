import React from 'react';
import { useWorkspace } from '../../hooks/useWorkspace.ts';
import { Settings, Plus } from 'lucide-react';

export const WorkspaceSidebar: React.FC = () => {
  const { workspaces, activeWorkspace, setActiveWorkspace } = useWorkspace();

  const getWorkspaceInitials = (name: string) => {
    return name
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="w-[72px] h-screen bg-[#07070A] border-r border-[#1E1E2F] flex flex-col items-center py-4 justify-between select-none">
      {/* Workspaces List Container */}
      <div className="flex flex-col items-center gap-3 w-full overflow-y-auto scrollbar-none">
        {workspaces.map((ws) => {
          const isActive = activeWorkspace?.id === ws.id;
          const initials = getWorkspaceInitials(ws.name);

          return (
            <div key={ws.id} className="relative group flex items-center justify-center w-full">
              {/* Active indicator bar */}
              <div 
                className={`absolute left-0 w-1 bg-accent-primary rounded-r transition-all duration-300
                  ${isActive ? 'h-8' : 'h-2 scale-0 group-hover:scale-100 group-hover:h-5'}`}
              />

              {/* Workspace Avatar */}
              <button
                onClick={() => setActiveWorkspace(ws)}
                className={`w-12 h-12 rounded-[12px] flex items-center justify-center text-white text-base font-heading font-semibold transition-all duration-300 cursor-pointer
                  ${isActive 
                    ? 'bg-accent-primary rounded-[8px] shadow-[0_0_12px_rgba(124,58,237,0.5)] border border-accent-primary' 
                    : 'bg-[#111118] hover:bg-accent-primary hover:rounded-[8px] border border-[#1E293B] hover:border-accent-primary/50'
                  }`}
              >
                {initials}
              </button>

              {/* Tooltip */}
              <div className="absolute left-[80px] bg-[#111118] text-[#F1F5F9] text-xs font-semibold py-1.5 px-3 rounded-[4px] border border-[#1E293B] shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 font-body">
                {ws.name}
              </div>
            </div>
          );
        })}

        {/* Plus Button to Create Workspace */}
        <div className="relative group flex items-center justify-center w-full mt-1">
          <button
            className="w-12 h-12 rounded-[12px] bg-[#111118] border border-[#1E293B] hover:border-accent-primary/50 hover:bg-accent-primary/20 text-[#64748B] hover:text-white flex items-center justify-center transition-all duration-300 hover:rounded-[8px] cursor-pointer"
            onClick={() => console.log('Create workspace clicked')}
          >
            <Plus size={20} />
          </button>
          <div className="absolute left-[80px] bg-[#111118] text-[#F1F5F9] text-xs font-semibold py-1.5 px-3 rounded-[4px] border border-[#1E293B] shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 font-body">
            Add Workspace
          </div>
        </div>
      </div>

      {/* Settings at the Bottom */}
      <div className="relative group flex items-center justify-center w-full">
        <button
          className="w-12 h-12 rounded-[12px] bg-[#111118] border border-[#1E293B] hover:border-accent-primary/50 hover:bg-accent-primary/20 text-[#64748B] hover:text-white flex items-center justify-center transition-all duration-300 hover:rounded-[8px] cursor-pointer"
          onClick={() => console.log('Settings clicked')}
        >
          <Settings size={20} />
        </button>
        <div className="absolute left-[80px] bg-[#111118] text-[#F1F5F9] text-xs font-semibold py-1.5 px-3 rounded-[4px] border border-[#1E293B] shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 font-body">
          Settings
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSidebar;
