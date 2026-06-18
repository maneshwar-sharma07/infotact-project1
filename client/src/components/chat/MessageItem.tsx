import React from 'react';
import type { IMessage } from '../../types/index.ts';

interface MessageItemProps {
  message: IMessage;
  isOwn: boolean;
}

const getInitials = (name?: string) => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0]!.substring(0, 2).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
};

const formatTime = (isoString: string) => {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    return '';
  }
};

export const MessageItem: React.FC<MessageItemProps> = ({ message, isOwn }) => {
  const displayName = message.senderName || 'User';
  const initials = getInitials(displayName);
  const timeStr = formatTime(message.timestamp);

  return (
    <div className={`flex gap-3 items-end w-full mb-4 px-4 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar circle */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center text-white text-xs font-semibold select-none shadow-sm shadow-accent-primary/20">
        {initials}
      </div>

      {/* Message Bubble Container */}
      <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Sender Name */}
        <span className="text-xs font-medium text-text-muted mb-1 font-heading">
          {displayName}
        </span>

        {/* Message Bubble */}
        <div
          className={`px-4 py-2.5 rounded-[4px] text-sm leading-relaxed font-body shadow-sm break-words w-full
            ${isOwn 
              ? 'bg-accent-primary text-white rounded-br-none' 
              : 'glass-card border border-white/5 text-[#F1F5F9] rounded-bl-none'
            }`}
        >
          {message.content}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-text-muted mt-1 font-mono tracking-wider">
          {timeStr}
        </span>
      </div>
    </div>
  );
};

export default MessageItem;
