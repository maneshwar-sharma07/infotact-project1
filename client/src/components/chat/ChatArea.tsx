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

  const handleEdit = async (id: string) => {
  const content = prompt("Edit message");

  if (!content) return;

  try {
    await api.patch(`/messages/${id}`, { content });

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, content } : msg
      )
    );
  } catch (err) {
    console.error("Edit failed:", err);
  }
};

const handleDelete = async (id: string) => {
  const confirmed = window.confirm("Delete this message?");

  if (!confirmed) return;

  try {
    await api.delete(`/messages/${id}`);

    setMessages((prev) =>
      prev.filter((msg) => msg.id !== id)
    );
  } catch (err) {
    console.error("Delete failed:", err);
  }
};

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
        const rawData = response.data;
        const rawMessages = Array.isArray(rawData) ? rawData : rawData?.data || [];
        
        // Map messages to clean client schema format
        const formatted = rawMessages.map((msg: any) => {
          const senderId = typeof msg.sender === 'object' 
            ? msg.sender?.id || msg.sender?._id 
            : msg.senderId || msg.sender;
          
          const senderName = typeof msg.sender === 'object' 
            ? msg.sender?.name 
            : msg.senderName || 'User';

          return {
            id: msg.id || msg._id || '',
            senderId: senderId || '',
            senderName: senderName || 'User',
            channelId: msg.channel?.id || msg.channel?._id || msg.channelId || msg.channel || '',
            content: msg.content,
            timestamp: msg.createdAt || msg.timestamp || new Date().toISOString()
          };
        });

        // Sort chronologically (oldest first)
        formatted.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        setMessages(formatted);
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
      if (message) {
        const senderId = typeof message.sender === 'object' 
          ? message.sender?.id || message.sender?._id 
          : message.senderId || message.sender;

        const senderName = typeof message.sender === 'object' 
          ? message.sender?.name 
          : message.senderName || 'User';

        const formatted: IMessage = {
          id: message.id || message._id || '',
          senderId: senderId || '',
          senderName: senderName || 'User',
          channelId: message.channel?.id || message.channel?._id || message.channelId || message.channel || '',
          content: message.content,
          timestamp: message.createdAt || message.timestamp || new Date().toISOString()
        };

        if (formatted.channelId === channelId) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === formatted.id)) return prev;
            return [...prev, formatted];
          });
        }
      }
    };

    socket.on('chat:message', handleNewMessage);

    return () => {
      socket.off('chat:message', handleNewMessage);
    };
  }, [socket, channelId]);

if (!activeChannel) {
  return (
    <div className="flex-1 flex flex-col h-screen bg-[#0F0F16]">

      <ChannelHeader />

      <div className="flex-1 flex flex-col items-center justify-center text-text-muted font-body">
        <p className="text-base font-semibold">
          Welcome to Infotact Solutions Chat
        </p>

        <p className="text-xs mt-1">
          Select a channel from the sidebar to start messaging
        </p>
      </div>

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
        <MessageList
        messages={messages}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      )}

      {/* Typing Indicator */}
      <TypingIndicator />

      {/* Message Input */}
      <MessageInput />
    </div>
  );
};

export default ChatArea;
