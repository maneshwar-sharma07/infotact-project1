export const MAX_FILE_SIZE = 20 * 1024 * 1024;
export const MAX_FILES_PER_MESSAGE = 5;

export const ALLOWED_EXTENSIONS = [
  "jpg", "jpeg", "png", "gif", "webp",
  "pdf", "doc", "docx", "txt",
  "xlsx", "csv", "pptx",
  "mp3", "wav", "ogg", "m4a",
  "mp4", "webm", "mov",
  "zip", "rar",
  "js", "ts", "json", "html", "css", "java", "py", "cpp",
] as const;

export const FILE_ACCEPT = ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(",");

export type FileCategory =
  | "image"
  | "pdf"
  | "audio"
  | "video"
  | "document"
  | "office"
  | "archive"
  | "code"
  | "unknown";

const IMAGE_EXTS = new Set(["jpg", "jpeg", "png", "gif", "webp"]);
const PDF_EXTS = new Set(["pdf"]);
const AUDIO_EXTS = new Set(["mp3", "wav", "ogg", "m4a"]);
const VIDEO_EXTS = new Set(["mp4", "webm", "mov"]);
const OFFICE_EXTS = new Set(["xlsx", "csv", "pptx"]);
const DOC_EXTS = new Set(["doc", "docx", "txt"]);
const ARCHIVE_EXTS = new Set(["zip", "rar"]);
const CODE_EXTS = new Set(["js", "ts", "json", "html", "css", "java", "py", "cpp"]);

export const getFileExtension = (filename: string): string => {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
};

export const getFileCategory = (filename: string, mimeType?: string): FileCategory => {
  const ext = getFileExtension(filename);

  if (IMAGE_EXTS.has(ext) || mimeType?.startsWith("image/")) return "image";
  if (PDF_EXTS.has(ext) || mimeType === "application/pdf") return "pdf";
  if (AUDIO_EXTS.has(ext) || mimeType?.startsWith("audio/")) return "audio";
  if (VIDEO_EXTS.has(ext) || mimeType?.startsWith("video/")) return "video";
  if (OFFICE_EXTS.has(ext)) return "office";
  if (DOC_EXTS.has(ext)) return "document";
  if (ARCHIVE_EXTS.has(ext)) return "archive";
  if (CODE_EXTS.has(ext)) return "code";
  return "unknown";
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const validateFiles = (
  files: File[],
  existingCount = 0
): { valid: File[]; error?: string } => {
  if (existingCount + files.length > MAX_FILES_PER_MESSAGE) {
    return { valid: [], error: "Maximum 5 files per message" };
  }

  const valid: File[] = [];

  for (const file of files) {
    const ext = getFileExtension(file.name);

    if (!ALLOWED_EXTENSIONS.includes(ext as (typeof ALLOWED_EXTENSIONS)[number])) {
      return { valid: [], error: "Unsupported file type" };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { valid: [], error: "File exceeds the 20 MB limit" };
    }

    valid.push(file);
  }

  return { valid };
};

export const getUploadBaseUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  return apiUrl.replace(/\/api\/?$/, "");
};

export const resolveAttachmentUrl = (url: string): string => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${getUploadBaseUrl()}${url.startsWith("/") ? url : `/${url}`}`;
};
