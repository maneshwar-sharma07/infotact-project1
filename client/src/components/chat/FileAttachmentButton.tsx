import React from "react";
import { Paperclip } from "lucide-react";

const FileAttachmentButton: React.FC = () => {
  return (
    <button
      onClick={() => alert("File upload coming soon")}
      className="p-2 rounded-lg hover:bg-[#1A1A24] transition-all"
      title="Attach File"
    >
      <Paperclip size={18} className="text-[#94A3B8]" />
    </button>
  );
};

export default FileAttachmentButton;