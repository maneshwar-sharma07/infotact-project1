import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../../services/socket.ts';
import { useWorkspace } from '../../hooks/useWorkspace.ts';

export const TypingIndicator: React.FC = () => {
  const { activeChannel } = useWorkspace();
  const [typers, setTypers] = useState<string[]>([]);
  const timeoutsRef = useRef<{ [userName: string]: ReturnType<typeof setTimeout> }>({});

  const channelId = activeChannel?.id;

  useEffect(() => {
    if (!channelId) {
      setTypers([]);
      return;
    }

    const handleTypingStart = (data: { userName: string }) => {
      const { userName } = data;
      if (!userName) return;

      setTypers((prev) => {
        if (prev.includes(userName)) return prev;
        return [...prev, userName];
      });

      // Clear existing timeout for this user if any
      if (timeoutsRef.current[userName]) {
        clearTimeout(timeoutsRef.current[userName]);
      }

      // Auto-remove after 3 seconds of no activity
      timeoutsRef.current[userName] = setTimeout(() => {
        setTypers((prev) => prev.filter((name) => name !== userName));
        delete timeoutsRef.current[userName];
      }, 3000);
    };

    const handleTypingStop = (data?: { userName?: string }) => {
      const userName = data?.userName;
      if (userName) {
        if (timeoutsRef.current[userName]) {
          clearTimeout(timeoutsRef.current[userName]);
          delete timeoutsRef.current[userName];
        }
        setTypers((prev) => prev.filter((name) => name !== userName));
      }
    };

    socket.on('typing:start', handleTypingStart);
    socket.on('typing:stop', handleTypingStop);

    return () => {
      socket.off('typing:start', handleTypingStart);
      socket.off('typing:stop', handleTypingStop);
      // Clear all active timeouts on cleanup
      Object.values(timeoutsRef.current).forEach(clearTimeout);
      timeoutsRef.current = {};
    };
  }, [channelId]);

  if (typers.length === 0) {
    // Return empty space placeholder to prevent layout shifts
    return <div className="h-5 py-1 px-4 transition-all duration-300 opacity-0" />;
  }

  // Format typing users text
  let text = '';
  if (typers.length === 1) {
    text = `${typers[0]} is typing...`;
  } else if (typers.length === 2) {
    text = `${typers[0]} and ${typers[1]} are typing...`;
  } else {
    text = 'Several people are typing...';
  }

  return (
    <div className="h-5 py-1 px-4 flex items-center gap-2 text-xs text-text-muted font-body transition-all duration-300 opacity-100">
      <div className="flex gap-0.5 items-center">
        <span className="w-1 h-1 bg-text-muted rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-1 h-1 bg-text-muted rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-1 h-1 bg-text-muted rounded-full animate-bounce"></span>
      </div>
      <span>{text}</span>
    </div>
  );
};

export default TypingIndicator;
