import React, { useState } from "react";
import { HelpCircle, LogOut, Plus, Settings } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useWorkspace } from "../../hooks/useWorkspace.ts";
import { useAuth } from "../../hooks/useAuth.ts";

import CreateWorkspaceModal from "./CreateWorkspaceModal";
import WorkspaceSettingsModal from "./WorkspaceSettingsModal";
import UserProfileDropdown from "../user/UserProfileDropdown";
import {
  getWorkspaceChannelCount,
  getWorkspaceGradient,
  getWorkspaceInitials,
  getWorkspaceMemberCount,
} from "../../utils/workspaceVisuals.ts";

export const WorkspaceSidebar: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const { logout } = useAuth();

  const {
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
  } = useWorkspace();

  const navButtonClass =
    "flex h-12 w-12 items-center justify-center rounded-2xl border border-[#23263A] bg-[#141621] text-[#A1A1AA] shadow-lg shadow-black/10 transition-colors duration-200 hover:border-[#8B5CF6]/60 hover:bg-[#181A24] hover:text-white hover:shadow-[#8B5CF6]/20";

  return (
    <aside className="workspace-sidebar relative flex h-dvh w-[72px] shrink-0 flex-col items-center overflow-visible rounded-r-[28px] border-r border-[#23263A] bg-[#0B0B11] py-6 shadow-2xl shadow-black/40">
      <div className="pointer-events-none absolute inset-y-6 right-0 w-px bg-gradient-to-b from-transparent via-[#8B5CF6]/30 to-transparent" />

      {/* Workspace List */}
      <div className="app-scrollbar flex min-h-0 w-full flex-1 flex-col items-center gap-4 overflow-y-auto overflow-x-visible px-3 pb-4">

        {workspaces?.map((ws) => {
          const isActive = activeWorkspace?.id === ws.id;
          const initials = getWorkspaceInitials(ws.name);
          const gradient = getWorkspaceGradient(ws.id);
          const memberCount = getWorkspaceMemberCount(ws);
          const channelCount = getWorkspaceChannelCount(ws);
          const unreadCount = Number((ws as any).unreadCount || 0);
          const hasUnread = !isActive && unreadCount > 0;

          return (
            <motion.div
              key={ws.id}
              className="group relative flex w-full items-center justify-center"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.22 }}
            >
              <motion.button
                onClick={() => setActiveWorkspace(ws)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className={`relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-sm font-black tracking-tight text-white shadow-lg transition-all duration-200
                ${
                  isActive
                    ? "border-2 border-white shadow-[#8B5CF6]/45 ring-4 ring-[#8B5CF6]/20"
                    : "border border-white/10 shadow-black/25 hover:border-white/40 hover:shadow-[#8B5CF6]/35"
                }`}
                aria-label={`Switch to ${ws.name}`}
              >
                {initials}
                {hasUnread && (
                  <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-[#0B0B11] bg-red-500 shadow-lg shadow-red-500/40" />
                )}
              </motion.button>

              <motion.span
                className="absolute left-0 h-8 w-1 rounded-r-full bg-white shadow-lg shadow-[#8B5CF6]/60"
                initial={false}
                animate={{ opacity: isActive ? 1 : 0, scaleY: isActive ? 1 : 0.5 }}
                transition={{ duration: 0.2 }}
              />

              <div className="pointer-events-none absolute left-[72px] z-50 min-w-[190px] translate-x-2 rounded-2xl border border-[#23263A] bg-[#141621] px-4 py-3 text-left opacity-0 shadow-2xl shadow-black/40 transition-all duration-200 group-hover:translate-x-4 group-hover:opacity-100">
                <p className="max-w-[180px] truncate text-sm font-bold text-white">
                  {ws.name}
                </p>
                <p className="mt-1 text-xs text-[#A1A1AA]">
                  Members: {memberCount}
                </p>
                <p className="text-xs text-[#A1A1AA]">
                  Channels: {channelCount}
                </p>
              </div>
            </motion.div>
          );
        })}

        {/* Add Workspace */}
        <div className="group relative">

          <motion.button
            onClick={() => setOpenModal(true)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-dashed border-[#6D4AFF]/50 bg-[#141621] text-[#A1A1AA] transition-colors duration-200 hover:border-[#8B5CF6] hover:bg-[#181A24] hover:text-white hover:shadow-lg hover:shadow-[#8B5CF6]/25"
          >
            <Plus size={20} />
          </motion.button>

          <div className="pointer-events-none absolute left-[72px] top-1/2 z-50 -translate-y-1/2 translate-x-2 whitespace-nowrap rounded-xl border border-[#23263A] bg-[#141621] px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-xl shadow-black/30 transition-all duration-200 group-hover:translate-x-4 group-hover:opacity-100">
            Add Workspace
          </div>

        </div>

      </div>

      {/* Bottom */}
      <div className="flex shrink-0 flex-col items-center gap-3 border-t border-[#23263A]/80 px-3 pt-4">

        <motion.button
          onClick={() => setOpenSettings(true)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          className={navButtonClass}
          aria-label="Settings"
        >
          <Settings size={20} />
        </motion.button>

        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }}>
          <UserProfileDropdown />
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          className={navButtonClass}
          aria-label="Help"
          title="Help"
        >
          <HelpCircle size={20} />
        </motion.button>

        <motion.button
          onClick={logout}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#23263A] bg-[#141621] text-[#A1A1AA] shadow-lg shadow-black/10 transition-colors duration-200 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300"
          aria-label="Logout"
        >
          <LogOut size={20} />
        </motion.button>

      </div>

      <AnimatePresence>
        <CreateWorkspaceModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        />

        <WorkspaceSettingsModal
          isOpen={openSettings}
          onClose={() => setOpenSettings(false)}
        />
      </AnimatePresence>

    </aside>
  );
};

export default WorkspaceSidebar;
