import type { IChannel, IUser, IWorkspace } from "../types/index.ts";

const workspaceGradients = [
  "from-violet-500 via-purple-500 to-fuchsia-500",
  "from-blue-500 via-indigo-500 to-violet-500",
  "from-emerald-500 via-green-500 to-teal-500",
  "from-orange-500 via-amber-500 to-yellow-500",
  "from-pink-500 via-rose-500 to-red-500",
  "from-red-500 via-rose-500 to-orange-500",
  "from-cyan-500 via-sky-500 to-blue-500",
];

export const getWorkspaceInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return name.slice(0, 2).toUpperCase() || "WS";
};

export const getWorkspaceGradient = (workspaceId = "") => {
  const hash = workspaceId
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return workspaceGradients[hash % workspaceGradients.length];
};

export const getWorkspaceMemberCount = (workspace?: IWorkspace | null) =>
  ((workspace?.members || []) as Array<string | IUser>).length;

export const getWorkspaceChannelCount = (workspace?: IWorkspace | null) =>
  ((workspace?.channels || []) as Array<string | IChannel>).length;
