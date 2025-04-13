import { Request, Response } from "express";
import Hackathon from "../models/hackathonModel";
import { v4 as uuidv4 } from "uuid";

export const createTeam = async (req: Request, res: Response): Promise<any> => {
  try {
    const { hackathonId, teamName, adminId } = req.body;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    const chatRoomId = uuidv4();

    const newTeam = {
      teamName,
      admin: adminId,
      members: [{ user: adminId }],
      chatRoomId,
    };

    hackathon.teams.push(newTeam);
    await hackathon.save();

    res.status(201).json({
      message: "Team created successfully",
      team: newTeam,
      referralLink: `http://localhost:3000/api/join-team/${chatRoomId}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while creating team" });
  }
};

export const joinTeam = async (req: Request, res: Response): Promise<any> => {
  try {
    const { chatRoomId, userId } = req.body;

    const hackathon = await Hackathon.findOne({
      "teams.chatRoomId": chatRoomId,
    });
    if (!hackathon) {
      return res.status(404).json({ message: "Team not found" });
    }

    const team = hackathon.teams.find((t) => t.chatRoomId === chatRoomId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const alreadyMember = team.members.some(
      (m) => m.user?.toString() === userId
    );
    if (alreadyMember) {
      return res.status(400).json({ message: "User already in the team" });
    }

    team.members.push({ user: userId });
    await hackathon.save();

    res.status(200).json({ message: "Joined team successfully", team });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while joining team" });
  }
};
