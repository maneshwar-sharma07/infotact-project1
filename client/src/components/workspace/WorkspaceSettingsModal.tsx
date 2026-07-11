import React, { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import api from "../../services/api.ts";
import { useToast } from "../ui/ToastProvider.tsx";
import { useWorkspace } from "../../hooks/useWorkspace.ts";
import type { IWorkspace } from "../../types/index.ts";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const WorkspaceSettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { activeWorkspace, updateWorkspace } = useWorkspace();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setName(activeWorkspace?.name || "");
    setDescription(activeWorkspace?.description || "");
    setError("");
  }, [activeWorkspace, isOpen]);

  if (!isOpen || !activeWorkspace) return null;

  const handleSave = async () => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setError("Workspace name is required");
      return;
    }

    if (trimmedName.length > 50 || trimmedDescription.length > 300) {
      setError("Name must be 50 characters or fewer and description 300 characters or fewer");
      return;
    }

    const optimisticWorkspace: IWorkspace = {
      ...activeWorkspace,
      name: trimmedName,
      description: trimmedDescription,
    };
    updateWorkspace(optimisticWorkspace);

    try {
      setSaving(true);
      setError("");
      const response = await api.patch<{ data: IWorkspace }>(`/workspaces/${activeWorkspace.id}`, {
        name: trimmedName,
        description: trimmedDescription,
      });
      updateWorkspace({ ...optimisticWorkspace, ...response.data.data });
      showToast("Workspace settings saved");
      onClose();
    } catch (requestError) {
      updateWorkspace(activeWorkspace);
      setError("Unable to save workspace settings. Please try again.");
      console.error("Update workspace failed:", requestError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-[500px] overflow-hidden rounded-2xl border border-white/10 bg-[#111118]/95 shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-violet-600/15 to-transparent p-5">
          <div>
            <h2 className="text-xl font-bold text-white">Workspace settings</h2>
            <p className="mt-1 text-sm text-slate-400">Update how your workspace appears to members.</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white" aria-label="Close settings">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <label className="block text-sm font-medium text-slate-200">
            Workspace name
            <input value={name} onChange={(event) => setName(event.target.value)} maxLength={50} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-white outline-none transition focus:border-violet-400" />
            <span className="mt-1 block text-right text-xs text-slate-500">{name.length}/50</span>
          </label>

          <label className="block text-sm font-medium text-slate-200">
            Description
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={300} rows={5} className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 p-3 text-white outline-none transition focus:border-violet-400" />
            <span className="mt-1 block text-right text-xs text-slate-500">{description.length}/300</span>
          </label>

          {error && <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 p-5">
          <button onClick={onClose} disabled={saving} className="rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60">
            {saving && <Loader2 size={16} className="animate-spin" />}
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSettingsModal;
