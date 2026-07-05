import React, { useState } from "react";
import { Settings, Menu } from "lucide-react";

import WorkspaceSettingsModal from "./WorkspaceSettingsModal";
import UserProfileDropdown from "../user/UserProfileDropdown";

export const WorkspaceSidebar: React.FC = () => {
  const [openSettings, setOpenSettings] = useState(false);

  return (
    <aside className="w-[72px] h-screen bg-[#08090D] border-r border-[#1E293B] flex flex-col justify-between">

      {/* Top Section */}
      <div className="flex flex-col items-center gap-4 py-4">

        {/* Menu Button (Future Sidebar Toggle) */}
        <button
          className="w-12 h-12 rounded-xl bg-[#151720] border border-[#1E293B]
          text-[#94A3B8] hover:bg-violet-600 hover:text-white
          transition-all duration-200"
        >
          <Menu size={20} className="mx-auto" />
        </button>

      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center gap-3 pb-4">

        {/* Settings */}
        <button
          onClick={() => setOpenSettings(true)}
          className="w-12 h-12 rounded-xl bg-[#151720] border border-[#1E293B]
          text-[#94A3B8] hover:bg-violet-600 hover:text-white
          transition-all duration-200"
        >
          <Settings size={20} className="mx-auto" />
        </button>

        {/* User Profile */}
        <UserProfileDropdown />

      </div>

      {/* Workspace Settings Modal */}
      <WorkspaceSettingsModal
        isOpen={openSettings}
        onClose={() => setOpenSettings(false)}
      />

    </aside>
  );
};

export default WorkspaceSidebar;