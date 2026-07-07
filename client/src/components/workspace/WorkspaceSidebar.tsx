import React, { useState } from "react";
import { Settings, Plus } from "lucide-react";
import { useWorkspace } from "../../hooks/useWorkspace.ts";

import CreateWorkspaceModal from "./CreateWorkspaceModal";
import WorkspaceSettingsModal from "./WorkspaceSettingsModal";
import UserProfileDropdown from "../user/UserProfileDropdown";

export const WorkspaceSidebar: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const {
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
  } = useWorkspace();

  const getWorkspaceInitials = (name: string) => {
    if (!name) return "";

    return name
      .trim()
      .split(/\s+/)
      .map((part) => part[0] || "")
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <aside className="w-[72px] h-screen bg-[#07070A] border-r border-[#1E1E2F] shadow-lg flex flex-col items-center py-4 justify-between">

      {/* Workspace List */}
      <div className="flex flex-col items-center gap-3 w-full overflow-y-auto scrollbar-none">

        {workspaces?.map((ws) => {
          const isActive = activeWorkspace?.id === ws.id;
          const initials = getWorkspaceInitials(ws.name);

          return (
            <div
              key={ws.id}
              className="relative group flex items-center justify-center w-full"
            >
              <button
                onClick={() => setActiveWorkspace(ws)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold transition-all duration-200
                ${
                  isActive
                    ? "bg-violet-600 shadow-lg border border-violet-400"
                    : "bg-[#111118] border border-[#1E293B] hover:bg-violet-600"
                }`}
              >
                {initials}
              </button>

              <div className="absolute left-[80px] whitespace-nowrap rounded-lg border border-[#1E293B] bg-[#111118] px-3 py-2 text-xs text-white opacity-0 pointer-events-none group-hover:opacity-100 transition">
                {ws.name}
              </div>
            </div>
          );
        })}

        {/* Add Workspace */}
        <div className="relative group">

          <button
            onClick={() => setOpenModal(true)}
            className="w-12 h-12 rounded-xl bg-[#111118] border border-[#1E293B] hover:bg-violet-600 transition"
          >
            <Plus size={20} className="mx-auto text-white" />
          </button>

          <div className="absolute left-[80px] whitespace-nowrap rounded-lg border border-[#1E293B] bg-[#111118] px-3 py-2 text-xs text-white opacity-0 pointer-events-none group-hover:opacity-100 transition">
            Add Workspace
          </div>

        </div>

      </div>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-3">

        <button
          onClick={() => setOpenSettings(true)}
          className="w-12 h-12 rounded-xl bg-[#111118] border border-[#1E293B] hover:bg-violet-600 transition"
        >
          <Settings size={20} className="mx-auto text-white" />
        </button>

        <UserProfileDropdown />

      </div>

      <CreateWorkspaceModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />

      <WorkspaceSettingsModal
        isOpen={openSettings}
        onClose={() => setOpenSettings(false)}
      />

    </aside>
  );
};

export default WorkspaceSidebar;