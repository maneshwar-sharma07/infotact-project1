import React, { useState } from "react";
import { useWorkspace } from "../../hooks/useWorkspace.ts";
import type { IChannel } from "../../types/index.ts";
import CreateChannelModal from "./CreateChannelModal";
import CreateWorkspaceModal from "../workspace/CreateWorkspaceModal";
import {
  Plus,
  Hash,
  Search,
  FolderOpen,
} from "lucide-react";

export const ChannelList: React.FC = () => {
  const [openChannelModal, setOpenChannelModal] = useState(false);
  const [openWorkspaceModal, setOpenWorkspaceModal] = useState(false);
  const [search, setSearch] = useState("");

const {
  workspaces,
  activeWorkspace,
  activeChannel,
  setActiveWorkspace,
  setActiveChannel,
} = useWorkspace();

  const channels = (
    ((activeWorkspace?.channels || []) as any[]).filter(
      (chan) => chan && typeof chan === "object" && "name" in chan
    ) as IChannel[]
  ).filter((channel) =>
    channel.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <aside className="w-[260px] h-screen bg-[#0D0E14] border-r border-[#1E293B] flex flex-col">

        {/* Workspace Header */}
        <div className="px-5 py-4 border-b border-[#1E293B]">

<div className="flex items-center gap-3">

<div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold">
{activeWorkspace?.name?.charAt(0).toUpperCase()}
</div>

<div>

<h2 className="text-white font-semibold text-base truncate">
{activeWorkspace?.name}
</h2>

<p className="text-[10px] uppercase tracking-[0.2em] text-violet-400">
Active Workspace
</p>

</div>

</div>

        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-3 py-4">

          {/* Search */}
          <div className="relative mb-6">

            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                h-9
                rounded-xl
                bg-[#111118]
                border
                border-[#1E293B]
                pl-10
                pr-3
                text-sm
                text-white
                placeholder:text-gray-500
                outline-none
                transition-all
                duration-200
                focus:border-violet-500
                focus:ring-2
                focus:ring-violet-500/20
              "
            />

          </div>

          {/* Channel Header */}

          <div className="flex items-center justify-between mb-3 px-2">

            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Channels
            </span>

            <button
              onClick={() => setOpenChannelModal(true)}
              title="Create Channel"
              className="
                w-7
                h-7
                rounded-lg
                flex
                items-center
                justify-center
                text-[#64748B]
                hover:bg-violet-500/10
                hover:text-violet-400
                transition
              "
            >
              <Plus size={15} />
            </button>

          </div>

          {/* Channel List */}

          <div className="space-y-1">

            {channels.length === 0 ? (

              <div className="px-2 py-3 text-xs italic text-gray-500">
                {search
                  ? "No channels found"
                  : "No channels available"}
              </div>

            ) : (

              channels.map((channel) => {

                const isActive =
                  activeChannel?.id === channel.id;

                return (

                  <button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel)}
                    className={`
                      group
                      flex
                      items-center
                      gap-3
                      w-full
                      px-3
                      py-3
                      hover:scale-[1.02]
                      rounded-xl
                      transition-all
                      duration-200
                      text-left

                      ${
                        isActive
                          ? "bg-violet-500/15 border-l-[3px] border-violet-500 text-white"
                          : "text-gray-400 hover:bg-[#171821] hover:text-white"
                      }
                    `}
                  >

                    <Hash
                      size={16}
                      className={`${
                        isActive
                          ? "text-violet-400"
                          : "text-gray-500 group-hover:text-violet-400"
                      }`}
                    />

                    <span className="truncate text-sm font-medium">
                      {channel.name}
                    </span>

                  </button>

                );

              })

            )}

          </div>
  {/* Divider */}

<div className="my-5 border-t border-[#222430]" />

{/* Workspace Section */}

<div className="px-2">

  <div className="flex items-center justify-between mb-3">

    <span className="text-[11px] uppercase tracking-wider font-bold text-[#64748B]">
      Workspaces
    </span>

    <button
      onClick={() => setOpenWorkspaceModal(true)}
      className="text-[#64748B] hover:text-violet-400"
    >
      <Plus size={15} />
    </button>

  </div>

  <div className="space-y-2">

    {workspaces.map((workspace) => {

      const active =
        workspace.id === activeWorkspace?.id;

      return (

        <button
          key={workspace.id}
          onClick={() => setActiveWorkspace(workspace)}
          className={`
            flex
            items-center
            gap-3
            w-full
            px-3
            py-2.5
            rounded-xl
            transition

            ${
              active
                ? "bg-violet-600/20 border border-violet-500 text-white"
                : "text-gray-400 hover:bg-[#171821]"
            }
          `}
        >
<div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-xs font-bold text-white">
{workspace.name.charAt(0).toUpperCase()}
</div>


          <span className="truncate text-sm">
            {workspace.name}
          </span>

        </button>

      );

    })}

  </div>

</div>

        </div>

      </aside>

      <CreateChannelModal
      isOpen={openChannelModal}
      onClose={() => setOpenChannelModal(false)}
      />

      <CreateWorkspaceModal
      isOpen={openWorkspaceModal}
      onClose={() => setOpenWorkspaceModal(false)}
      />
    </>
  );
};

export default ChannelList;