import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { IWorkspace, IChannel } from '../types/index.ts';
import api from '../services/api.ts';
import { useAuth } from '../hooks/useAuth.ts';

export interface WorkspaceContextType {
  activeWorkspace: IWorkspace | null;
  activeChannel: IChannel | null;
  workspaces: IWorkspace[];
  setActiveWorkspace: (workspace: IWorkspace) => void;
  setActiveChannel: (channel: IChannel) => void;
  fetchWorkspaces: () => Promise<void>;
  updateWorkspace: (workspace: IWorkspace) => void;
}

export const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workspaces, setWorkspaces] = useState<IWorkspace[]>([]);
  const [activeWorkspace, setActiveWorkspaceState] = useState<IWorkspace | null>(null);
  const [activeChannel, setActiveChannelState] = useState<IChannel | null>(null);
  const { isAuthenticated } = useAuth();

  const { workspaceId, channelId } = useParams<{ workspaceId: string; channelId: string }>();
  const navigate = useNavigate();
  
  const fetchWorkspaces = async () => {
  try {
    console.log("Token:", localStorage.getItem("token"));

    const response = await api.get("/workspaces");

    console.log("Workspace Response:", response.data);

    const rawData = response.data;
    const workspacesList = Array.isArray(rawData)
      ? rawData
      : rawData?.data || [];

    setWorkspaces(workspacesList);

    if (workspacesList.length > 0) {
      let targetWorkspace =
        workspacesList.find((w: any) => w.id === workspaceId) ||
        workspacesList[0];

      setActiveWorkspaceState(targetWorkspace);

      const workspaceChannels = (
        (targetWorkspace?.channels || []) as any[]
      ).filter(
        (c) => c && typeof c === "object" && "name" in c
      ) as IChannel[];

      let targetChannel =
        workspaceChannels.find((c: any) => c.id === channelId) ||
        workspaceChannels[0];

      if (targetChannel) {
        setActiveChannelState(targetChannel);
      }

      if (
        targetWorkspace &&
        targetChannel &&
        (workspaceId === "default" || channelId === "general")
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
    setActiveWorkspaceState(workspace);
    
    const workspaceChannels = ((workspace?.channels || []) as any[]).filter(
      (c) => c && typeof c === 'object' && 'name' in c
    ) as IChannel[];

    const firstChannel = workspaceChannels.length > 0 ? workspaceChannels[0] : null;
    setActiveChannelState(firstChannel);
    
    if (firstChannel) {
      navigate(`/app/${workspace.id}/${firstChannel.id}`);
    } else {
      navigate(`/app/${workspace.id}/no-channel`);
    }
  };

  const setActiveChannel = (channel: IChannel) => {
    setActiveChannelState(channel);
    if (activeWorkspace) {
      navigate(`/app/${activeWorkspace.id}/${channel.id}`);
    }
  };
  const updateWorkspace = (updatedWorkspace: IWorkspace) => {
  setWorkspaces((prev) =>
    prev.map((ws) =>
      ws.id === updatedWorkspace.id ? updatedWorkspace : ws
    )
  );

  setActiveWorkspaceState(updatedWorkspace);
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

  // Sync state if URL changes (like browser back/forward buttons)
  useEffect(() => {
    if (workspaces.length === 0) return;

    const matchedWorkspace = workspaces.find((w) => w.id === workspaceId);
    if (matchedWorkspace && matchedWorkspace.id !== activeWorkspace?.id) {
      setActiveWorkspaceState(matchedWorkspace);

      const workspaceChannels = ((matchedWorkspace?.channels || []) as any[]).filter(
        (c) => c && typeof c === 'object' && 'name' in c
      ) as IChannel[];

      const matchedChannel = workspaceChannels.find((c) => c.id === channelId) || workspaceChannels[0] || null;
      setActiveChannelState(matchedChannel);
    } else if (activeWorkspace) {
      const workspaceChannels = ((activeWorkspace?.channels || []) as any[]).filter(
        (c) => c && typeof c === 'object' && 'name' in c
      ) as IChannel[];

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
