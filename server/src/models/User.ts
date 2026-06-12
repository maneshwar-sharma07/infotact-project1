import {Schema,model,Document} from 'mongoose';
import {transformJSON} from "../utils/toJSON";

export interface IUser extends Document {
    name:string;
    email:string;
    passwordHash:string;
    avatarUrl?:string;
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
        },
    },
    {
        timestamps:true,
    }
);

userSchema.set("toJSON",{
    transform:transformJSON,
})