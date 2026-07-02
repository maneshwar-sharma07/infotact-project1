import React, { useState } from "react";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const InviteMemberModal: React.FC<Props> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");

  if (!isOpen) return null;

  const handleInvite = () => {
    alert(`Invitation sent to ${email}`);
    setEmail("");
    setRole("Member");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="w-[430px] rounded-2xl bg-[#111118] border border-[#1E293B] shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-[#1E293B]">

          <h2 className="text-lg font-bold text-white">
            Invite Member
          </h2>

          <button onClick={onClose}>
            <X size={20} className="text-gray-400 hover:text-white" />
          </button>

        </div>

        {/* Body */}
        <div className="p-5 space-y-4">

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="member@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-[#0A0A0F] border border-[#1E293B] p-3 text-white outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Role
            </label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg bg-[#0A0A0F] border border-[#1E293B] p-3 text-white"
            >
              <option>Member</option>
              <option>Admin</option>
            </select>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t border-[#1E293B]">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#1A1A24] hover:bg-[#232332]"
          >
            Cancel
          </button>

          <button
            onClick={handleInvite}
            className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700"
          >
            Invite
          </button>

        </div>

      </div>

    </div>
  );
};

export default InviteMemberModal;