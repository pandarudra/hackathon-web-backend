import mongoose from "mongoose";

const hackathonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    prize: String,
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    submissions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        title: String,
        description: String,
        repoLink: String,
        liveLink: String,
        submittedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Hackathon = mongoose.model("Hackathon", hackathonSchema);
export default Hackathon;
