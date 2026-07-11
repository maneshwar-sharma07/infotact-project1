import React, { useState } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";
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
  const { activeWorkspace, addChannelToWorkspace } = useWorkspace();

  const [channelName, setChannelName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      setSuccess("");

      const response = await api.post("/channels", {
        name: channelName.trim(),
        workspaceId: activeWorkspace.id,
      });

      const createdChannel = response.data?.data || response.data;
      addChannelToWorkspace(activeWorkspace.id, createdChannel);

      setChannelName("");
      setSuccess("Channel created");

      setTimeout(() => {
        setSuccess("");
        onClose();
      }, 650);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create channel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">

      <div className="w-[420px] rounded-2xl bg-[#111118] border border-[#1E293B] shadow-2xl shadow-black/40 animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1E293B]">

          <h2 className="text-xl font-bold text-white">
            Create Channel
          </h2>

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1 text-gray-400 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            <X size={22}/>
          </button>

        </div>

        {/* Body */}
        <div className="p-5">

          <label className="text-sm font-medium text-gray-300">
            Channel Name
          </label>

          <input
            type="text"
            value={channelName}
            onChange={(e) => {
              setChannelName(e.target.value);
              setError("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleCreate();
              }
            }}
            placeholder="general"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-[#0A0A0F] border border-[#2E303A] px-4 py-3 text-white outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-60"
          />

          {error && (
            <p className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          {success && (
            <p className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
              <CheckCircle2 size={16} />
              {success}
            </p>
          )}

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t border-[#1E293B]">

          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-gray-700 text-white transition hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={loading || !channelName.trim()}
            className="flex min-w-[108px] items-center justify-center gap-2 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50 text-white shadow-lg shadow-violet-600/20 transition"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Creating" : "Create"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default CreateChannelModal;
