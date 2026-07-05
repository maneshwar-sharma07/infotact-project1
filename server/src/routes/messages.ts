import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import Message from "../models/Message";
import Channels from "../models/Channels";
import Workspace from "../models/Workspace";
import { verifyToken } from "../middlewares/verifyToken";

const router = Router();

/* -------------------------------------------------------------------------- */
/*                                GET MESSAGES                                */
/* -------------------------------------------------------------------------- */

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const channelId = req.query.channelId as string;

    if (!channelId) {
      res.status(400).json({
        success: false,
        error: "channelId is required",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      res.status(400).json({
        success: false,
        error: "Invalid channelId format",
      });
      return;
    }

    const channel = await Channels.findById(channelId);

    if (!channel) {
      res.status(404).json({
        success: false,
        error: "Channel not found",
      });
      return;
    }

    const workspace = await Workspace.findById(channel.workspace);

    if (!workspace) {
      res.status(404).json({
        success: false,
        error: "Workspace not found",
      });
      return;
    }

    const userId = req.user?.id;

    const isMember = workspace.members.some(
      (member: any) => member.toString() === userId
    );

    if (!isMember) {
      res.status(403).json({
        success: false,
        error: "Access denied",
      });
      return;
    }

    const messages = await Message.find({
      channel: channelId,
    })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    const formattedMessages = messages.map((msg: any) => ({
      id: msg._id.toString(),
      senderId: msg.sender?._id?.toString() || "",
      senderName: msg.sender?.name || "User",
      channelId: msg.channel.toString(),
      content: msg.content,
      timestamp: msg.createdAt.toISOString(),
    }));

    res.status(200).json({
      success: true,
      data: formattedMessages,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

/* -------------------------------------------------------------------------- */
/*                               CREATE MESSAGE                               */
/* -------------------------------------------------------------------------- */

router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const { content, channelId } = req.body;

    if (!content || !channelId) {
      res.status(400).json({
        success: false,
        error: "Content and channelId are required",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      res.status(400).json({
        success: false,
        error: "Invalid channelId format",
      });
      return;
    }

    const channel = await Channels.findById(channelId);

    if (!channel) {
      res.status(404).json({
        success: false,
        error: "Channel not found",
      });
      return;
    }

    const workspace = await Workspace.findById(channel.workspace);

    if (!workspace) {
      res.status(404).json({
        success: false,
        error: "Workspace not found",
      });
      return;
    }

    const userId = req.user?.id;

    const isMember = workspace.members.some(
      (member: any) => member.toString() === userId
    );

    if (!isMember) {
      res.status(403).json({
        success: false,
        error: "Access denied",
      });
      return;
    }

    const message = await Message.create({
      content,
      sender: userId,
      channel: channelId,
    });

    const populatedMessage = await message.populate("sender", "name email");

    res.status(201).json({
      success: true,
      data: {
        id: populatedMessage._id.toString(),
        senderId: userId,
        senderName: (populatedMessage.sender as any)?.name || "User",
        channelId,
        content: populatedMessage.content,
        timestamp: populatedMessage.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

/* -------------------------------------------------------------------------- */
/*                                EDIT MESSAGE                                */
/* -------------------------------------------------------------------------- */

router.patch("/:messageId", verifyToken, async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    if (!content) {
      res.status(400).json({
        success: false,
        error: "Content is required",
      });
      return;
    }

    const message = await Message.findById(messageId);

    if (!message) {
      res.status(404).json({
        success: false,
        error: "Message not found",
      });
      return;
    }

    if (message.sender.toString() !== req.user?.id) {
      res.status(403).json({
        success: false,
        error: "You can edit only your own message",
      });
      return;
    }

    message.content = content;
    await message.save();

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

/* -------------------------------------------------------------------------- */
/*                               DELETE MESSAGE                               */
/* -------------------------------------------------------------------------- */

router.delete("/:messageId", verifyToken, async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      res.status(404).json({
        success: false,
        error: "Message not found",
      });
      return;
    }

    if (message.sender.toString() !== req.user?.id) {
      res.status(403).json({
        success: false,
        error: "You can delete only your own message",
      });
      return;
    }

    await Message.findByIdAndDelete(messageId);

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

export default router;