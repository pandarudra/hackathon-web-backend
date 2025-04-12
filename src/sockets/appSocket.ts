import { Server } from "socket.io";
import Message from "../models/messageModel";

export const socketSetup = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", (hackathonId: string) => {
      socket.join(hackathonId);
      console.log(`User ${socket.id} joined room: ${hackathonId}`);
    });

    socket.on("chatMessage", async ({ hackathonId, message, sender }) => {
      const newMessage = new Message({ hackathonId, message, sender });
      await newMessage.save();

      io.to(hackathonId).emit("newMessage", {
        message,
        sender,
        time: newMessage.createdAt,
      });
    });
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
