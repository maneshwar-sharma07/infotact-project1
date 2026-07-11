import mongoose, { Schema, Document } from 'mongoose';
import toJSON from '../utils/toJSON';

export interface IWorkspace extends Document {
  name: string;
  description: string;
  createdBy: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  channels: mongoose.Types.ObjectId[];
  inviteToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const workspaceSchema = new Schema<IWorkspace>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    channels: [{
      type: Schema.Types.ObjectId,
      ref: 'Channels',
    }],
    inviteToken: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

toJSON(workspaceSchema);

const Workspace = mongoose.model<IWorkspace>('Workspace', workspaceSchema);
export default Workspace;
