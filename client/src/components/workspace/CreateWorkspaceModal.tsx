import React, { useState } from 'react';
import { X, Loader2, Hash } from 'lucide-react';
import api from '../../services/api.ts';
import { useWorkspace } from '../../hooks/useWorkspace.ts';
import Button from '../ui/Button.tsx';

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateWorkspaceModal: React.FC<CreateWorkspaceModalProps> = ({ isOpen, onClose }) => {
  const { fetchWorkspaces } = useWorkspace();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Workspace name is required.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await api.post('/workspaces', {
        name: name.trim(),
        description: description.trim() || undefined,
      });

      await fetchWorkspaces();
      handleClose();
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(message || 'Failed to create workspace. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setError(null);
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      {/* Modal Card */}
      <div className="relative w-full max-w-md mx-4 bg-[#0F0F16] border border-[#1E1E2F] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] animate-modal-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1E1E2F]">
          <div>
            <h2 className="text-lg font-heading font-semibold text-[#F1F5F9]">
              Create a Workspace
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5 font-body">
              A workspace is where your team communicates.
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748B] hover:text-[#F1F5F9] hover:bg-[#1E293B] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Workspace Name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="workspace-name"
              className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider font-body"
            >
              Workspace Name <span className="text-[#7C3AED]">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]">
                <Hash size={14} />
              </span>
              <input
                id="workspace-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. My Team"
                maxLength={80}
                disabled={isLoading}
                className="w-full bg-[#111118] text-[#F1F5F9] placeholder:text-[#64748B] text-sm border border-[#1E293B] rounded-lg py-2.5 pl-8 pr-4 focus:outline-none focus:border-[#7C3AED] focus:shadow-[0_0_0_2px_rgba(124,58,237,0.3)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-body"
              />
            </div>
          </div>

          {/* Description (optional) */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="workspace-description"
              className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider font-body"
            >
              Description{' '}
              <span className="text-[#64748B] normal-case tracking-normal font-normal">
                (optional)
              </span>
            </label>
            <textarea
              id="workspace-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this workspace for?"
              rows={3}
              maxLength={240}
              disabled={isLoading}
              className="w-full bg-[#111118] text-[#F1F5F9] placeholder:text-[#64748B] text-sm border border-[#1E293B] rounded-lg py-2.5 px-4 focus:outline-none focus:border-[#7C3AED] focus:shadow-[0_0_0_2px_rgba(124,58,237,0.3)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-none font-body"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5 font-body">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-lg border border-[#1E293B] text-[#94A3B8] text-sm font-semibold hover:text-[#F1F5F9] hover:border-[#334155] hover:bg-[#111118] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-body"
            >
              Cancel
            </button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading || !name.trim()}
              className="flex-1 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Creating…
                </>
              ) : (
                'Create Workspace'
              )}
            </Button>
          </div>
        </form>

        {/* Decorative violet glow at top */}
        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent" />
      </div>

      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
        .animate-modal-in {
          animation: modal-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CreateWorkspaceModal;
