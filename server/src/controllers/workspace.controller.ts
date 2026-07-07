import { Request, Response } from "express";
import Workspace from "../models/Workspace";
import Channels from "../models/Channels";
import crypto from "crypto";

export const createWorkspace = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { name, description } = req.body;

        if (!name) {
            res.status(400).json({
                success: false,
                message: "Workspace name is required",
            });
            return;
        }

        const userId = req.user!.id;

          const existingWorkspace = await Workspace.findOne({
            owner:userId,
            name:name.trim(),
          });

        if (existingWorkspace) {
            res.status(409).json({
                success: false,
                message: "Workspace with this name already exists",
            });
            return;
        }

        const inviteToken = crypto.randomBytes(16).toString("hex");

        const workspace = await Workspace.create({
            name: name.trim(),
            description: description?.trim(),
            owner: userId,
            inviteToken,
            members: [userId],
            channels: [],
        });

        // Create a default 'general' channel
        const defaultChannel = await Channels.create({
            name: "general",
            workspace: workspace._id,
            createdBy: userId,
        });

        workspace.channels.push(defaultChannel._id as any);
        await workspace.save();

        // Populate channels before sending response so frontend has it
        const populatedWorkspace = await Workspace.findById(workspace._id).populate('channels');

        res.status(201).json({
            success: true,
            message: "Workspace created successfully",
            data: populatedWorkspace,
            inviteLink: `/api/workspaces/join/${workspace.inviteToken}`,
        });
    } catch (error) {
        console.error("Create Workspace Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const getWorkspaces = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user!.id;

        const workspaces = await Workspace.find({
            members: userId,
        }).populate('channels');

        const formattedWorkspaces = workspaces.map((workspace:any) => ({
             ...workspace.toObject(),
             memberCount : workspace.members.length,
             channelCount : workspace.channels.length,
        }));

        res.status(200).json({
            success: true,
            count: workspaces.length,
            data: formattedWorkspaces,
        });
    } catch (error) {
        console.error("Get Workspaces Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const joinWorkspaceByToken = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { token } = req.params;

        const workspace = await Workspace.findOne({
            inviteToken: token,
        }).populate('channels');

        if (!workspace) {
            res.status(404).json({
                success: false,
                message: "Invalid invite token",
            });
            return;
        }

        const userId = req.user!.id;

        const alreadyMember = workspace.members.some(
            (member) => member.toString() === userId
        );

        if (!alreadyMember) {
            workspace.members.push(userId as any);
            await workspace.save();
        }

        res.status(200).json({
            success: true,
            message: "Joined workspace successfully",
            data: workspace,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const generateInviteLink = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { workspaceId } = req.body;

    if (!workspaceId) {
      res.status(400).json({
        success: false,
        message: "Workspace ID is required",
      });
      return;
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
      return;
    }

    // Check user is member of workspace
    const userId = req.user!.id;

    const isMember = workspace.members.some(
      (member) => member.toString() === userId
    );

    if (!isMember) {
      res.status(403).json({
        success: false,
        message: "Forbidden: You are not a member of this workspace",
      });
      return;
    }

    res.status(200).json({
      success: true,
      inviteToken: workspace.inviteToken,
      inviteLink: `/api/workspaces/join/${workspace.inviteToken}`,
    });
  } catch (error) {
    console.error("Generate Invite Link Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const getWorkspaceMembers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId)
      .populate("members", "name email");

    if (!workspace) {
      res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: workspace.members,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};