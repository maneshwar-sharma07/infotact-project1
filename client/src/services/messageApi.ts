import api from "./api";
import type { IAttachment, IMessage } from "../types";

export interface SendMessagePayload {
  content: string;
  channelId: string;
  replyTo?: string | null;
  clientTempId?: string;
  files?: File[];
  onUploadProgress?: (progress: number) => void;
}

export interface SendMessageResponse {
  data: IMessage & { clientTempId?: string };
}

export const sendMessage = async ({
  content,
  channelId,
  replyTo = null,
  clientTempId,
  files = [],
  onUploadProgress,
}: SendMessagePayload) => {
  const formData = new FormData();
  formData.append("content", content);
  formData.append("channelId", channelId);

  if (replyTo) {
    formData.append("replyTo", replyTo);
  }

  if (clientTempId) {
    formData.append("clientTempId", clientTempId);
  }

  for (const file of files) {
    formData.append("attachments", file);
  }

  return api.post<SendMessageResponse>("/messages", formData, {
    onUploadProgress: (event) => {
      if (!onUploadProgress || !event.total) return;
      const progress = Math.round((event.loaded * 100) / event.total);
      onUploadProgress(progress);
    },
  });
};

export const formatAttachment = (attachment: Partial<IAttachment>): IAttachment => ({
  filename: attachment.filename || "",
  originalName: attachment.originalName || attachment.filename || "file",
  mimeType: attachment.mimeType || "application/octet-stream",
  size: attachment.size || 0,
  url: attachment.url || "",
});

export interface ToggleReactionResponse {
  data: IMessage;
}

export const toggleMessageReaction = (messageId: string, emoji: string) =>
  api.post<ToggleReactionResponse>(`/messages/${messageId}/reaction`, { emoji });
