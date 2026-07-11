import { Request, Response } from 'express';
import Workspace from '../models/Workspace';
import User from '../models/User';

// ======================
// Create Workspace
// ======================
export const createWorkspace = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    const userId = req.user!.id;

    if (!name) {
      res.status(400).json({
        success: false,
        message: 'Workspace name is required',
      });
      return;
    }

    const workspace = await Workspace.create({
      name,
      description: description || '',
      createdBy: userId,
      members: [userId],
    });

    res.status(201).json({
      success: true,
      message: 'Workspace created successfully',
      data: workspace,
    });
  } catch (error) {
    console.error('Create Workspace Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

// ======================
// Get All Workspaces
// ======================
export const getWorkspaces = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const workspaces = await Workspace.find({
      members: { $in: [userId] },
    })
      .populate('createdBy', 'name email')
      .populate('members', 'name email')
      .populate('channels')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: workspaces.length,
      data: workspaces,
    });
  } catch (error) {
    console.error('Get Workspaces Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

// ======================
// Get Workspace By ID
// ======================
export const getWorkspaceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const workspace = await Workspace.findById(id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email')
      .populate('channels');

    if (!workspace) {
      res.status(404).json({
        success: false,
        message: 'Workspace not found',
      });
      return;
    }

    // Check if user is a member
    if (!workspace.members.some((m: any) => m._id.toString() === userId)) {
      res.status(403).json({
        success: false,
        message: 'You are not a member of this workspace',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    console.error('Get Workspace Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

// ======================
// Update Workspace
// ======================
export const updateWorkspace = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user!.id;

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      res.status(404).json({
        success: false,
        message: 'Workspace not found',
      });
      return;
    }

    // Check if user is the creator
    if (workspace.createdBy.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Only workspace creator can update',
      });
      return;
    }

    if (name) workspace.name = name;
    if (description !== undefined) workspace.description = description;

    await workspace.save();

    res.status(200).json({
      success: true,
      message: 'Workspace updated successfully',
      data: workspace,
    });
  } catch (error) {
    console.error('Update Workspace Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

// ======================
// Delete Workspace
// ======================
export const deleteWorkspace = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      res.status(404).json({
        success: false,
        message: 'Workspace not found',
      });
      return;
    }

    // Check if user is the creator
    if (workspace.createdBy.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Only workspace creator can delete',
      });
      return;
    }

    await workspace.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Workspace deleted successfully',
    });
  } catch (error) {
    console.error('Delete Workspace Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

// ======================
// Add Member to Workspace
// ======================
export const addMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const currentUserId = req.user!.id;

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      res.status(404).json({
        success: false,
        message: 'Workspace not found',
      });
      return;
    }

    // Check if current user is creator
    if (workspace.createdBy.toString() !== currentUserId) {
      res.status(403).json({
        success: false,
        message: 'Only workspace creator can add members',
      });
      return;
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Check if already a member
    if (workspace.members.some((m: any) => m.toString() === userId)) {
      res.status(400).json({
        success: false,
        message: 'User is already a member',
      });
      return;
    }

    workspace.members.push(userId);
    await workspace.save();

    res.status(200).json({
      success: true,
      message: 'Member added successfully',
      data: workspace,
    });
  } catch (error) {
    console.error('Add Member Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
