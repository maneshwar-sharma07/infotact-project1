import React from 'react';
import OnlineBadge from './OnlineBadge.tsx';

interface UserAvatarProps {
  name: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  isOnline?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  imageUrl,
  size = 'md',
  isOnline,
}) => {
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const badgePositionClasses = {
    sm: '-bottom-0.5 -right-0.5',
    md: 'bottom-0 right-0',
    lg: 'bottom-0.5 right-0.5',
  };

  return (
    <div className="relative inline-block flex-shrink-0 select-none">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className={`${sizeClasses[size]} rounded-full object-cover border border-[#1E293B]`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-semibold font-heading`}
        >
          {initials}
        </div>
      )}

      {isOnline !== undefined && (
        <span className={`absolute ${badgePositionClasses[size]}`}>
          <OnlineBadge isOnline={isOnline} />
        </span>
      )}
    </div>
  );
};

export default UserAvatar;
