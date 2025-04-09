import { Request, Response } from "express";
import Hackathon from "../models/hackathonModel";

export const createHackathon = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      teamSizeMin,
      teamSizeMax,
      visibility,
      judgingCriteria,
      banner,
    } = req.body;

    const user = req.user;

    if (!user || user.role !== "organizer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const hackathon = new Hackathon({
      title,
      description,
      startDate,
      endDate,
      teamSizeMin,
      teamSizeMax,
      visibility,
      judgingCriteria,
      banner,
      organizer: user.id,
    });

    await hackathon.save();

    res
      .status(201)
      .json({ message: "Hackathon created successfully", hackathon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
