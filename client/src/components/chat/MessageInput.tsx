import React, { useState, useEffect, useRef } from 'react';
import { useWorkspace } from '../../hooks/useWorkspace.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import { socket } from '../../services/socket.ts';
import Button from '../ui/Button.tsx';
import FileAttachmentButton from "./FileAttachmentButton";
import { Send } from 'lucide-react';

export const MessageInput: React.FC = () => {
  const { activeChannel } = useWorkspace();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const channelId = activeChannel?.id;
  const userName = user?.name || 'Anonymous';
  const senderId = user?.id;

  const handleStopTyping = () => {
    if (isTypingRef.current && channelId) {
      socket.emit('typing:stop', { channelId, userName });
      isTypingRef.current = false;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If Enter key is pressed without Shift, submit form
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
      return;
    }

    if (!channelId) return;

    // Emit typing:start if not already typing
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit('typing:start', { channelId, userName });
    }

    // Reset idle timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 2000); // 2s Idle
  };

  const handleBlur = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    handleStopTyping();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim() || !channelId || !senderId) return;

    // Emit message
    socket.emit('chat:message', {
      channelId,
      content: content.trim(),
      senderId,
    });

    setContent('');

    // Stop typing indicator immediately on submit
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    handleStopTyping();
  };

  // Cleanup timeout on unmount or channel change
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTypingRef.current && channelId) {
        socket.emit('typing:stop', { channelId, userName });
      }
    };
  }, [channelId, userName]);

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 bg-[#0F0F16] border-t border-[#1E1E2F]">
      
    <FileAttachmentButton />
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={activeChannel ? `Message #${activeChannel.name}` : 'Select a channel to chat'}
        disabled={!activeChannel}
       className="flex-1 bg-[#111118] text-[#F1F5F9] placeholder:text-[#64748B] text-sm border border-[#1E293B] rounded-xl py-3 px-4 focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed font-body"
      />
      <Button
        type="submit"
        disabled={!content.trim() || !activeChannel}
        variant="primary"
        size="md"
        className="flex items-center justify-center p-2.5 transition-all duration-200 hover:scale-105"
      >
        <Send size={16} />
      </Button>
    </form>
  );
};

export default MessageInput;
