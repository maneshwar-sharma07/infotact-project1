import React, { useId } from 'react';
import { LucideIcon } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      placeholder,
      type = 'text',
      value,
      onChange,
      error,
      disabled = false,
      className = '',
      icon: Icon,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className={`w-full flex flex-col gap-1.5 font-body ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-text-muted select-none text-left"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {Icon && (
            <div className="absolute left-3 text-text-muted flex items-center justify-center pointer-events-none">
              <Icon size={16} />
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full bg-[#111118] text-[#F1F5F9] placeholder:text-[#64748B] text-sm border rounded-[4px] py-2.5 px-3.5 transition-all duration-200 ease-in-out font-body input-glow
              ${Icon ? 'pl-10' : 'pl-3.5'}
              ${error 
                ? 'border-[#EF4444] focus:border-[#EF4444] focus:shadow-[0_0_0_2px_rgba(239,68,68,0.4)]' 
                : 'border-[#1E293B] focus:border-[#7C3AED] focus:shadow-[0_0_0_2px_rgba(124,58,237,0.4)]'
              }
              disabled:opacity-50 disabled:cursor-not-allowed`}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs text-[#EF4444] font-medium text-left select-none">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
