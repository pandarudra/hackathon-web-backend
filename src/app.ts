import express from "express";
import cors from "cors";
import router from "./routes/appRouter";
import authRouter from "./routes/authRouter";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
app.use("/api/auth", authRouter);

export default app;
