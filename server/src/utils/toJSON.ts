import {Schema} from "mongoose";

const toJSON = (schema:Schema)=>{
    schema.set("toJSON",{
        transform:function(_doc,ret:Record<string,any>){
            ret.id=ret._id.toString();

            delete ret._id;
            delete ret.__v;
            delete ret.passwordHash;

            return ret;
        },
    });
};

export default toJSON;