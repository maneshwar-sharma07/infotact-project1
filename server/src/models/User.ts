import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  passwordHash?: string;
  workspaces: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    passwordHash: {
      type: String,
      select: false,
    },
    workspaces: [{
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
    }],
  },
  {
    timestamps: true,
  }
);

// Remove password from JSON response - FIXED
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    // Method 1: Delete password (TypeScript safe)
    delete (ret as { password?: string }).password;
    delete (ret as { passwordHash?: string }).passwordHash;
    return ret;
  },
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
