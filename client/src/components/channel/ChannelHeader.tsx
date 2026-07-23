import React from "react";
import { useWorkspace } from "../../hooks/useWorkspace";
import NotificationDropdown from "../user/NotificationDropdown";
import { Hash, Search, Pin, FolderOpen, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

const ChannelHeader: React.FC = () => {
  const { activeWorkspace, activeChannel } = useWorkspace();
  const memberCount = activeWorkspace?.members?.length || 0;
  const utilities = [{ icon: Search, label: "Search" }, { icon: Pin, label: "Pinned messages" }, { icon: FolderOpen, label: "Files" }];

  return (
    <header className="flex h-[72px] items-center justify-between border-b border-white/8 bg-[#101018]/90 px-5 backdrop-blur-xl lg:px-7">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Hash size={20} className="shrink-0 text-violet-400" />
          <h2 className="truncate text-lg font-bold tracking-tight text-white">{activeChannel?.name || "No Channel"}</h2>
        </div>
        <p className="mt-0.5 truncate text-xs text-slate-400">{activeWorkspace?.description || "Workspace collaboration channel"}</p>
      </div>

      <div className="ml-4 flex shrink-0 items-center gap-2">
        <div className="hidden rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 sm:flex">{memberCount} Member{memberCount !== 1 ? "s" : ""}</div>
        {utilities.map(({ icon: Icon, label }) => <motion.button key={label} whileTap={{ scale: 0.92 }} title={label} className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-slate-300 transition hover:border-violet-400/35 hover:bg-violet-500/15 hover:text-white md:flex"><Icon size={17} /></motion.button>)}
        <motion.button whileTap={{ scale: 0.95 }} title="Invite people" className="hidden h-10 items-center gap-2 rounded-xl bg-violet-600 px-3 text-xs font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500 sm:flex"><UserPlus size={16} /><span className="hidden lg:inline">Invite</span></motion.button>
        <NotificationDropdown />
      </div>
    </header>
  );
};

export default ChannelHeader;
