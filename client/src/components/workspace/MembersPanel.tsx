import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import InviteMemberModal from "./InviteMemberModal";
import api from "../../services/api.ts";
import { useWorkspace } from "../../hooks/useWorkspace.ts";

interface Member {
  _id: string;
  name: string;
  email: string;
}

const MembersPanel: React.FC = () => {
  const [openInvite, setOpenInvite] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  const { activeWorkspace } = useWorkspace();

  useEffect(() => {
    if (!activeWorkspace) {
      setMembers([]);
      return;
    }

    fetchMembers();
  }, [activeWorkspace]);

  const fetchMembers = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/workspaces/${activeWorkspace?.id}/members`
      );

      setMembers(response.data.data || []);
    } catch (error) {
      console.error("Failed to load members:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[220px] h-screen bg-[#07070A] border-l border-[#1E1E2F] flex flex-col p-4">

      {/* Header */}

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

      {/* Members */}

      <div className="space-y-3 flex-1">

        {loading ? (
          <p className="text-xs text-gray-500">Loading...</p>
        ) : members.length === 0 ? (
          <p className="text-xs text-gray-500">No Members</p>
        ) : (
          members.map((member) => (
            <div
              key={member._id}
              className="flex items-center bg-[#111118] rounded-lg px-3 py-2 hover:bg-[#181820] transition"
            >
              <div className="flex items-center gap-3">

                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white font-semibold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>

                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-[#111118] bg-green-500" />
                </div>

                <div>
                  <p className="text-sm text-white font-medium">
                    {member.name}
                  </p>

                  <p className="text-xs text-gray-400">
                    {member.email}
                  </p>
                </div>

              </div>
            </div>
          ))
        )}

      </div>

      {/* Footer */}

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