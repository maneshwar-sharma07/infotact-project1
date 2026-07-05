import React from "react";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const WorkspaceSettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="w-[450px] rounded-2xl bg-[#111118] border border-[#1E293B] shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1E293B]">
          <h2 className="text-xl font-bold text-white">
            Workspace Settings
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Workspace Name
            </label>

            <input
              type="text"
              placeholder="Infotact Workspace"
              className="w-full rounded-lg bg-[#0A0A0F] border border-[#1E293B] p-3 text-white outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Description
            </label>

            <textarea
              rows={4}
              placeholder="Workspace description..."
              className="w-full rounded-lg bg-[#0A0A0F] border border-[#1E293B] p-3 text-white outline-none resize-none focus:border-violet-500"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t border-[#1E293B]">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#1A1A24] text-white hover:bg-[#232332]"
          >
            Cancel
          </button>

          <button
            className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white"
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
};

export default WorkspaceSettingsModal;