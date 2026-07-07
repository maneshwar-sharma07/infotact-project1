import { Server, Socket } from "socket.io";

export default function chatHandler(
  _io: Server,
  socket: Socket
) {

  socket.on("chat:join", (data: any) => {
    const channelId =
      typeof data === "object"
        ? data.channelId
        : data;

    if (channelId) {
      socket.join(channelId);

      console.log(
        `Socket ${socket.id} joined ${channelId}`
      );
    }
  });

  socket.on("chat:leave", (data: any) => {
    const channelId =
      typeof data === "object"
        ? data.channelId
        : data;

    if (channelId) {
      socket.leave(channelId);

      console.log(
        `Socket ${socket.id} left ${channelId}`
      );
    }
  });

}