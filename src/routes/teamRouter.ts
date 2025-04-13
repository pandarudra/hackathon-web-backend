import express from "express";
import { createTeam, joinTeam } from "../controllers/teamController";

const teamRouter = express.Router();

teamRouter.post("/create", createTeam);
teamRouter.post("/join", joinTeam);

export default teamRouter;
