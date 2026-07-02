import React from "react";
import { Copy, Pencil, Trash2 } from "lucide-react";

const MessageActions: React.FC = () => {
  return (
    <div className="absolute right-2 top-0 hidden group-hover:flex items-center gap-1 bg-[#111118] border border-[#1E293B] rounded-lg p-1 shadow-xl">

      <button
        title="Copy"
        className="p-2 rounded hover:bg-[#1A1A24] transition"
      >
        <Copy size={15} />
      </button>

      <button
        title="Edit"
        className="p-2 rounded hover:bg-[#1A1A24] transition"
      >
        <Pencil size={15} />
      </button>

      <button
        title="Delete"
        className="p-2 rounded hover:bg-red-500/20 text-red-400 transition"
      >
        <Trash2 size={15} />
      </button>

    </div>
  );
};

export default MessageActions;