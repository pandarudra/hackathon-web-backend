import { Request, Response } from "express";
import Hackathon from "../models/hackathonModel";
import { v4 as uuidv4 } from "uuid";
import { RequestWithUser } from "../utils/auth";
import { io } from "..";

export const createTeam = async (
  req: RequestWithUser,
  res: Response
): Promise<any> => {
  try {
    const { teamName } = req.body;
    const hackathonId = req.params.hackathonId; // Assuming the hackathon ID is passed in the URL

    const hackathon = await Hackathon.findById(hackathonId);

    const adminId = req.user?._id; // Assuming req.user contains the authenticated user
    const chatRoomId: string = adminId as string; // Generate a unique ID for the chat room

    const newTeam = {
      teamName,
      admin: adminId,
      members: [{ user: adminId }],
      chatRoomId,
    };

    hackathon?.teams.push(newTeam);
    await hackathon?.save();
    const userId = req.user?._id; // Declare and initialize userId
    io.to(chatRoomId).emit("teamMemberJoined", {
      userId,
      teamName: newTeam.teamName,
    });
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

export const joinTeam = async (
  req: RequestWithUser,
  res: Response
): Promise<any> => {
  try {
    const { chatRoomId } = req.body;

    const userId = req.user?._id; // Assuming req.user contains the authenticated user

    const hackathon = await Hackathon.findOne({
      "teams.chatRoomId": chatRoomId,
    });

    const team = hackathon?.teams.find(
      (team) => team.chatRoomId === chatRoomId
    );

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    team.members.push({ user: userId });
    await hackathon?.save();

    io.to(chatRoomId).emit("teamMemberJoined", {
      userId,
      teamName: team.teamName,
    });
    res.status(200).json({ message: "Joined team successfully", team });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while joining team" });
  }
};
