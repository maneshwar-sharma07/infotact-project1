import React, { useState } from "react";
import { Plus } from "lucide-react";
import InviteMemberModal from "./InviteMemberModal";

const members = [
  {
    id: 1,
    name: "Jay Naik",
    role: "Admin",
    online: true,
  },
  {
    id: 2,
    name: "Dinesh Kumar",
    role: "Frontend",
    online: true,
  },
  {
    id: 3,
    name: "Abhishek",
    role: "Backend",
    online: false,
  },
];

const MembersPanel: React.FC = () => {
  const [openInvite, setOpenInvite] = useState(false);
  return (
    <div className="w-[220px] h-screen bg-[#07070A] border-l border-[#1E1E2F] flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">

        <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
          MEMBERS
        </h3>

        <button
          onClick={() => setOpenInvite(true)}
          className="p-1 rounded hover:bg-[#181820] transition"
          title="Invite Member"
        >
          <Plus size={16} className="text-[#64748B]" />
        </button>

      </div>
      <div className="space-y-3 flex-1">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between bg-[#111118] rounded-lg px-3 py-2 hover:bg-[#181820] transition"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white font-semibold">
                  {member.name.charAt(0)}
                </div>

                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-[#111118] ${
                    member.online ? "bg-green-500" : "bg-gray-500"
                  }`}
                />
              </div>

              <div>
                <p className="text-sm text-white font-medium">
                  {member.name}
                </p>

                <p className="text-xs text-gray-400">
                  {member.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[#1E1E2F] pt-3 text-center text-xs text-gray-500">
        {members.length} Members
      </div>

      <InviteMemberModal
      isOpen={openInvite}
      onClose={() => setOpenInvite(false)}
    />
    </div>
  );
};

export default MembersPanel;