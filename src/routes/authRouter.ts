import express from "express";
import {
  authSignIn,
  authSignUp,
  authTokenRefresh,
  getUserLevel,
} from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/signup", authSignUp);
authRouter.post("/signin", authSignIn);
authRouter.post("/refresh", authTokenRefresh);
authRouter.get("/me", getUserLevel);

export default authRouter;
