import React, { useState } from "react";
import { X, Copy, Link } from "lucide-react";
import api from "../../services/api.ts";
import { useWorkspace } from "../../hooks/useWorkspace.ts";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const InviteMemberModal: React.FC<Props> = ({
  isOpen,
  onClose,
}) => {
  const { activeWorkspace } = useWorkspace();

  const [inviteLink, setInviteLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!activeWorkspace) {
      setError("No workspace selected");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCopied(false);

      const response = await api.post("/workspaces/invite", {
        workspaceId: activeWorkspace.id,
      });

      const data = response.data;

      const fullLink = `http://localhost:5000${data.inviteLink}`;

      setInviteLink(fullLink);
    } catch (err) {
      console.error(err);
      setError("Failed to generate invite link");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!inviteLink) return;

    await navigator.clipboard.writeText(inviteLink);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="w-[450px] rounded-2xl bg-[#111118] border border-[#1E293B] shadow-xl">

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

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full rounded-lg bg-violet-600 hover:bg-violet-700 py-3 text-white font-medium disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Invite Link"}
          </button>

          {inviteLink && (
            <>
              <div className="rounded-lg bg-[#0A0A0F] border border-[#1E293B] p-3 break-all text-sm text-white">
                <div className="flex items-center gap-2 mb-2 text-violet-400">
                  <Link size={16} />
                  Invite Link
                </div>

                {inviteLink}
              </div>

              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#1A1A24] hover:bg-[#232332] py-3"
              >
                <Copy size={16} />
                {copied ? "Copied!" : "Copy Invite Link"}
              </button>
            </>
          )}

          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}

        </div>

        {/* Footer */}

        <div className="flex justify-end p-5 border-t border-[#1E293B]">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#1A1A24] hover:bg-[#232332]"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
};

export default InviteMemberModal;