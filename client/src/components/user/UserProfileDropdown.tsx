import React, { useState } from "react";
import { User, Settings, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth.ts";

const UserProfileDropdown: React.FC = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex w-full justify-center">

      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-[#23263A] bg-[#141621] text-white shadow-lg shadow-black/10 transition-colors duration-200 hover:border-[#8B5CF6]/60 hover:bg-[#181A24] hover:shadow-[#8B5CF6]/20"
        aria-label="Open profile menu"
      >
        <span className="text-sm font-black">
          {(user?.name || "D").charAt(0).toUpperCase()}
        </span>
        <span className="absolute bottom-2 right-2 h-2.5 w-2.5 rounded-full border-2 border-[#141621] bg-emerald-400" />
      </button>

      <AnimatePresence>
        {open && (
        <motion.div
          initial={{ opacity: 0, x: -8, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: -8, y: 8, scale: 0.96 }}
          transition={{ duration: 0.18 }}
          className="absolute bottom-0 left-[64px] z-50 w-72 overflow-hidden rounded-2xl border border-[#23263A] bg-[#141621] shadow-2xl shadow-black/40"
        >

          {/* User Info */}
          <div className="border-b border-[#23263A] bg-gradient-to-br from-[#8B5CF6]/15 to-transparent px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-black text-white shadow-lg shadow-violet-500/20">
                {(user?.name || "D").charAt(0).toUpperCase()}
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#141621] bg-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-white">
                  {user?.name || "Dinesh Kumar"}
                </p>

                <p className="truncate text-xs text-[#A1A1AA]">
                  {user?.email || "dinesh@email.com"}
                </p>
              </div>
            </div>
          </div>

          {/* Menu */}

          <button className="flex w-full items-center gap-3 px-4 py-3 text-sm text-white transition hover:bg-[#181A24]">
            <User size={18}/>
            My Profile
          </button>

          <button className="flex w-full items-center gap-3 px-4 py-3 text-sm text-white transition hover:bg-[#181A24]">
            <Settings size={18}/>
            Settings
          </button>

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-300 transition hover:bg-red-500/10"
          >
            <LogOut size={18}/>
            Logout
          </button>

        </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default UserProfileDropdown;
