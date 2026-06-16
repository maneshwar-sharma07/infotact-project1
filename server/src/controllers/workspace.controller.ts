import { Request, Response } from "express";
import Workspace from "../models/Workspace";

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

        const workspace = await Workspace.create({
            name,
            description,
            owner: userId,
            members: [userId],
        });

        res.status(201).json({
            success: true,
            message: "Workspace created successfully",
            data: workspace,
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
        });

        res.status(200).json({
            success: true,
            count: workspaces.length,
            data: workspaces,
        });
    } catch (error) {
        console.error("Get Workspaces Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};