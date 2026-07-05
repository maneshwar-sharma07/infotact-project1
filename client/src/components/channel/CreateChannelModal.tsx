import React, { useState } from "react";
import { X } from "lucide-react";
import api from "../../services/api.ts";
import { useWorkspace } from "../../hooks/useWorkspace.ts";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateChannelModal: React.FC<Props> = ({
  isOpen,
  onClose,
}) => {
  const { activeWorkspace, fetchWorkspaces } = useWorkspace();

  const [channelName, setChannelName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!channelName.trim()) {
      setError("Channel name is required");
      return;
    }

    if (!activeWorkspace) {
      setError("No workspace selected");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/channels", {
        name: channelName.trim(),
        workspaceId: activeWorkspace.id,
      });

      await fetchWorkspaces();

      setChannelName("");

      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to create channel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">

      <div className="w-[420px] rounded-2xl bg-[#111118] border border-[#1E293B]">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1E293B]">

          <h2 className="text-xl font-bold text-white">
            Create Channel
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={22}/>
          </button>

        </div>

        {/* Body */}
        <div className="p-5">

          <label className="text-sm text-gray-400">
            Channel Name
          </label>

          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="general"
            className="mt-2 w-full rounded-xl bg-[#0A0A0F] border border-[#2E303A] px-4 py-3 text-white outline-none focus:border-violet-500"
          />

          {error && (
            <p className="mt-3 text-sm text-red-500">
              {error}
            </p>
          )}

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t border-[#1E293B]">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white"
          >
            {loading ? "Creating..." : "Create"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default CreateChannelModal;