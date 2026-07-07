import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import jwt from "jsonwebtoken";

import chatHandler from "./handlers/chatHandler";
import typingHandler from "./handlers/typingHandler";

export let io: SocketServer;

// Store online users
export const onlineUsers = new Set<string>();

export function initSocket(httpServer: HttpServer): SocketServer {
  io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your_super_secret_key_min_32_chars"
      ) as {
        id: string;
        email: string;
        role: string;
      };

      socket.data.userId = decoded.id;
      socket.data.userEmail = decoded.email;
      socket.data.userRole = decoded.role;

      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(
      `Socket Connected: ${socket.id} | User: ${socket.data.userId}`
    );

    // Online User
    onlineUsers.add(socket.data.userId);

    io.emit("users:online", Array.from(onlineUsers));

    // Register Socket Handlers
    chatHandler(io, socket);
    typingHandler(io, socket);

    socket.on("disconnect", () => {
      console.log(`Socket Disconnected: ${socket.id}`);

      onlineUsers.delete(socket.data.userId);

      io.emit("users:online", Array.from(onlineUsers));
    });
  });

  return io;
}