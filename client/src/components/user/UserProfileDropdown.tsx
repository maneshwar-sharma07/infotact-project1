import React, { useState } from "react";
import { User, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.ts";

const UserProfileDropdown: React.FC = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex justify-center w-full">

      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-xl bg-[#111118] border border-[#1E293B] hover:border-violet-500 flex items-center justify-center transition"
      >
        <span className="text-white font-bold">
          {(user?.name || "D").charAt(0).toUpperCase()}
        </span>
      </button>

      {open && (
        <div className="absolute bottom-16 left-16 w-64 rounded-xl bg-[#111118] border border-[#1E293B] shadow-2xl overflow-hidden z-50">

          {/* User Info */}
          <div className="px-4 py-4 border-b border-[#1E293B]">
            <p className="font-semibold text-white">
              {user?.name || "Dinesh Kumar"}
            </p>

            <p className="text-xs text-gray-400">
              {user?.email || "dinesh@email.com"}
            </p>
          </div>

          {/* Menu */}

          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1A1A24] text-white">
            <User size={18}/>
            My Profile
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1A1A24] text-white">
            <Settings size={18}/>
            Settings
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10"
          >
            <LogOut size={18}/>
            Logout
          </button>

        </div>
      )}

    </div>
  );
};

export default UserProfileDropdown;