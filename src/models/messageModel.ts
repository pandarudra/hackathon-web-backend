import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  hackathonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hackathon",
    required: true,
  },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
