import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, Send, Upload } from "lucide-react";

import { useWorkspace } from "../../hooks/useWorkspace.ts";
import { useAuth } from "../../hooks/useAuth.ts";
import { socket } from "../../services/socket.ts";
import { useToast } from "../ui/ToastProvider.tsx";

import Button from "../ui/Button.tsx";
import FileAttachmentButton from "./FileAttachmentButton";
import EmojiPickerButton from "./EmojiPickerButton";
import AttachmentPreview, { type PendingFile } from "./AttachmentPreview";

import type { IMessage } from "../../types";
import { validateFiles } from "../../utils/fileHelpers";

interface MessageInputProps {
  replyMessage: IMessage | null;
  setReplyMessage: React.Dispatch<
    React.SetStateAction<IMessage | null>
  >;
  onSendMessage: (
    content: string,
    replyTo: IMessage | null,
    files: File[],
    onUploadProgress?: (progress: number) => void
  ) => Promise<void>;
}

const MessageInput: React.FC<MessageInputProps> = ({
  replyMessage,
  setReplyMessage,
  onSendMessage,
}) => {
  const { activeChannel } = useWorkspace();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const isTypingRef = useRef(false);
  const typingTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragCounterRef = useRef(0);

  const channelId = activeChannel?.id;
  const userName = user?.name || "Anonymous";

  const stopTyping = () => {
    if (isTypingRef.current && channelId) {
      socket.emit("typing:stop", {
        channelId,
        userName,
      });

      isTypingRef.current = false;
    }
  };

  const addFiles = useCallback(
    (incoming: File[]) => {
      const { valid, error } = validateFiles(incoming, pendingFiles.length);

      if (error) {
        showToast(error, "error");
        return;
      }

      const nextFiles: PendingFile[] = valid.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        previewUrl: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      }));

      setPendingFiles((prev) => [...prev, ...nextFiles]);
    },
    [pendingFiles.length, showToast]
  );

  const removeFile = (id: string) => {
    setPendingFiles((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const clearFiles = () => {
    pendingFiles.forEach((item) => {
      if (item.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
    });
    setPendingFiles([]);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
      return;
    }

    if (!channelId) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;

      socket.emit("typing:start", {
        channelId,
        userName,
      });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  };

  const handleBlur = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    stopTyping();
  };

  const addEmoji = (emoji: string) => {
    setContent((prev) => prev + emoji);
  };

  const canSend =
    !!channelId &&
    !sending &&
    (content.trim().length > 0 || pendingFiles.length > 0);

  const handleSubmit = async (
    e?: React.FormEvent
  ) => {
    if (e) e.preventDefault();

    if (!canSend) return;

    const nextContent = content.trim();
    const nextReply = replyMessage;
    const filesToSend = pendingFiles.map((item) => item.file);

    try {
      setSending(true);
      setUploadProgress(0);
      setContent("");
      setReplyMessage(null);
      clearFiles();
      stopTyping();

      await onSendMessage(
        nextContent,
        nextReply,
        filesToSend,
        (progress) => setUploadProgress(progress)
      );
    } catch (err) {
      console.error(err);
      setContent(nextContent);
      setReplyMessage(nextReply);
      showToast("Failed to send message", "error");
    } finally {
      setSending(false);
      setUploadProgress(0);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current += 1;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current = 0;
    setIsDragging(false);

    const dropped = Array.from(e.dataTransfer.files || []);
    if (dropped.length) {
      addFiles(dropped);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      pendingFiles.forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });

      stopTyping();
    };
  }, []);

  return (
    <div
      className="relative border-t border-[#1E293B] bg-[#0F1117]/95 backdrop-blur-xl"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-t-2xl border-2 border-dashed border-violet-400/50 bg-violet-500/10 backdrop-blur-sm">
          <div className="flex items-center gap-2 rounded-2xl bg-[#111118]/90 px-5 py-3 text-sm font-medium text-violet-200 shadow-xl">
            <Upload size={18} />
            Drop files to attach
          </div>
        </div>
      )}

      {replyMessage && (
        <div className="mx-4 mt-3 mb-2 rounded-xl border border-violet-500/40 bg-violet-500/10 p-3 shadow-lg shadow-violet-500/5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-violet-400">
                Replying to {replyMessage.senderName}
              </p>
              <p className="mt-1 text-sm text-slate-300 truncate">
                {replyMessage.content || "Attachment"}
              </p>
            </div>

            <button
              onClick={() => setReplyMessage(null)}
              className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <AttachmentPreview files={pendingFiles} onRemove={removeFile} />

      {sending && uploadProgress > 0 && (
        <div className="mx-4 mt-3">
          <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
            <span>Uploading attachments</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-3 p-4"
      >
        <FileAttachmentButton
          onFilesSelected={addFiles}
          disabled={!activeChannel || sending}
        />

        <EmojiPickerButton
          onSelect={addEmoji}
        />

        <textarea
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          rows={1}
          placeholder={
            activeChannel
              ? `Send a message to #${activeChannel.name}`
              : "Select a channel"
          }
          disabled={!activeChannel || sending}
          className="max-h-36 min-h-[46px] flex-1 resize-none rounded-2xl border border-[#1E293B] bg-[#111118] px-4 py-3 text-sm leading-5 text-white shadow-inner shadow-black/20 outline-none transition-all duration-200 placeholder:text-slate-500 hover:border-violet-500/40 focus:border-violet-500 focus:bg-[#141420] focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <Button
          type="submit"
          disabled={!canSend}
          variant="primary"
          size="md"
          className="flex h-[46px] w-[46px] items-center justify-center rounded-2xl p-0 shadow-lg shadow-violet-600/20 transition hover:scale-105 disabled:hover:scale-100"
        >
          {sending ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <Send size={18} />
          )}
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
