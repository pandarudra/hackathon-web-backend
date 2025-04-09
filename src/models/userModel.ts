import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  isVerified?: boolean;
  role: "organizer" | "user" | "judge";
  accessToken?: string;
  refreshToken?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postalCode: { type: String },
    isVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["organizer", "user", "judge"],
      default: "user",
    },
    accessToken: { type: String },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
