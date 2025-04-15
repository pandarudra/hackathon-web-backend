import { Request, Response } from "express";
import Hackathon from "../models/hackathonModel";
import { RequestWithUser } from "../utils/auth";
import { v4 as uuidv4 } from "uuid";

export const createHackathon = async (
  req: RequestWithUser,
  res: Response
): Promise<any> => {
  try {
    const { title, description, startDate, endDate, prize } = req.body;
    const user = req.user;
    const organizerId = user?._id; // Assuming req.user contains the authenticated user
    const hid = uuidv4().slice(0, 8); // Generate a unique ID for the hackathon

    if (!title || !startDate || !endDate || !organizerId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newHackathon = new Hackathon({
      _id: hid,
      title,
      description,
      startDate,
      endDate,
      prize,
      organizer: organizerId,
    });

    await newHackathon.save();

    res.status(201).json({
      message: "Hackathon created successfully",
      hackathon: newHackathon,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while creating hackathon" });
  }
};

export const listHackathons = async (
  _req: Request,
  res: Response
): Promise<any> => {
  try {
    const hackathons = await Hackathon.find().populate(
      "organizer",
      "name username email"
    );
    res.status(200).json(hackathons);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch hackathons" });
  }
};

export const joinHackathon = async (
  req: RequestWithUser,
  res: Response
): Promise<any> => {
  try {
    const { hackathonId } = req.body; // Assuming hackathonId is sent in the request body
    const userId = req.user?._id; // Assuming req.user contains the authenticated user
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    const alreadyJoined = hackathon.participants.some(
      (p) => p.user?.toString() === userId
    );

    if (alreadyJoined) {
      return res
        .status(400)
        .json({ message: "User already joined this hackathon" });
    }

    hackathon.participants.push({ user: userId });
    await hackathon.save();

    res.status(200).json({ message: "Joined successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to join hackathon" });
  }
};

export const getHackathonsByUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = req.params;

    const hackathons = await Hackathon.find({
      "participants.user": userId,
    }).populate("organizer", "name email");

    res.status(200).json({ hackathons });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch hackathons" });
  }
};

export const submitProject = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { hackathonId } = req.params;
    const { userId, title, description, repoLink, liveLink } = req.body;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon)
      return res.status(404).json({ message: "Hackathon not found" });

    const isParticipant = hackathon.participants.some(
      (p) => p.user?.toString() === userId
    );
    if (!isParticipant)
      return res
        .status(403)
        .json({ message: "You must join the hackathon first" });

    const alreadySubmitted = hackathon.submissions.find(
      (s) => s.user?.toString() === userId
    );
    if (alreadySubmitted)
      return res
        .status(400)
        .json({ message: "You already submitted a project" });

    hackathon.submissions.push({
      user: userId,
      title,
      description,
      repoLink,
      liveLink,
    });

    await hackathon.save();

    res.status(200).json({ message: "Submission successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
