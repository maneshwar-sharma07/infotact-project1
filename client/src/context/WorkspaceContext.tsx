import React, { createContext, useContext, useState, useEffect } from 'react';
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
}

export const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workspaces, setWorkspaces] = useState<IWorkspace[]>([]);
  const [activeWorkspace, setActiveWorkspaceState] = useState<IWorkspace | null>(null);
  const [activeChannel, setActiveChannelState] = useState<IChannel | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchWorkspaces = async () => {
    try {
      const response = await api.get('/workspaces');
      const data = response.data as IWorkspace[];
      setWorkspaces(data);
      
      // If there's no active workspace, default to the first workspace loaded
      if (!activeWorkspace && data.length > 0) {
        setActiveWorkspace(data[0]!);
      }
    } catch (error) {
      console.error('Failed to fetch workspaces:', error);
    }
  };

  const setActiveWorkspace = (workspace: IWorkspace) => {
    setActiveWorkspaceState(workspace);
    
    // Auto-select the first channel of this workspace if available
    if (workspace.channels && workspace.channels.length > 0) {
      const firstChannel = workspace.channels[0];
      if (firstChannel && typeof firstChannel === 'object') {
        setActiveChannelState(firstChannel as IChannel);
      } else {
        setActiveChannelState(null);
      }
    } else {
      setActiveChannelState(null);
    }
  };

  const setActiveChannel = (channel: IChannel) => {
    setActiveChannelState(channel);
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

  return (
    <WorkspaceContext.Provider
      value={{
        activeWorkspace,
        activeChannel,
        workspaces,
        setActiveWorkspace,
        setActiveChannel,
        fetchWorkspaces,
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
