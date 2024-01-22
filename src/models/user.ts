import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  username: string;
  password: string;
}

const userSchema: Schema = new Schema({
  username: { type: String, unique: true, index: true },
  password: String,
});

export const UserModel = mongoose.model<UserDocument>('User', userSchema);