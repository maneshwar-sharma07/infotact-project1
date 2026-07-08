import React, { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";

import { useWorkspace } from "../../hooks/useWorkspace.ts";
import { useAuth } from "../../hooks/useAuth.ts";
import { socket } from "../../services/socket.ts";
import api from "../../services/api.ts";

import Button from "../ui/Button.tsx";
import FileAttachmentButton from "./FileAttachmentButton";
import EmojiPickerButton from "./EmojiPickerButton";

import type { IMessage } from "../../types";

interface MessageInputProps {
  replyMessage: IMessage | null;
  setReplyMessage: React.Dispatch<
    React.SetStateAction<IMessage | null>
  >;
}

const MessageInput: React.FC<MessageInputProps> = ({
  replyMessage,
  setReplyMessage,
}) => {
  const { activeChannel } = useWorkspace();
  const { user } = useAuth();

  const [content, setContent] = useState("");

  const isTypingRef = useRef(false);
  const typingTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const channelId = activeChannel?.id;
  console.log("INPUT ACTIVE CHANNEL");
console.log(activeChannel);

console.log("INPUT CHANNEL ID");
console.log(channelId);
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

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
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

  const handleSubmit = async (
    e?: React.FormEvent
  ) => {
    if (e) e.preventDefault();

    if (!content.trim() || !channelId) return;

    try {
      await api.post("/messages", {
        content: content.trim(),
        channelId,
        replyTo: replyMessage?.id || null,
      });

      setContent("");

      setReplyMessage(null);

      stopTyping();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      stopTyping();
    };
  }, []);

  return (
    <div className="border-t border-[#1E293B] bg-[#0F1117]">

      {/* Reply Preview */}

      {replyMessage && (
        <div className="mx-4 mt-3 mb-2 rounded-xl border border-violet-500/40 bg-violet-500/10 p-3">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-xs font-semibold text-violet-400">
                Replying to {replyMessage.senderName}
              </p>

              <p className="mt-1 text-sm text-slate-300 truncate">
                {replyMessage.content}
              </p>

            </div>

            <button
              onClick={() => setReplyMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>

          </div>

        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 p-4"
      >
        <FileAttachmentButton />

        <EmojiPickerButton
          onSelect={addEmoji}
        />

        <input
          type="text"
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={
            activeChannel
              ? `Message #${activeChannel.name}`
              : "Select a channel"
          }
          disabled={!activeChannel}
          className="flex-1 rounded-xl border border-[#1E293B] bg-[#111118] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        />

        <Button
          type="submit"
          disabled={!content.trim()}
          variant="primary"
          size="md"
          className="flex items-center justify-center p-2.5"
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;