import express from "express";
import {
  createHackathon,
  getHackathonsByUser,
  joinHackathon,
  listHackathons,
  submitProject,
} from "../controllers/hackathonController";

const eventRouter = express.Router();

eventRouter.post("/create", createHackathon);
eventRouter.get("/list", listHackathons);
eventRouter.post("/join", joinHackathon);
eventRouter.get("/joined/:userId", getHackathonsByUser);
eventRouter.post("/submit/:hackathonId", submitProject);

export default eventRouter;
