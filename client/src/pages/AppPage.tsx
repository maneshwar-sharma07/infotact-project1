import React from 'react';
import { WorkspaceProvider } from '../context/WorkspaceContext.tsx';
import WorkspaceSidebar from '../components/workspace/WorkspaceSidebar.tsx';
import ChannelList from '../components/channel/ChannelList.tsx';
import ChatArea from '../components/chat/ChatArea.tsx';
import MembersPanel from '../components/workspace/MembersPanel.tsx';

export const AppPageContent: React.FC = () => {
  return (
    <div className="flex h-dvh w-full min-w-[620px] overflow-hidden bg-[#08090d] font-body text-[#F1F5F9]">
      {/* 1. Workspace Sidebar (72px) */}
      <WorkspaceSidebar />

      {/* 2. Channel List (240px) */}
      <ChannelList />

      {/* 3. Chat Area (flex-1) */}
      <ChatArea />

     <MembersPanel />
    </div>
  );
};

export const AppPage: React.FC = () => {
  return (
    <WorkspaceProvider>
      <AppPageContent />
    </WorkspaceProvider>
  );
};

export default AppPage;
