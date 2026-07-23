import React, { useState } from "react";
import {
  FileText,
  FileSpreadsheet,
  FileArchive,
  FileCode2,
  Download,
  Play,
  File,
} from "lucide-react";
import type { IAttachment } from "../../types";
import {
  formatFileSize,
  getFileCategory,
  resolveAttachmentUrl,
} from "../../utils/fileHelpers";
import Lightbox from "./Lightbox";

interface MessageAttachmentsProps {
  attachments: IAttachment[];
}

const iconByCategory = {
  pdf: FileText,
  document: FileText,
  office: FileSpreadsheet,
  archive: FileArchive,
  code: FileCode2,
  unknown: File,
} as const;

const gradientByCategory: Record<string, string> = {
  pdf: "from-rose-500/20 to-orange-500/10",
  document: "from-blue-500/20 to-cyan-500/10",
  office: "from-emerald-500/20 to-teal-500/10",
  archive: "from-amber-500/20 to-yellow-500/10",
  code: "from-violet-500/20 to-fuchsia-500/10",
  unknown: "from-slate-500/20 to-slate-600/10",
};

const MessageAttachments: React.FC<MessageAttachmentsProps> = ({
  attachments,
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const imageAttachments = attachments.filter(
    (file) => getFileCategory(file.originalName, file.mimeType) === "image"
  );

  const imageSources = imageAttachments.map((file) => ({
    src: resolveAttachmentUrl(file.url),
    alt: file.originalName,
  }));

  const renderDownloadButton = (file: IAttachment) => (
    <a
      href={resolveAttachmentUrl(file.url)}
      download={file.originalName}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white"
    >
      <Download size={14} />
      Download
    </a>
  );

  return (
    <div className="mt-2 space-y-2">
      {attachments.map((file, index) => {
        const category = getFileCategory(file.originalName, file.mimeType);
        const fileUrl = resolveAttachmentUrl(file.url);

        if (category === "image") {
          const imageIndex = imageAttachments.findIndex(
            (img) => img.url === file.url
          );

          return (
            <button
              key={`${file.filename}-${index}`}
              type="button"
              onClick={() => setLightboxIndex(imageIndex)}
              className="group/img block overflow-hidden rounded-xl border border-white/10 bg-black/20 transition hover:border-violet-400/40 hover:shadow-lg hover:shadow-violet-500/10"
            >
              <img
                src={fileUrl}
                alt={file.originalName}
                className="max-h-56 w-full max-w-sm object-cover transition duration-300 group-hover/img:scale-[1.02]"
                loading="lazy"
              />
            </button>
          );
        }

        if (category === "video") {
          return (
            <div
              key={`${file.filename}-${index}`}
              className="overflow-hidden rounded-xl border border-white/10 bg-black/30"
            >
              <video
                src={fileUrl}
                controls
                preload="metadata"
                className="max-h-64 w-full max-w-sm rounded-xl"
              />
              <div className="flex items-center justify-between gap-3 px-3 py-2 text-xs text-slate-400">
                <span className="truncate">{file.originalName}</span>
                <span>{formatFileSize(file.size)}</span>
              </div>
            </div>
          );
        }

        if (category === "audio") {
          return (
            <div
              key={`${file.filename}-${index}`}
              className="rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-violet-500/5 p-3"
            >
              <div className="mb-2 flex items-center gap-2 text-xs text-violet-300">
                <Play size={14} />
                <span className="truncate font-medium">{file.originalName}</span>
              </div>
              <audio src={fileUrl} controls className="w-full max-w-sm" />
            </div>
          );
        }

        if (category === "pdf") {
          return (
            <div key={`${file.filename}-${index}`} className="overflow-hidden rounded-2xl border border-rose-400/15 bg-gradient-to-br from-rose-500/10 to-orange-500/5 shadow-lg shadow-black/10">
              <div className="flex items-center justify-between gap-3 border-b border-white/8 px-3 py-2.5">
                <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-rose-100"><FileText size={17} className="shrink-0 text-rose-300" /><span className="truncate">{file.originalName}</span></div>
                {renderDownloadButton(file)}
              </div>
              <iframe title={`Preview ${file.originalName}`} src={fileUrl} className="h-56 w-full bg-white" loading="lazy" />
            </div>
          );
        }

        if (category === "code") {
          return (
            <div
              key={`${file.filename}-${index}`}
              className={`rounded-xl border border-white/10 bg-gradient-to-br ${gradientByCategory.code} p-3 transition hover:border-violet-400/30`}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-medium text-violet-200">
                  <FileCode2 size={16} />
                  <span className="truncate">{file.originalName}</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-violet-300/70">
                  {file.originalName.split(".").pop()}
                </span>
              </div>
              <div className="rounded-lg bg-[#0B0B12]/80 p-3 font-mono text-xs leading-relaxed text-emerald-300/90">
                <span className="text-slate-500">// </span>
                Code file · {formatFileSize(file.size)}
              </div>
              <div className="mt-3">{renderDownloadButton(file)}</div>
            </div>
          );
        }

        const Icon = iconByCategory[category as keyof typeof iconByCategory] || File;
        const gradient =
          gradientByCategory[category] || gradientByCategory.unknown;

        return (
          <div
            key={`${file.filename}-${index}`}
            className={`group/file flex items-center gap-3 rounded-xl border border-white/10 bg-gradient-to-br ${gradient} p-3 transition hover:-translate-y-0.5 hover:border-violet-400/30 hover:shadow-lg hover:shadow-violet-500/10`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-violet-200 transition group-hover/file:scale-105">
              <Icon size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-100">
                {file.originalName}
              </p>
              <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
            </div>
            {renderDownloadButton(file)}
          </div>
        );
      })}

      {lightboxIndex !== null && (
        <Lightbox
          images={imageSources}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
};

export default MessageAttachments;
