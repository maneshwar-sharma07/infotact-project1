import React from 'react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = '#7C3AED',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-[2px]',
    md: 'w-6 h-6 border-[2px]',
    lg: 'w-10 h-10 border-[3px]',
  };

  const isHex = color.startsWith('#') || color.startsWith('rgb') || color === 'currentColor';

  const style = isHex
    ? {
        borderTopColor: color,
        borderLeftColor: color,
        borderBottomColor: color,
        borderRightColor: 'transparent',
      }
    : {};

  const borderClass = isHex ? 'border-transparent' : `border-${color} border-r-transparent`;

  return (
    <div
      className={`inline-block animate-spin rounded-full ${sizeClasses[size]} ${borderClass} ${className}`}
      style={style}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
