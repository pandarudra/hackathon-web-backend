import express from "express";
import { createTeam, joinTeam } from "../controllers/teamController";
import { authMiddleware } from "../utils/auth";

const teamRouter = express.Router();

teamRouter.post("/create", authMiddleware, createTeam);
teamRouter.post("/join", authMiddleware, joinTeam);

export default teamRouter;
