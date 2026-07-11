import { useWorkspaceContext } from '../context/WorkspaceContext.tsx';

export const useWorkspace = () => {
  const context = useWorkspaceContext();

  return {
    activeWorkspace: context.activeWorkspace,
    activeChannel: context.activeChannel,
    workspaces: context.workspaces,
    setActiveWorkspace: context.setActiveWorkspace,
    setActiveChannel: context.setActiveChannel,
    fetchWorkspaces: context.fetchWorkspaces,
    updateWorkspace: context.updateWorkspace,
    removeWorkspace: context.removeWorkspace,
    addChannelToWorkspace: context.addChannelToWorkspace,
  };
};

export default useWorkspace;
