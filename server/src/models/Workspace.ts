import mongoose, {Schema,Document} from "mongoose";

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
            transform:function(_doc,ret:Record<string,any>){
                ret.id=ret._id;

                delete ret._id;
                delete ret.__v;

                return ret;
            },
        },
    }
);
const Workspace = mongoose.model<IWorkspace>(
    "Workspace",
    workspaceSchema
);
export default Workspace;
