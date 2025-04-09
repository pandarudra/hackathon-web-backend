import mongoose, { Schema, Document } from "mongoose";

export interface IHackathon extends Document {
  title: string;
  description: string;
  organizer: mongoose.Types.ObjectId;
  banner?: string;
  startDate: Date;
  endDate: Date;
  teamSizeMin: number;
  teamSizeMax: number;
  visibility: "public" | "private";
  judgingCriteria?: string[];
}

const hackathonSchema = new Schema<IHackathon>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    banner: String,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    teamSizeMin: { type: Number, default: 1 },
    teamSizeMax: { type: Number, default: 4 },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    judgingCriteria: [{ type: String }],
  },
  { timestamps: true }
);

const Hackathon = mongoose.model<IHackathon>("Hackathon", hackathonSchema);
export default Hackathon;
