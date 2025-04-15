import express from "express";
import {
  createHackathon,
  getHackathonsByUser,
  joinHackathon,
  listHackathons,
  submitProject,
} from "../controllers/hackathonController";
import { authMiddleware } from "../utils/auth";

const eventRouter = express.Router();

eventRouter.post("/create", authMiddleware, createHackathon);
eventRouter.get("/list", authMiddleware, listHackathons);
eventRouter.post("/join", authMiddleware, joinHackathon);
eventRouter.get("/joined/:userId", authMiddleware, getHackathonsByUser);
eventRouter.post("/submit/:hackathonId", authMiddleware, submitProject);

export default eventRouter;
