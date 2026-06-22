import { Request, Response } from "express";
import Channels from "../models/Channels";
import Workspace from "../models/Workspace";

export const createChannel = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { name, workspaceId } = req.body;

        if (!name || !workspaceId) {
            res.status(400).json({
                success: false,
                message: "Name and workspaceId are required",
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

        const userId = (req as any).user.id;

        const channel = await Channels.create({
            name,
            workspace: workspaceId,
            createdBy: userId,
        });

        res.status(201).json({
            success: true,
            message: "Channel created successfully",
            data: channel,
        });
    } catch (error) {
        console.error("Create Channel Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
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
                message: "workspaceId is required",
            });
            return;
        }

        const channels = await Channels.find({
            workspace: workspaceId,
        })
            .populate("createdBy", "name email")
            .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            count: channels.length,
            data: channels,
        });
    } catch (error) {
        console.error("Get Channels Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};