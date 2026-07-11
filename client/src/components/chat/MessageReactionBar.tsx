import { useMemo } from "react";
import type { IMessageReaction } from "../../types";
import ReactionBubble from "./ReactionBubble";

interface MessageReactionBarProps {
  reactions: IMessageReaction[];
  currentUserId?: string;
  onToggle: (emoji: string) => void;
}

const MessageReactionBar = ({
  reactions,
  currentUserId,
  onToggle,
}: MessageReactionBarProps) => {
  const reactionGroups = useMemo(
    () => reactions.map((reaction) => ({
      emoji: reaction.emoji,
      count: reaction.users.length,
      reactedByCurrentUser: Boolean(currentUserId && reaction.users.includes(currentUserId)),
    })),
    [currentUserId, reactions]
  );

  if (reactionGroups.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Message reactions">
      {reactionGroups.map((reaction) => (
        <ReactionBubble
          key={reaction.emoji}
          emoji={reaction.emoji}
          count={reaction.count}
          isActive={reaction.reactedByCurrentUser}
          onClick={() => onToggle(reaction.emoji)}
        />
      ))}
    </div>
  );
};

export default MessageReactionBar;
