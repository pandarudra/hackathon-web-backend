import { Server } from "socket.io";
import Message from "../models/messageModel";

export const socketSetup = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", (roomID: string) => {
      socket.join(roomID);
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
