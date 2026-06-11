import mongoose, {Schema,Document} from "mongoose";

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

            toJSON:{
                transform:function(_doc,ret:Record<string,any>){
                    ret.id = ret._id;

                    delete ret._id;
                    delete ret.__v;

                    return ret;
                },
            },
       }
);
const Channels = mongoose.model<IChannels>(
    "Channels",
    channelSchema
);
export default Channels;