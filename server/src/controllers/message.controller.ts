import { Request, Response } from "express";
import Message from "../models/Message";
import Channels from "../models/Channels";

export const createMessage = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { content, channelId } = req.body;

        if (!content || !channelId) {
            res.status(400).json({
                success: false,
                message: "Content and channelId are required",
            });
            return;
        }

        const channel = await Channels.findById(channelId);

        if (!channel) {
            res.status(404).json({
                success: false,
                message: "Channel not found",
            });
            return;
        }

        const userId = (req as any).user.id;

        const message = await Message.create({
            content,
            sender: userId,
            channel: channelId,
        });

        res.status(201).json({
            success: true,
            message: "Message created successfully",
            data: message,
        });
    } catch (error) {
        console.error("Create Message Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const getMessages = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const channelId = req.query.channelId as string;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;

        if (!channelId) {
            res.status(400).json({
                success: false,
                message: "channelId is required",
            });
            return;
        }

        const skip = (page - 1) * limit;

        const messages = await Message.find({
            channel: channelId,
        })
            .populate("sender", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Message.countDocuments({
            channel: channelId,
        });

        res.status(200).json({
            success: true,
            total,
            page,
            limit,
            data: messages,
        });
    } catch (error) {
        console.error("Get Messages Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};