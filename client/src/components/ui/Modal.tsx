import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock body scroll and register keyboard listener when modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If the click is outside the white modal content box
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        ref={panelRef}
        className={`w-full glass-card bg-[#111118]/90 text-[#F1F5F9] border border-[#7C3AED]/20 shadow-2xl p-6 rounded-lg flex flex-col relative transform animate-scale-up ${sizeClasses[size]}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-[#1E293B]/60 pb-3">
          {title && (
            <h3 className="text-lg font-bold text-[#7C3AED] font-heading tracking-wide">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#64748B] hover:text-[#F1F5F9] hover:bg-white/5 transition-colors cursor-pointer ml-auto"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 text-sm text-[#F1F5F9] leading-relaxed overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
