import { Request, Response } from "express";
import { comparehash, genhash } from "../utils/hash";
import User from "../models/userModel";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefToken,
} from "../utils/auth";

export const authSignUp = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      username,
      email,
      password,
      phone,
      city,
      state,
      country,
      postalCode,
      role,
    } = req.body;

    if (!name || !username || !email || !password) {
      res.status(400).json({
        message: "Missing required fields: name, username, email, or password",
      });
      return;
    }

    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingEmail) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }
    if (existingUsername) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }

    const hashedPassword = await genhash(password);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      phone,
      city,
      state,
      country,
      postalCode,
      role,
    });

    newUser.refreshToken = generateRefreshToken(newUser.email, newUser.role);
    const token = generateAccessToken(newUser.email, newUser.role);
    newUser.accessToken = token;
    await newUser.save();

    res.cookie("refreshToken", newUser.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ token, message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const authSignIn = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { emailOrUsername, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await comparehash(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const accessToken = generateAccessToken(user.email, user.role);
    const refreshToken = generateRefreshToken(user.email, user.role);

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        token: accessToken,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const authTokenRefresh = async (
  req: Request,
  res: Response
): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.sendStatus(401);
    return;
  }

  try {
    const payload = verifyRefToken(refreshToken) as {
      email: string;
      role: string;
    };

    const user = await User.findOne({ email: payload.email });
    if (!user || user.refreshToken !== refreshToken) {
      res.sendStatus(403);
      return;
    }

    const newAccessToken = generateAccessToken(user.email, user.role);
    user.accessToken = newAccessToken;
    await user.save();

    res.status(200).json({ token: newAccessToken });
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const getUserLevel = async (req: Request, res: Response) => {};
