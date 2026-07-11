import React, { useEffect, useRef } from 'react';
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
        {messages.map((msg) => (
            <MessageItem
                key={msg.id || `${msg.senderId}-${msg.timestamp}`}
                message={msg}
                isOwn={msg.senderId === user?.id}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                currentUserId={user?.id}
                onToggleReaction={onToggleReaction}
            />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
