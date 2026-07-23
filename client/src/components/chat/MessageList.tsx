import React, { useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import type { IMessage } from '../../types/index.ts';
import MessageItem from './MessageItem.tsx';
import { useAuth } from '../../hooks/useAuth.ts';

interface MessageListProps {
  messages: IMessage[];
  onReply: (message: IMessage) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
}

const dateLabel = (timestamp: string) => {
  const value = new Date(timestamp);
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const startOfMessage = new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  const daysAgo = Math.round((startOfToday - startOfMessage) / 86400000);
  if (daysAgo === 0) return 'Today';
  if (daysAgo === 1) return 'Yesterday';
  return value.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
};

export const MessageList: React.FC<MessageListProps> = ({
 messages,
  onReply,
  onEdit,
  onDelete,
  onToggleReaction,
}) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const latestMessageId = messages.at(-1)?.id;
  const messageGroups = useMemo(() => messages.map((message, index) => {
    const previous = messages[index - 1];
    const showDate = !previous || new Date(previous.timestamp).toDateString() !== new Date(message.timestamp).toDateString();
    const grouped = Boolean(previous && !showDate && previous.senderId === message.senderId && new Date(message.timestamp).getTime() - new Date(previous.timestamp).getTime() < 5 * 60 * 1000);
    return { message, showDate, grouped };
  }), [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [latestMessageId, messages.length]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center font-body text-text-muted text-sm italic select-none">
        No messages yet
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
      <div className="flex flex-col">
        {messageGroups.map(({ message: msg, showDate, grouped }) => (
          <React.Fragment key={msg.id || `${msg.senderId}-${msg.timestamp}`}>
            {showDate && (
              <div className="relative my-5 flex items-center gap-3 px-5" aria-label={dateLabel(msg.timestamp)}>
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-white/5" />
                <span className="rounded-full border border-white/10 bg-[#151520]/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 shadow-sm backdrop-blur">{dateLabel(msg.timestamp)}</span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent via-white/10 to-white/5" />
              </div>
            )}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
            <MessageItem
                message={msg}
                isOwn={msg.senderId === user?.id}
                grouped={grouped}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                currentUserId={user?.id}
                onToggleReaction={onToggleReaction}
            />
            </motion.div>
          </React.Fragment>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
