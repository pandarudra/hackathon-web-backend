import { createServer } from "http";
import { env } from "./configs/env";
import { Server } from "socket.io";
import app from "./app";
import { connectDB } from "./configs/dbConfig";
import { socketSetup } from "./sockets/appSocket";

const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = env.PORT;

connectDB()
  .then(() => {
    socketSetup(io);
    console.log("Database connected successfully");
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
