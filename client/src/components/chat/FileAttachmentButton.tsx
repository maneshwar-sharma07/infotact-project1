import React, { useRef } from "react";
import { Paperclip } from "lucide-react";
import { FILE_ACCEPT } from "../../utils/fileHelpers";

interface FileAttachmentButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

const FileAttachmentButton: React.FC<FileAttachmentButtonProps> = ({
  onFilesSelected,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length) {
      onFilesSelected(selected);
    }
    e.target.value = "";
  };

  return (
    <div className="group relative">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={FILE_ACCEPT}
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="rounded-xl border border-transparent bg-gradient-to-br from-violet-600/20 to-fuchsia-600/10 p-3 text-violet-300 transition-all hover:border-violet-500/30 hover:from-violet-600/30 hover:to-fuchsia-600/20 hover:text-white hover:shadow-lg hover:shadow-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Attach files"
      >
        <Paperclip size={18} />
      </button>

      <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-[220px] -translate-x-1/2 rounded-lg border border-[#1E293B] bg-[#111118] px-3 py-2 text-xs text-white opacity-0 shadow-xl shadow-black/30 transition group-hover:opacity-100">
        Attach up to 5 files (20 MB each)
      </div>
    </div>
  );
};

export default FileAttachmentButton;
