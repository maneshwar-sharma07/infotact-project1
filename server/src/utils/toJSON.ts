export const transformJSON =(
    _doc : unknown,
    ret:Record<string,any>
)=>{
    ret.id = ret._id;

    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    return ret;
}