import { Server, Socket } from "socket.io";

interface RoomPayload {
  channelId?: string;
  workspaceId?: string;
}

const getRoomId = (data: RoomPayload | string, key: keyof RoomPayload) =>
  typeof data === "object" ? data[key] : data;

export default function chatHandler(
  _io: Server,
  socket: Socket
) {
  // A private room makes user-targeted notifications reliable across tabs/devices.
  socket.join(`user:${socket.data.userId}`);

  socket.on("chat:join", (data: RoomPayload | string) => {
    const channelId = getRoomId(data, "channelId");

    if (channelId) {
      socket.join(channelId);

      console.log(
        `Socket ${socket.id} joined ${channelId}`
      );
    }
  });

  socket.on("chat:leave", (data: RoomPayload | string) => {
    const channelId = getRoomId(data, "channelId");

    if (channelId) {
      socket.leave(channelId);

      console.log(
        `Socket ${socket.id} left ${channelId}`
      );
    }
  });

  socket.on("workspace:join", (data: RoomPayload | string) => {
    const workspaceId = getRoomId(data, "workspaceId");
    if (workspaceId) socket.join(workspaceId);
  });

  socket.on("workspace:leave", (data: RoomPayload | string) => {
    const workspaceId = getRoomId(data, "workspaceId");
    if (workspaceId) socket.leave(workspaceId);
  });

}
