import React from 'react';

interface OnlineBadgeProps {
  isOnline: boolean;
  className?: string;
}

export const OnlineBadge: React.FC<OnlineBadgeProps> = ({ isOnline, className = '' }) => {
  return (
    <span
      className={`relative inline-block w-2.5 h-2.5 rounded-full border-2 border-[#0F0F16] transition-colors duration-300 ${
        isOnline ? 'bg-[#10B981]' : 'bg-[#64748B]'
      } ${className}`}
    >
      {isOnline && (
        <span className="absolute inset-0 rounded-full bg-[#10B981] animate-pulse opacity-75" />
      )}
    </span>
  );
};

export default OnlineBadge;
