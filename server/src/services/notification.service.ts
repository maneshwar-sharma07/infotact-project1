import mongoose from "mongoose";
import Notification, { INotification, NotificationType } from "../models/Notification";
import { io } from "../socket/socketServer";

type CreateNotificationInput = {
  recipient: string | mongoose.Types.ObjectId;
  actor?: string | mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  body: string;
  workspace?: string | mongoose.Types.ObjectId;
  channel?: string | mongoose.Types.ObjectId;
  message?: string | mongoose.Types.ObjectId;
};

export const formatNotification = (notification: INotification) => ({
  id: notification._id.toString(),
  recipientId: notification.recipient.toString(),
  actorId: notification.actor?.toString(),
  type: notification.type,
  title: notification.title,
  body: notification.body,
  workspaceId: notification.workspace?.toString(),
  channelId: notification.channel?.toString(),
  messageId: notification.message?.toString(),
  read: notification.read,
  createdAt: notification.createdAt,
});

export const createNotification = async (input: CreateNotificationInput) => {
  const notification = await Notification.create(input);
  const formatted = formatNotification(notification);
  if (io) io.to(`user:${formatted.recipientId}`).emit("notification:new", formatted);
  return formatted;
};

export const notifyWorkspaceMembers = async (
  recipientIds: Array<string | mongoose.Types.ObjectId>,
  input: Omit<CreateNotificationInput, "recipient">
) => Promise.all(
  [...new Set(recipientIds.map(String))]
    .filter((recipient) => recipient !== String(input.actor || ""))
    .map((recipient) => createNotification({ ...input, recipient }))
);
