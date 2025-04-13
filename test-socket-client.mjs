import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Change if different port
const hackathonId = "room123";
const sender = "rudra@example.com";

socket.on("connect", () => {
  console.log("✅ Connected as", socket.id);

  // Join a room
  socket.emit("joinRoom", hackathonId);

  // Send a message
  socket.emit("chatMessage", {
    hackathonId,
    message: "Hello team, testing DB + Socket!",
    sender,
  });
});

// Receive message broadcast
socket.on("newMessage", (data) => {
  console.log("📩 Received message:", data);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected");
});
