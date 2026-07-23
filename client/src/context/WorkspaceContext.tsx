import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { IWorkspace, IChannel } from '../types/index.ts';
import api from '../services/api.ts';
import { useAuth } from '../hooks/useAuth.ts';
import { socket } from '../services/socket.ts';

export interface WorkspaceContextType {
  activeWorkspace: IWorkspace | null;
  activeChannel: IChannel | null;
  workspaces: IWorkspace[];
  setActiveWorkspace: (workspace: IWorkspace) => void;
  setActiveChannel: (channel: IChannel) => void;
  fetchWorkspaces: () => Promise<void>;
  updateWorkspace: (workspace: IWorkspace) => void;
  removeWorkspace: (workspaceId: string) => void;
  addChannelToWorkspace: (workspaceId: string, channel: IChannel) => void;
}

export const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workspaces, setWorkspaces] = useState<IWorkspace[]>([]);
  const [activeWorkspace, setActiveWorkspaceState] = useState<IWorkspace | null>(null);
  const [activeChannel, setActiveChannelState] = useState<IChannel | null>(null);
  const { isAuthenticated } = useAuth();

  const { workspaceId, channelId } = useParams<{ workspaceId: string; channelId: string }>();
  const navigate = useNavigate();

  const getId = (item: any) => {
    if (typeof item === "string") return item;
    return String(item?.id || item?._id || "");
  };

  const normalizeChannel = (channel: any): IChannel => ({
    ...channel,
    id: getId(channel),
    workspaceId:
      channel?.workspaceId ||
      channel?.workspace?.id ||
      channel?.workspace?._id ||
      channel?.workspace ||
      "",
  });

  const normalizeWorkspace = (workspace: any): IWorkspace => ({
    ...workspace,
    id: getId(workspace),
    ownerId:
      workspace?.ownerId ||
      workspace?.createdBy?.id ||
      workspace?.createdBy?._id ||
      workspace?.createdBy ||
      "",
    channels: ((workspace?.channels || []) as any[]).map((channel) =>
      typeof channel === "object" ? normalizeChannel(channel) : channel
    ),
    members: workspace?.members || [],
  });

  const getWorkspaceChannels = (workspace: IWorkspace | null) =>
    (((workspace?.channels || []) as any[]).filter(
      (c) => c && typeof c === "object" && "name" in c
    ) as IChannel[]);
  
  const fetchWorkspaces = async () => {
  try {
    const response = await api.get("/workspaces");

    const rawData = response.data;
    const workspacesList = (Array.isArray(rawData)
      ? rawData
      : rawData?.data || []).map(normalizeWorkspace);

    setWorkspaces(workspacesList);

    if (workspacesList.length > 0) {
      let targetWorkspace =
        workspacesList.find((w: any) => w.id === workspaceId) ||
        workspacesList[0];

      setActiveWorkspaceState(targetWorkspace);

      const workspaceChannels = getWorkspaceChannels(targetWorkspace);

      let targetChannel =
        workspaceChannels.find((c: any) => c.id === channelId) ||
        workspaceChannels[0];

      if (targetChannel) {
        setActiveChannelState(targetChannel);
      }

      if (
        targetWorkspace &&
        targetChannel &&
        targetWorkspace.id &&
        targetChannel.id &&
        (workspaceId === "default" ||
          channelId === "general" ||
          workspaceId !== targetWorkspace.id ||
          channelId !== targetChannel.id)
      ) {
        navigate(`/app/${targetWorkspace.id}/${targetChannel.id}`, {
          replace: true,
        });
      }
    }
  } catch (error) {
    console.error("Failed to fetch workspaces:", error);
  }
};

  const setActiveWorkspace = (workspace: IWorkspace) => {
    const normalizedWorkspace = normalizeWorkspace(workspace);
    setActiveWorkspaceState(normalizedWorkspace);
    
    const workspaceChannels = getWorkspaceChannels(normalizedWorkspace);

    const firstChannel = workspaceChannels.length > 0 ? workspaceChannels[0] : null;
    setActiveChannelState(firstChannel);
    
    if (normalizedWorkspace.id && firstChannel?.id) {
      navigate(`/app/${normalizedWorkspace.id}/${firstChannel.id}`);
    } else if (normalizedWorkspace.id) {
      navigate(`/app/${normalizedWorkspace.id}/no-channel`);
    }
  };

  const setActiveChannel = (channel: IChannel) => {
    const normalizedChannel = normalizeChannel(channel);
    setActiveChannelState(normalizedChannel);
    if (activeWorkspace?.id && normalizedChannel.id) {
      navigate(`/app/${activeWorkspace.id}/${normalizedChannel.id}`);
    }
  };
  const updateWorkspace = (updatedWorkspace: IWorkspace) => {
  const normalizedWorkspace = normalizeWorkspace(updatedWorkspace);

  setWorkspaces((prev) =>
    prev.map((ws) =>
      ws.id === normalizedWorkspace.id ? normalizedWorkspace : ws
    )
  );

  setActiveWorkspaceState(normalizedWorkspace);
};

  const removeWorkspace = (workspaceId: string) => {
    setWorkspaces((previous) => previous.filter((workspace) => workspace.id !== workspaceId));
    setActiveWorkspaceState((current) => {
      if (current?.id !== workspaceId) return current;
      setActiveChannelState(null);
      navigate('/app/default/general', { replace: true });
      return null;
    });
  };

  const addChannelToWorkspace = (workspaceId: string, channel: IChannel) => {
    const nextChannel = normalizeChannel(channel);
    const normalizedChannel = {
      ...nextChannel,
      workspaceId: nextChannel.workspaceId || workspaceId,
    };

    if (!workspaceId || !normalizedChannel.id) return;

    setWorkspaces((prev) =>
      prev.map((workspace) => {
        if (workspace.id !== workspaceId) return workspace;

        const channels = getWorkspaceChannels(workspace);
        const nextChannels = channels.some((item) => item.id === normalizedChannel.id)
          ? channels
          : [...channels, normalizedChannel];

        return {
          ...workspace,
          channels: nextChannels,
        };
      })
    );

    setActiveWorkspaceState((current) => {
      if (!current || current.id !== workspaceId) return current;
      const channels = getWorkspaceChannels(current);
      const nextChannels = channels.some((item) => item.id === normalizedChannel.id)
        ? channels
        : [...channels, normalizedChannel];
      return {
        ...current,
        channels: nextChannels,
      };
    });

    setActiveChannelState(normalizedChannel);
    if (workspaceId && normalizedChannel.id) {
      navigate(`/app/${workspaceId}/${normalizedChannel.id}`);
    }
  };

  // On mount: fetch workspaces if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkspaces();
    } else {
      setWorkspaces([]);
      setActiveWorkspaceState(null);
      setActiveChannelState(null);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    // Membership events can arrive through the workspace room or the user's
    // private room. Refetching keeps workspace and member data consistent.
    const refreshForMembershipChange = () => { void fetchWorkspaces(); };
    socket.on('workspace:member-added', refreshForMembershipChange);
    socket.on('workspace:member-left', refreshForMembershipChange);
    socket.on('workspace:member-removed', refreshForMembershipChange);
    socket.on('channel:created', refreshForMembershipChange);
    socket.on('channel:deleted', refreshForMembershipChange);
    return () => {
      socket.off('workspace:member-added', refreshForMembershipChange);
      socket.off('workspace:member-left', refreshForMembershipChange);
      socket.off('workspace:member-removed', refreshForMembershipChange);
      socket.off('channel:created', refreshForMembershipChange);
      socket.off('channel:deleted', refreshForMembershipChange);
    };
  }, [isAuthenticated]);

  // Sync state if URL changes (like browser back/forward buttons)
  useEffect(() => {
    if (workspaces.length === 0) return;

    const matchedWorkspace = workspaces.find((w) => w.id === workspaceId);
    if (matchedWorkspace && matchedWorkspace.id !== activeWorkspace?.id) {
      setActiveWorkspaceState(matchedWorkspace);

      const workspaceChannels = getWorkspaceChannels(matchedWorkspace);

      const matchedChannel = workspaceChannels.find((c) => c.id === channelId) || workspaceChannels[0] || null;
      setActiveChannelState(matchedChannel);
    } else if (activeWorkspace) {
      const workspaceChannels = getWorkspaceChannels(activeWorkspace);

      const matchedChannel = workspaceChannels.find((c) => c.id === channelId);
      if (matchedChannel && matchedChannel.id !== activeChannel?.id) {
        setActiveChannelState(matchedChannel);
      }
    }
  }, [workspaceId, channelId, workspaces]);

  return (
    <WorkspaceContext.Provider
    value={{
      activeWorkspace,
      activeChannel,
      workspaces,
      setActiveWorkspace,
      setActiveChannel,
      fetchWorkspaces,
      updateWorkspace,
      removeWorkspace,
      addChannelToWorkspace,
    }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspaceContext = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspaceContext must be used within a WorkspaceProvider');
  }
  return context;
};
