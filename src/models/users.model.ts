import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Create a TS interface for your user
export interface IUser extends Document {
  username: string;
  password: string;
}

// 2. Define the schema with typing
const userSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

// 3. Export the model (reuse if already compiled)
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
