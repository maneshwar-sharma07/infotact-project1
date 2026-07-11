import mongoose, {Schema,Document} from "mongoose";
import toJSON from "../utils/toJSON";

export interface IAttachment {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
}

export interface IMessageReaction {
    emoji: string;
    users: mongoose.Types.ObjectId[];
}

export interface IMessage extends Document {
    content: string;

    attachments?: IAttachment[];

    reactions: IMessageReaction[];

    replyTo?: mongoose.Types.ObjectId | null;

    sender: mongoose.Types.ObjectId;

    channel: mongoose.Types.ObjectId;

    createdAt: Date;

    updatedAt: Date;
}

const attachmentSchema = new Schema<IAttachment>(
    {
        filename: { type: String, required: true },
        originalName: { type: String, required: true },
        mimeType: { type: String, required: true },
        size: { type: Number, required: true },
        url: { type: String, required: true },
    },
    { _id: false }
);

const reactionSchema = new Schema<IMessageReaction>(
    {
        emoji: {
            type: String,
            required: true,
            trim: true,
        },
        users: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }],
    },
    { _id: false }
);

const messageSchema = new Schema<IMessage>(
    {
        content:{
            type:String,
            default: "",
            trim:true
        },

        attachments: {
            type: [attachmentSchema],
            default: [],
        },

        reactions: {
            type: [reactionSchema],
            default: [],
        },

        replyTo: {
        type: Schema.Types.ObjectId,
        ref: "Message",
        default: null,
        },
        sender:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        channel:{
              type:Schema.Types.ObjectId,
            ref:"Channels",
            required:true
        },

    },
    {
        timestamps:true,
       
    }
);

toJSON(messageSchema);
const Message = mongoose.model<IMessage>(
    "Message",
    messageSchema
);
export default Message;
