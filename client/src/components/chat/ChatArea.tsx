import React, { useCallback, useEffect, useRef, useState } from "react";
import EmptyChat from "./EmptyChat";
import { useWorkspace } from "../../hooks/useWorkspace.ts";
import { useSocket } from "../../hooks/useSocket.ts";
import { useAuth } from "../../hooks/useAuth.ts";
import { useToast } from "../ui/ToastProvider.tsx";
import api from "../../services/api.ts";
import { sendMessage, formatAttachment, toggleMessageReaction } from "../../services/messageApi.ts";
import type { IAttachment, IMessage, IMessageReaction } from "../../types/index.ts";

import ChannelHeader from "../channel/ChannelHeader.tsx";
import MessageList from "./MessageList.tsx";
import TypingIndicator from "./TypingIndicator.tsx";
import MessageInput from "./MessageInput.tsx";

interface ApiMessage {
  id?: string;
  _id?: string;
  senderId?: string;
  senderName?: string;
  sender?: { id?: string; _id?: string; name?: string } | string;
  channelId?: string;
  channel?: { id?: string; _id?: string } | string;
  content?: string;
  timestamp?: string;
  createdAt?: string;
  attachments?: Partial<IAttachment>[];
  reactions?: IMessageReaction[];
  replyTo?: {
    id?: string;
    _id?: string;
    content?: string;
    senderName?: string;
    sender?: { name?: string };
  } | null;
  clientTempId?: string;
  message?: ApiMessage;
}

interface ReactionEventPayload {
  messageId: string;
  reactions: IMessageReaction[];
}

const formatMessage = (message: ApiMessage): IMessage => {
  const senderId =
    typeof message.sender === "object"
      ? message.sender?.id || message.sender?._id
      : message.senderId || message.sender;

  const senderName =
    typeof message.sender === "object"
      ? message.sender?.name
      : message.senderName || "User";

  return {
    id: String(message.id || message._id || ""),
    senderId: senderId || "",
    senderName: senderName || "User",
    channelId:
      (typeof message.channel === "object"
        ? message.channel?.id || message.channel?._id
        : undefined) ||
      message.channelId ||
      (typeof message.channel === "string" ? message.channel : ""),
    content: message.content || "",
    timestamp: message.createdAt || message.timestamp || new Date().toISOString(),
    attachments: (message.attachments || []).map(formatAttachment),
    reactions: message.reactions || [],
    replyTo: message.replyTo
      ? {
          id: message.replyTo.id || message.replyTo._id || "",
          content: message.replyTo.content || "",
          senderName: message.replyTo.senderName || message.replyTo.sender?.name || "User",
        }
      : undefined,
  };
};

const applyReactionToggle = (
  reactions: IMessageReaction[],
  userId: string,
  emoji: string
): IMessageReaction[] => {
  return reactions
    .map((reaction) => {
      if (reaction.emoji !== emoji) return reaction;

      const hasReacted = reaction.users.includes(userId);
      return {
        ...reaction,
        users: hasReacted
          ? reaction.users.filter((id) => id !== userId)
          : [...reaction.users, userId],
      };
    })
    .filter((reaction) => reaction.users.length > 0)
    .concat(
      reactions.some((reaction) => reaction.emoji === emoji)
        ? []
        : [{ emoji, users: [userId] }]
    );
};

const getErrorMessage = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return "Failed to send message";
};

export const ChatArea: React.FC = () => {
  const { activeChannel, activeWorkspace } = useWorkspace();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pendingReactionRequests = useRef(new Set<string>());

  const channelId = activeChannel?.id;
  const socket = useSocket(channelId, activeWorkspace?.id);

  const handleEdit = useCallback(async (id: string) => {
    const content = prompt("Edit message");
    if (!content) return;

    try {
      await api.patch(`/messages/${id}`, { content });
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, content } : msg))
      );
    } catch (err) {
      console.error("Edit failed:", err);
      showToast("Failed to edit message", "error");
    }
  }, [showToast]);

  const handleDelete = useCallback(async (id: string) => {
    const confirmed = window.confirm("Delete this message?");
    if (!confirmed) return;

    try {
      await api.delete(`/messages/${id}`);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      showToast("Failed to delete message", "error");
    }
  }, [showToast]);

  const upsertMessage = useCallback((nextMessage: IMessage, clientTempId?: string) => {
    setMessages((prev) => {
      const withoutTemp = clientTempId
        ? prev.filter((message) => message.id !== clientTempId)
        : prev;

      if (withoutTemp.some((message) => message.id === nextMessage.id)) {
        return withoutTemp.map((message) =>
          message.id === nextMessage.id ? { ...message, ...nextMessage } : message
        );
      }

      return [...withoutTemp, nextMessage];
    });
  }, []);

  const handleToggleReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!user?.id) return;

    const requestKey = `${messageId}:${emoji}`;
    if (pendingReactionRequests.current.has(requestKey)) return;
    pendingReactionRequests.current.add(requestKey);

    let previousReactions: IMessageReaction[] | undefined;
    setMessages((previousMessages) =>
      previousMessages.map((message) => {
        if (message.id !== messageId) return message;

        previousReactions = message.reactions;
        return {
          ...message,
          reactions: applyReactionToggle(message.reactions, user.id, emoji),
        };
      })
    );

    try {
      await toggleMessageReaction(messageId, emoji);
    } catch (error) {
      console.error("Toggle reaction failed:", error);
      if (previousReactions) {
        setMessages((previousMessages) =>
          previousMessages.map((message) =>
            message.id === messageId
              ? { ...message, reactions: previousReactions! }
              : message
          )
        );
      }
      showToast(getErrorMessage(error).replace("Failed to send message", "Failed to update reaction"), "error");
    } finally {
      pendingReactionRequests.current.delete(requestKey);
    }
  }, [showToast, user?.id]);

  const handleSendMessage = async (
    content: string,
    replyTo: IMessage | null,
    files: File[] = [],
    onUploadProgress?: (progress: number) => void
  ) => {
    if (!channelId) return;

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const optimisticMessage: IMessage = {
      id: tempId,
      senderId: user?.id || "me",
      senderName: user?.name || "You",
      channelId,
      content,
      timestamp: new Date().toISOString(),
      attachments: files.map((file, index) => ({
        filename: `pending-${index}`,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : "",
      })),
      reactions: [],
      replyTo: replyTo
        ? {
            id: replyTo.id,
            content: replyTo.content,
            senderName: replyTo.senderName || "User",
          }
        : undefined,
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const response = await sendMessage({
        content,
        channelId,
        replyTo: replyTo?.id || null,
        clientTempId: tempId,
        files,
        onUploadProgress,
      });

      const savedMessage = formatMessage(response.data?.data || response.data);
      upsertMessage(
        savedMessage,
        response.data.data?.clientTempId || tempId
      );
    } catch (err: unknown) {
      console.error("Send message failed:", err);
      setMessages((prev) => prev.filter((message) => message.id !== tempId));

      showToast(getErrorMessage(err), "error");
      throw err;
    }
  };

  useEffect(() => {
    if (!channelId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/messages?channelId=${channelId}`);
        const rawData = response.data as { data?: ApiMessage[] } | ApiMessage[];
        const rawMessages = Array.isArray(rawData) ? rawData : rawData.data || [];
        const formatted = rawMessages.map(formatMessage);

        formatted.sort(
          (a: IMessage, b: IMessage) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        setMessages(formatted);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setError("Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [channelId]);

  useEffect(() => {
    if (!socket || !channelId) return;

    const handleNewMessage = (payload: ApiMessage) => {
      const message = formatMessage(payload.message || payload);
      const clientTempId = payload.clientTempId || payload.message?.clientTempId;

      if (message.channelId !== channelId) return;

      upsertMessage(message, clientTempId);
    };

    socket.on("chat:message", handleNewMessage);

    return () => {
      socket.off("chat:message", handleNewMessage);
    };
  }, [socket, channelId, upsertMessage]);

  useEffect(() => {
    if (!socket || !channelId) return;

    const handleReaction = ({ messageId, reactions }: ReactionEventPayload) => {
      setMessages((previousMessages) =>
        previousMessages.map((message) =>
          message.id === messageId ? { ...message, reactions } : message
        )
      );
    };

    socket.on("chat:reaction", handleReaction);

    return () => {
      socket.off("chat:reaction", handleReaction);
    };
  }, [socket, channelId]);

  if (!activeChannel) {
    return (
      <div className="flex-1 flex flex-col h-screen bg-[#0F0F16]">
        <ChannelHeader />

        <div className="flex-1 flex flex-col items-center justify-center text-text-muted font-body">
          <p className="text-base font-semibold">Welcome to Infotact Solutions Chat</p>
          <p className="text-xs mt-1">Select a channel from the sidebar to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#0F0F16] overflow-hidden">
      <ChannelHeader />

      {loading ? (
        <div className="flex-1 space-y-4 p-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex items-end gap-3 animate-pulse">
              <div className="h-9 w-9 rounded-full bg-white/10" />
              <div className="space-y-2">
                <div className="h-3 w-28 rounded bg-white/10" />
                <div className="h-10 w-72 rounded-lg bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        </div>
      ) : messages.length === 0 ? (
        <EmptyChat />
      ) : (
        <MessageList
          messages={messages}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReply={setReplyMessage}
          onToggleReaction={handleToggleReaction}
        />
      )}

      <TypingIndicator />

      <MessageInput
        replyMessage={replyMessage}
        setReplyMessage={setReplyMessage}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatArea;
