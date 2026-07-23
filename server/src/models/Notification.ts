import mongoose, { Document, Schema } from "mongoose";
import toJSON from "../utils/toJSON";

export type NotificationType =
  | "workspace:invite"
  | "workspace:member-joined"
  | "channel:created"
  | "channel:deleted"
  | "message:mention"
  | "message:reaction"
  | "message:reply";

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  actor?: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  body: string;
  workspace?: mongoose.Types.ObjectId;
  channel?: mongoose.Types.ObjectId;
  message?: mongoose.Types.ObjectId;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    actor: { type: Schema.Types.ObjectId, ref: "User" },
    type: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, default: "", trim: true },
    workspace: { type: Schema.Types.ObjectId, ref: "Workspace" },
    channel: { type: Schema.Types.ObjectId, ref: "Channels" },
    message: { type: Schema.Types.ObjectId, ref: "Message" },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });
toJSON(notificationSchema);

export default mongoose.model<INotification>("Notification", notificationSchema);
