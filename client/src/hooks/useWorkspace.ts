import { useWorkspaceContext } from '../context/WorkspaceContext.tsx';

export const useWorkspace = () => {
  const context = useWorkspaceContext();
  
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }

  return {
    activeWorkspace: context.activeWorkspace,
    activeChannel: context.activeChannel,
    workspaces: context.workspaces,
    setActiveWorkspace: context.setActiveWorkspace,
    setActiveChannel: context.setActiveChannel,
    fetchWorkspaces: context.fetchWorkspaces,
  };
};

export default useWorkspace;
