import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/userModel";
import { env } from "../configs/env";
import { Document } from "mongoose";

export interface RequestWithUser extends Request {
  user?: Document<unknown, {}, IUser> & IUser & { _id: unknown };
}

export const authMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = verifyAccToken(token);
    if (typeof decoded !== "object" || !("email" in decoded)) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }
    const user = await User.findOne({ email: (decoded as JwtPayload).email });
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const generateAccessToken = (email: string, role: string) => {
  return jwt.sign({ email, role }, env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (email: string, role: string) => {
  return jwt.sign({ email, role }, env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "7d",
  });
};

export const verifyRefToken = (token: string) => {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET as string);
};

export const verifyAccToken = (token: string) => {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET as string);
};
