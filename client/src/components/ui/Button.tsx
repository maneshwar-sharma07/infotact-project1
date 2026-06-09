import React from 'react';
import Spinner from './Spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      onClick,
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      type = 'button',
      className = '',
      ...props
    },
    ref
  ) => {
    // Style mappings
    const baseStyles = 'inline-flex items-center justify-center font-body font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent-primary/40 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';
    
    const variantStyles = {
      primary: 'bg-accent-primary text-white hover:bg-[#6D28D9] border border-transparent shadow-sm shadow-accent-primary/20',
      secondary: 'glass-card border border-accent-primary text-accent-primary hover:bg-accent-primary/10 active:bg-accent-primary/20',
      ghost: 'bg-transparent text-text-muted hover:bg-white/5 hover:text-text-primary active:bg-white/10',
      danger: 'bg-[#EF4444] text-white hover:bg-[#DC2626] active:bg-[#B91C1C] border border-transparent shadow-sm shadow-red-500/20',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs rounded-[4px] gap-1.5',
      md: 'px-4 py-2 text-sm rounded-[4px] gap-2',
      lg: 'px-6 py-3 text-base rounded-[6px] gap-2.5',
    };

    const spinnerSize = size === 'lg' ? 'md' : 'sm';

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) {
        e.preventDefault();
        return;
      }
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={handleClick}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {loading ? (
          <>
            <Spinner size={spinnerSize} color="currentColor" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
