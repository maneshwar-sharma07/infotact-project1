import mongoose, {Schema,Document} from "mongoose";
import toJSON from "../utils/toJSON";


export interface IChannels extends Document{
    name:string;
    workspace:mongoose.Types.ObjectId;
    createdBy:mongoose.Types.ObjectId;
    createdAt:Date;
    updatedAt:Date;
}

const channelSchema = new Schema<IChannels>(
       {
        name:{
            type:String,
            required:true,
            trim:true
        },
        workspace:{
            type:Schema.Types.ObjectId,
            ref:"Workspace",
            required:true
        },
        createdBy:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
       },
       {
            timestamps:true,
       }
);
toJSON(channelSchema);
const Channels = mongoose.model<IChannels>(
    "Channels",
    channelSchema
);
export default Channels;