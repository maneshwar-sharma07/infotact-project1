import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Hash,
  Loader2,
  LockKeyhole,
  Users,
  Workflow,
} from "lucide-react";
import api from "../services/api.ts";
import { useAuth } from "../hooks/useAuth.ts";
import { useToast } from "../components/ui/ToastProvider.tsx";

interface InviteWorkspace {
  workspaceId: string;
  name: string;
  description: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  memberCount: number;
  channelCount: number;
  generalChannelId: string;
  isMember: boolean;
}

type InviteError = "invalid" | "expired" | "generic" | null;

const InvitePage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [workspace, setWorkspace] = useState<InviteWorkspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<InviteError>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const fetchInvite = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/workspaces/join/${token}`);
        setWorkspace(response.data.data);
      } catch (err: any) {
        console.error(err);
        const code = err.response?.data?.code;
        const status = err.response?.status;

        if (code === "INVITE_EXPIRED" || status === 410) {
          setError("expired");
        } else if (code === "INVITE_INVALID" || status === 404) {
          setError("invalid");
        } else {
          setError("generic");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInvite();
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  const openWorkspace = (target?: InviteWorkspace) => {
    const nextWorkspace = target || workspace;
    if (!nextWorkspace) return;

    navigate(
      `/app/${nextWorkspace.workspaceId}/${nextWorkspace.generalChannelId || "general"}`,
      { replace: true }
    );
  };

  const handleJoin = async () => {
    if (!token) return;

    try {
      setJoining(true);
      const response = await api.post(`/workspaces/join/${token}`);
      const joinedWorkspace = response.data.data;

      showToast(
        response.data.alreadyMember
          ? "You are already a member"
          : "Joined workspace successfully"
      );

      navigate(
        `/app/${joinedWorkspace.workspaceId}/${joinedWorkspace.generalChannelId || "general"}`,
        { replace: true }
      );
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.message || "Unable to join workspace", "error");
    } finally {
      setJoining(false);
    }
  };

  const renderStatusPage = (
    title: string,
    subtitle: string,
    icon: React.ReactNode,
    actionLabel = "Go Home"
  ) => (
    <div className="flex min-h-screen items-center justify-center bg-[#08090d] px-4 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[110px]" />
      </div>

      <div className="relative w-full max-w-md rounded-3xl border border-[#1E293B] bg-[#111118]/95 p-8 text-center shadow-2xl shadow-black/40">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-200">
          {icon}
        </div>
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">{subtitle}</p>
        <button
          onClick={() => navigate("/app/default/general", { replace: true })}
          className="mt-7 inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 text-sm font-bold text-white shadow-lg shadow-violet-600/25 transition duration-200 hover:scale-[1.02] hover:shadow-violet-600/40"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );

  if (loading) {
    return renderStatusPage(
      "Loading invite",
      "We are checking this workspace invitation for you.",
      <Loader2 size={26} className="animate-spin" />,
      "Please wait"
    );
  }

  if (error === "expired") {
    return renderStatusPage(
      "Invite Expired",
      "Generate a new invite.",
      <LockKeyhole size={26} />,
    );
  }

  if (error === "generic") {
    return renderStatusPage(
      "Invite Unavailable",
      "We could not load this workspace invite. Please try again.",
      <AlertTriangle size={26} />,
    );
  }

  if (error === "invalid" || !workspace) {
    return renderStatusPage(
      "Invite Invalid",
      "This invitation has expired or does not exist.",
      <AlertTriangle size={26} />,
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08090d] px-4 py-10 text-white">
      <div className="absolute inset-0">
        <div className="absolute left-[15%] top-[18%] h-72 w-72 rounded-full bg-violet-600/10 blur-[90px]" />
        <div className="absolute bottom-[12%] right-[12%] h-72 w-72 rounded-full bg-fuchsia-600/10 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-[#1E293B] bg-[#111118]/95 shadow-2xl shadow-black/40 backdrop-blur-xl animate-scale-up">
        <div className="border-b border-[#1E293B] bg-gradient-to-br from-violet-600/20 via-[#111118] to-[#111118] p-8">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/25">
            <Workflow size={26} />
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-violet-300">
            Workspace Invite
          </p>
          <h1 className="text-4xl font-bold text-white">{workspace.name}</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
            {workspace.description || "You have been invited to join this workspace."}
          </p>
        </div>

        <div className="space-y-6 p-8">
          <div className="rounded-3xl border border-[#1E293B] bg-[#0A0A0F] p-5">
            <p className="text-base font-semibold text-white">
              You have been invited to join this workspace.
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Join to access team channels, real-time messages, and collaboration updates.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#1E293B] bg-[#181824] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Owner
              </p>
              <p className="mt-2 truncate text-sm font-semibold text-white">
                {workspace.owner.name}
              </p>
            </div>

            <div className="rounded-2xl border border-[#1E293B] bg-[#181824] p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                <Users size={14} />
                Members
              </div>
              <p className="mt-2 text-2xl font-bold text-white">{workspace.memberCount}</p>
            </div>

            <div className="rounded-2xl border border-[#1E293B] bg-[#181824] p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                <Hash size={14} />
                Channels
              </div>
              <p className="mt-2 text-2xl font-bold text-white">{workspace.channelCount}</p>
            </div>
          </div>

          {workspace.isMember ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
                <CheckCircle2 size={18} />
                You are already a member
              </div>
              <button
                onClick={() => openWorkspace()}
                className="flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 font-bold text-white shadow-lg shadow-violet-600/25 transition duration-200 hover:scale-[1.01] hover:shadow-violet-600/40"
              >
                Open Workspace
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleJoin}
              disabled={joining}
              className="flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 font-bold text-white shadow-lg shadow-violet-600/25 transition duration-200 hover:scale-[1.01] hover:shadow-violet-600/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {joining ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
              {joining ? "Joining workspace..." : "Join Workspace"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvitePage;
