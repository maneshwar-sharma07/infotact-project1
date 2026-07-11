import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
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
    return ret;
  },
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;