import mongoose, {Schema,Document} from "mongoose";
import {transformJSON} from "../utils/toJSON";


export interface IWorkspace extends Document{
    name:string;
    description?:string;
    owner:mongoose.Types.ObjectId;
    members:mongoose.Types.ObjectId[];
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
        owner:[
            {
            type:Schema.Types.ObjectId,
            ref:"User",
        },
        ],
        inviteToken:{
            type:String,
            unique:true,
            sparse:true,
        },
    },
    {
        timestamps:true,
        toJSON:{
            transform:transformJSON,
        },
    }
);
const Workspace = mongoose.model<IWorkspace>(
    "Workspace",
    workspaceSchema
);
export default Workspace;
