import React from 'react';
import { WorkspaceProvider } from '../context/WorkspaceContext.tsx';
import WorkspaceSidebar from '../components/workspace/WorkspaceSidebar.tsx';
import ChannelList from '../components/channel/ChannelList.tsx';
import ChatArea from '../components/chat/ChatArea.tsx';

export const AppPageContent: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0A0F] font-body text-[#F1F5F9]">
      {/* 1. Workspace Sidebar (72px) */}
      <WorkspaceSidebar />

      {/* 2. Channel List (240px) */}
      <ChannelList />

      {/* 3. Chat Area (flex-1) */}
      <ChatArea />

      {/* 4. Members List (220px) — Placeholder panel until Tuesday 24th June */}
      <div className="w-[220px] h-screen bg-[#07070A] border-l border-[#1E1E2F] flex flex-col p-4 select-none">
        <h3 className="text-xs font-heading font-bold text-[#64748B] uppercase tracking-wider mb-4">
          Members
        </h3>
        <div className="flex-1 flex items-center justify-center text-xs text-text-muted italic">
          Coming Soon
        </div>
      </div>
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
