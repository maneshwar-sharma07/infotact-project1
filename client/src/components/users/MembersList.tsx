import React, { useEffect, useState, useCallback } from 'react';
import { Users, Loader2 } from 'lucide-react';
import api from '../../services/api.ts';
import { useWorkspace } from '../../hooks/useWorkspace.ts';
import type { IUser } from '../../types/index.ts';

/* ─── Sub-components ─────────────────────────────────────────────── */

interface OnlineBadgeProps {
  isOnline: boolean;
}

const OnlineBadge: React.FC<OnlineBadgeProps> = ({ isOnline }) => (
  <span
    className={`relative flex-shrink-0 w-2.5 h-2.5 rounded-full border-2 border-[#0F0F16] ${
      isOnline ? 'bg-emerald-400' : 'bg-[#334155]'
    }`}
  >
    {isOnline && (
      <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
    )}
  </span>
);

interface UserAvatarProps {
  name: string;
  isOnline: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ name, isOnline }) => {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="relative flex-shrink-0">
      <div className="w-8 h-8 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-xs font-semibold font-heading select-none">
        {initials}
      </div>
      {/* Badge positioned bottom-right of avatar */}
      <span className="absolute -bottom-0.5 -right-0.5">
        <OnlineBadge isOnline={isOnline} />
      </span>
    </div>
  );
};

/* ─── MembersList ─────────────────────────────────────────────────── */

interface MembersResponse {
  success: boolean;
  data: IUser[];
}

const MembersList: React.FC = () => {
  const { activeWorkspace } = useWorkspace();
  const [members, setMembers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async (workspaceId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get<MembersResponse>(`/workspaces/${workspaceId}/members`);
      const rawData = res.data;
      const list = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.data)
        ? rawData.data
        : [];
      setMembers(list);
    } catch {
      setError('Could not load members.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeWorkspace?.id) {
      fetchMembers(activeWorkspace.id);
    } else {
      setMembers([]);
    }
  }, [activeWorkspace?.id, fetchMembers]);

  const onlineMembers = members.filter((m) => m.isOnline);

  return (
    <aside className="w-[220px] h-screen bg-[#07070A] border-l border-[#1E1E2F] flex flex-col flex-shrink-0 select-none">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-[#1E1E2F]">
        <Users size={14} className="text-[#64748B]" />
        <span className="text-xs font-semibold text-[#64748B] uppercase tracking-widest font-body">
          Members
        </span>
        {!isLoading && members.length > 0 && (
          <span className="ml-auto text-xs text-[#64748B] font-body">
            {onlineMembers.length}/{members.length}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto py-3 scrollbar-thin scrollbar-thumb-[#1E293B] scrollbar-track-transparent">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={18} className="text-[#7C3AED] animate-spin" />
          </div>
        ) : error ? (
          <p className="text-xs text-red-400 px-4 py-3 font-body">{error}</p>
        ) : members.length === 0 ? (
          <p className="text-xs text-[#64748B] px-4 py-3 font-body">No members found.</p>
        ) : (
          <>
            {/* Online section */}
            {onlineMembers.length > 0 && (
              <section className="mb-3">
                <p className="px-4 pb-1.5 text-[10px] font-semibold text-[#64748B] uppercase tracking-widest font-body">
                  Online — {onlineMembers.length}
                </p>
                {onlineMembers.map((member) => (
                  <MemberRow key={member.id} member={member} />
                ))}
              </section>
            )}

            {/* Offline section */}
            {members.filter((m) => !m.isOnline).length > 0 && (
              <section>
                <p className="px-4 pb-1.5 text-[10px] font-semibold text-[#64748B] uppercase tracking-widest font-body">
                  Offline — {members.filter((m) => !m.isOnline).length}
                </p>
                {members
                  .filter((m) => !m.isOnline)
                  .map((member) => (
                    <MemberRow key={member.id} member={member} />
                  ))}
              </section>
            )}
          </>
        )}
      </div>
    </aside>
  );
};

/* ─── MemberRow ──────────────────────────────────────────────────── */

const MemberRow: React.FC<{ member: IUser }> = ({ member }) => (
  <div className="flex items-center gap-2.5 px-4 py-1.5 hover:bg-[#111118] rounded-md mx-1 transition-colors duration-150 cursor-default group">
    <UserAvatar name={member.name} isOnline={member.isOnline} />
    <div className="flex flex-col min-w-0">
      <span className="text-sm text-[#CBD5E1] font-body truncate group-hover:text-[#F1F5F9] transition-colors">
        {member.name}
      </span>
      {member.role === 'admin' && (
        <span className="text-[10px] text-[#7C3AED] font-semibold font-body uppercase tracking-wider">
          Admin
        </span>
      )}
    </div>
  </div>
);

export default MembersList;
