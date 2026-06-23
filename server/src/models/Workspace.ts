import mongoose, {Schema,Document} from "mongoose";
import toJSON from "../utils/toJSON";


export interface IWorkspace extends Document{
    name:string;
    description?:string;
    owner:mongoose.Types.ObjectId;
    members:mongoose.Types.ObjectId[];
    channels:mongoose.Types.ObjectId[];
    inviteToken?:string;
    createdAt:Date;
    updatedAt:Date;
}
const workspaceSchema = new Schema<IWorkspace>(
    {
        name:{
            type:String,
            required:true,
            trim:true,
        },
        description:{
            type:String,
            trim:true,
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        members:[{
           type:Schema.Types.ObjectId,
           ref:"User"
        }],
        channels:[{
            type:Schema.Types.ObjectId,
            ref:"Channels"
        }],
        inviteToken:{
            type:String,
            unique:true,
            sparse:true,
        },
    },
    {
        timestamps:true,
    }
);
toJSON(workspaceSchema);
const Workspace = mongoose.model<IWorkspace>(
    "Workspace",
    workspaceSchema
);
export default Workspace;
