import { Request, Response } from "express";
import Workspace from "../models/Workspace";
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
        const inviteToken = crypto.randomBytes(16).toString("hex");

        const workspace = await Workspace.create({
            name,
            description,
            owner: userId,
            inviteToken,
            members: [userId],
        });

        res.status(201).json({
            success: true,
            message: "Workspace created successfully",
            data: workspace,
            inviteLink: `/api/workspaces/join/${inviteToken}`,
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