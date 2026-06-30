import { Request, Response } from 'express';
import Channels from '../models/Channels';
import Workspace from '../models/Workspace';

export const createChannel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, workspaceId } = req.body;

    if (!name || !workspaceId) {
      res.status(400).json({
        success: false,
        message: 'Name and workspaceId are required',
      });
      return;
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      res.status(404).json({
        success: false,
        message: 'Workspace not found',
      });
      return;
    }

    // Authorization: check if requesting user is a workspace member
    const userId = req.user!.id;
    const isMember = workspace.members.some((member) => member.toString() === userId);
    if (!isMember) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: You are not a member of this workspace',
      });
      return;
    }

   const formattedName = name.toLowerCase().trim().replace(/\s+/g, '-'); // Clean name format
   const existingChannel = await Channels.findOne({
    workspace: workspaceId,
    name: formattedName,
    });

    if (existingChannel) {
      res.status(409).json({
        success: false,
        message: 'Channel with this name already exists in the workspace',
      });
      return;
    }

    const channel = await Channels.create({
      name: formattedName,
      workspace: workspaceId,
      createdBy: userId,
    });

    // Logical fix: push channel ID to workspace's channels array and save
    workspace.channels.push(channel._id as any);
    await workspace.save();

    res.status(201).json({
      success: true,
      message: 'Channel created successfully',
      data: channel,
    });
  } catch (error) {
    console.error('Create Channel Error:', error);

    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const getChannels = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const workspaceId = req.query.workspaceId as string;

    if (!workspaceId) {
      res.status(400).json({
        success: false,
        message: 'workspaceId is required',
      });
      return;
    }

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      res.status(404).json({
        success: false,
        message: 'Workspace not found',
      });
      return;
    }

    // Authorization: check if requesting user is a workspace member
    const userId = req.user!.id;
    const isMember = workspace.members.some((member) => member.toString() === userId);
    if (!isMember) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: You are not a member of this workspace',
      });
      return;
    }

    const channels = await Channels.find({
      workspace: workspaceId,
    })
      .populate('createdBy', 'name email')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: channels.length,
      data: channels,
    });
  } catch (error) {
    console.error('Get Channels Error:', error);

    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};