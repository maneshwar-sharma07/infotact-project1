import fs from "fs";
import path from "path";
import crypto from "crypto";
import multer, { FileFilterCallback } from "multer";
import { Request, Response, NextFunction } from "express";
import {
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZE,
  MAX_FILES_PER_MESSAGE,
  getExtension,
  isAllowedFile,
  sanitizeFilename,
} from "../utils/fileConfig";

const uploadsDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = getExtension(file.originalname);
    const uniqueName = `${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const sanitized = sanitizeFilename(file.originalname);
  const ext = getExtension(sanitized);

  if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
    cb(new Error("Unsupported file type"));
    return;
  }

  if (!isAllowedFile(sanitized, file.mimetype)) {
    cb(new Error("Unsupported file type"));
    return;
  }

  cb(null, true);
};

export const uploadAttachments = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES_PER_MESSAGE,
  },
  fileFilter,
});

export const handleUploadError = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({
        success: false,
        message: "File exceeds the 20 MB limit",
      });
      return;
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      res.status(400).json({
        success: false,
        message: "Maximum 5 files per message",
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err.message === "Unsupported file type") {
    res.status(400).json({
      success: false,
      message: "Unsupported file type",
    });
    return;
  }

  next(err);
};
