import mongoose, {Schema,Document} from "mongoose";
import toJSON from "../utils/toJSON";


export interface IMessage extends Document{
    content:string;
    sender:mongoose.Types.ObjectId;
    channel:mongoose.Types.ObjectId;
    createdAt:Date;
    updatedAt:Date;
}

const messageSchema = new Schema<IMessage>(
    {
        content:{
            type:String,
            required:true,
            trim:true
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