import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../hooks/useWorkspace.ts';
import { useSocket } from '../../hooks/useSocket.ts';
import api from '../../services/api.ts';
import type { IMessage } from '../../types/index.ts';

import ChannelHeader from '../channel/ChannelHeader.tsx';
import MessageList from './MessageList.tsx';
import TypingIndicator from './TypingIndicator.tsx';
import MessageInput from './MessageInput.tsx';

export const ChatArea: React.FC = () => {
  const { activeChannel } = useWorkspace();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const channelId = activeChannel?.id;

  // Establish connection and events subscription for this channel
  const socket = useSocket(channelId);

  // Fetch channel messages on mount or channel switch
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
        setMessages(response.data as IMessage[]);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        setError('Failed to load messages.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [channelId]);

  // Listen to incoming real-time messages
  useEffect(() => {
    if (!socket || !channelId) return;

    const handleNewMessage = (payload: any) => {
      const message = payload.message || payload;
      if (message && message.channelId === channelId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }
    };

    socket.on('chat:message', handleNewMessage);

    return () => {
      socket.off('chat:message', handleNewMessage);
    };
  }, [socket, channelId]);

  if (!activeChannel) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0F0F16] text-text-muted font-body">
        <p className="text-base font-semibold">Welcome to Infotact Solutions Chat</p>
        <p className="text-xs mt-1">Select a channel from the sidebar to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#0F0F16] overflow-hidden">
      {/* Top Header */}
      <ChannelHeader />

      {/* Messages List */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-primary"></div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-red-500 font-body text-sm">
          {error}
        </div>
      ) : (
        <MessageList messages={messages} />
      )}

      {/* Typing Indicator */}
      <TypingIndicator />

      {/* Message Input */}
      <MessageInput />
    </div>
  );
};

export default ChatArea;
