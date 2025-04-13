import express from "express";
import teamRouter from "./teamRouter";

const router = express.Router();

router.use("/team", teamRouter);

export default router;
