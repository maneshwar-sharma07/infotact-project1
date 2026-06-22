import React from "react";

function AppPage() {
  return (
    <div className="flex h-screen bg-[#0A0A0F] text-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-[#1E293B] p-4">
        <h2 className="text-xl font-bold mb-6">Workspace</h2>

        <div className="space-y-3">
          <p className="text-gray-400">Channels</p>

          <button className="block w-full text-left hover:text-violet-400">
            # general
          </button>

          <button className="block w-full text-left hover:text-violet-400">
            # random
          </button>

          <button className="block w-full text-left hover:text-violet-400">
            # announcements
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="border-b border-[#1E293B] p-4">
          <h2 className="font-semibold"># general</h2>
        </div>

        <div className="flex-1 p-4">
          <p>Dinesh: Hello Team 👋</p>
          <p>Jay: Welcome 🚀</p>
        </div>

        <div className="p-4 border-t border-[#1E293B]">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full bg-[#111118] border border-[#2E303A] rounded-lg p-3"
          />
        </div>
      </div>
    </div>
  );
}

export default AppPage;