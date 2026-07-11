import React from "react";
import { X, FileImage, FileText, FileAudio, FileVideo, File } from "lucide-react";
import {
  formatFileSize,
  getFileCategory,
} from "../../utils/fileHelpers";

export interface PendingFile {
  id: string;
  file: File;
  previewUrl?: string;
}

interface AttachmentPreviewProps {
  files: PendingFile[];
  onRemove: (id: string) => void;
}

const categoryIcon = {
  image: FileImage,
  pdf: FileText,
  document: FileText,
  office: FileText,
  audio: FileAudio,
  video: FileVideo,
  archive: File,
  code: FileText,
  unknown: File,
} as const;

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  files,
  onRemove,
}) => {
  if (!files.length) return null;

  return (
    <div className="mx-4 mt-3 flex flex-wrap gap-2">
      {files.map((item) => {
        const category = getFileCategory(item.file.name, item.file.type);
        const Icon = categoryIcon[category] || File;

        return (
          <div
            key={item.id}
            className="group relative flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/5 px-3 py-2 shadow-sm shadow-violet-500/5 transition hover:border-violet-400/40"
          >
            {item.previewUrl ? (
              <img
                src={item.previewUrl}
                alt={item.file.name}
                className="h-10 w-10 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-violet-300">
                <Icon size={18} />
              </div>
            )}

            <div className="min-w-0 max-w-[160px]">
              <p className="truncate text-xs font-medium text-slate-200">
                {item.file.name}
              </p>
              <p className="text-[10px] text-slate-400">
                {formatFileSize(item.file.size)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label={`Remove ${item.file.name}`}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default AttachmentPreview;
