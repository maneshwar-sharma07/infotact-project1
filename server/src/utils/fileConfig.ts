import path from "path";

export const MAX_FILE_SIZE = 20 * 1024 * 1024;
export const MAX_FILES_PER_MESSAGE = 5;

const EXTENSION_MIME_MAP: Record<string, string[]> = {
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  png: ["image/png"],
  gif: ["image/gif"],
  webp: ["image/webp"],
  pdf: ["application/pdf"],
  doc: ["application/msword"],
  docx: [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  txt: ["text/plain"],
  xlsx: [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ],
  csv: ["text/csv", "application/vnd.ms-excel"],
  pptx: [
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
  mp3: ["audio/mpeg", "audio/mp3"],
  wav: ["audio/wav", "audio/x-wav", "audio/wave"],
  ogg: ["audio/ogg", "application/ogg"],
  m4a: ["audio/mp4", "audio/x-m4a", "audio/m4a"],
  mp4: ["video/mp4"],
  webm: ["video/webm"],
  mov: ["video/quicktime"],
  zip: ["application/zip", "application/x-zip-compressed"],
  rar: ["application/vnd.rar", "application/x-rar-compressed"],
  js: ["text/javascript", "application/javascript"],
  ts: ["text/typescript", "application/typescript", "video/mp2t"],
  json: ["application/json"],
  html: ["text/html"],
  css: ["text/css"],
  java: ["text/x-java-source"],
  py: ["text/x-python", "text/plain", "application/x-python-code"],
  cpp: ["text/x-c++src", "text/plain"],
};

export const ALLOWED_EXTENSIONS = Object.keys(EXTENSION_MIME_MAP);

export const getExtension = (filename: string): string => {
  const ext = path.extname(filename).slice(1).toLowerCase();
  return ext;
};

export const sanitizeFilename = (filename: string): string => {
  const base = path.basename(filename);
  return base
    .replace(/[^\w.\-() ]+/g, "_")
    .replace(/\.{2,}/g, ".")
    .slice(0, 200);
};

export const isAllowedFile = (
  originalName: string,
  mimeType: string
): boolean => {
  const ext = getExtension(originalName);
  if (!ext || !EXTENSION_MIME_MAP[ext]) return false;

  const allowedMimes = EXTENSION_MIME_MAP[ext];
  const normalizedMime = (mimeType || "application/octet-stream").toLowerCase();

  if (allowedMimes.includes(normalizedMime)) return true;

  // Some browsers send generic mime types for code/office files
  const genericAllowed = [
    "application/octet-stream",
    "binary/octet-stream",
    "text/plain",
  ];

  return genericAllowed.includes(normalizedMime);
};
