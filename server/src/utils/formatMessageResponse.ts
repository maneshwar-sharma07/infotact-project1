import mongoose from "mongoose";
import { IMessage, IMessageReaction } from "../models/Message";

interface PopulatedSender {
  _id?: { toString(): string };
  id?: string;
  name?: string;
}

interface PopulatedReply {
  _id?: { toString(): string };
  id?: string;
  content: string;
  sender?: PopulatedSender;
  senderName?: string;
}

type FormattableMessage = Omit<IMessage, "sender" | "replyTo"> & {
  _id?: { toString(): string };
  id?: string;
  sender: mongoose.Types.ObjectId | PopulatedSender | string;
  senderId?: string;
  senderName?: string;
  channelId?: string;
  timestamp?: Date | string;
  replyTo?: mongoose.Types.ObjectId | PopulatedReply | null;
};

const isPopulatedSender = (
  sender: FormattableMessage["sender"]
): sender is PopulatedSender =>
  typeof sender === "object" && sender !== null && ("name" in sender || "_id" in sender);

const isPopulatedReply = (
  replyTo: FormattableMessage["replyTo"]
): replyTo is PopulatedReply =>
  typeof replyTo === "object" && replyTo !== null && "content" in replyTo;

const formatReaction = (reaction: IMessageReaction) => ({
  emoji: reaction.emoji,
  users: reaction.users.map((user) => user.toString()),
});

export const formatMessageResponse = (msg: FormattableMessage) => ({
  id: msg._id?.toString?.() || msg.id,
  content: msg.content,
  senderId:
    (isPopulatedSender(msg.sender) ? msg.sender._id?.toString?.() || msg.sender.id : undefined) ||
    msg.senderId ||
    (typeof msg.sender === "string" ? msg.sender : msg.sender.toString()),
  senderName: (isPopulatedSender(msg.sender) ? msg.sender.name : undefined) || msg.senderName || "User",
  channelId: msg.channel?.toString?.() || msg.channelId || msg.channel,
  timestamp: msg.createdAt || msg.timestamp,
  attachments: (msg.attachments || []).map((file) => ({
    filename: file.filename,
    originalName: file.originalName,
    mimeType: file.mimeType,
    size: file.size,
    url: file.url,
  })),
  reactions: (msg.reactions || []).map(formatReaction),
  replyTo: isPopulatedReply(msg.replyTo)
    ? {
        id: msg.replyTo._id?.toString?.() || msg.replyTo.id,
        content: msg.replyTo.content,
        senderName: msg.replyTo.sender?.name || msg.replyTo.senderName || "User",
      }
    : undefined,
});
