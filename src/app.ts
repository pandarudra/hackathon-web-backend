import express from "express";
import cors from "cors";
import router from "./routes/appRouter";
import authRouter from "./routes/authRouter";
import eventRouter from "./routes/eventRouter";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", router);
app.use("/api/auth", authRouter);
app.use("/api/event", eventRouter);

export default app;
