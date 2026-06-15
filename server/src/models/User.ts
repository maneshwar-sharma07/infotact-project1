import mongoose, {Schema,model,Document} from 'mongoose';
import toJSON from "../utils/toJSON";

export interface IUser extends Document {
    name:string;
    email:string;
    passwordHash:string;
    avatarUrl?:string;
    createdAt:Date;
    updatedAt:Date;
}

const userSchema = new Schema<IUser>(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        email:{
             type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        passwordHash:{
          type:String,
            required:true
        },
        avatarUrl:{
           type:String,
           default:"",
        },
    },
    {
        timestamps:true,
    }
);
toJSON(userSchema);

const User = mongoose.model<IUser>("User",userSchema);

export default User;
