import { Request, Response } from "express";
import Message from "../models/Message";
import Channels from "../models/Channels";
import { io } from "../socket/socketServer";

// ======================
// Create Message
// ======================
export const createMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content, channelId, replyTo } = req.body;
    const userId = req.user!.id;

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

    const message = await Message.create({
      content,
      sender: userId,
      channel: channelId,
      replyTo: replyTo || null,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email")
      .populate({
        path: "replyTo",
        populate: {
          path: "sender",
          select: "name",
        },
      });

    if (!populatedMessage) {
      res.status(404).json({
        success: false,
        message: "Message not found",
      });
      return;
    }

    // Emit via Socket.IO
    io.to(channelId).emit("chat:message", {
      id: populatedMessage._id.toString(),
      senderId: userId,
      senderName: (populatedMessage.sender as any).name,
      channelId,
      content: populatedMessage.content,
      timestamp: populatedMessage.createdAt,
      replyTo: populatedMessage.replyTo
        ? {
            id: (populatedMessage.replyTo as any)._id.toString(),
            content: (populatedMessage.replyTo as any).content,
            senderName: (populatedMessage.replyTo as any).sender?.name || "User",
          }
        : undefined,
    });

    res.status(201).json({
      success: true,
      message: "Message created successfully",
      data: {
        id: populatedMessage._id,
        content: populatedMessage.content,
        senderId: userId,
        senderName: (populatedMessage.sender as any).name,
        channelId,
        timestamp: populatedMessage.createdAt,
        replyTo: populatedMessage.replyTo
          ? {
              id: (populatedMessage.replyTo as any)._id,
              content: (populatedMessage.replyTo as any).content,
              senderName: (populatedMessage.replyTo as any).sender?.name || "User",
            }
          : undefined,
      },
    });
  } catch (error) {
    console.error("Create Message Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ======================
// Get Messages
// ======================
export const getMessages = async (req: Request, res: Response): Promise<void> => {
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

    const messages = await Message.find({ channel: channelId })
      .populate("sender", "name email")
      .populate({
        path: "replyTo",
        populate: {
          path: "sender",
          select: "name",
        },
      })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments({ channel: channelId });

    const formatted = messages.map((msg: any) => ({
      id: msg._id,
      content: msg.content,
      senderId: msg.sender?._id,
      senderName: msg.sender?.name,
      channelId: msg.channel,
      timestamp: msg.createdAt,
      replyTo: msg.replyTo
        ? {
            id: msg.replyTo._id,
            content: msg.replyTo.content,
            senderName: msg.replyTo.sender?.name || "User",
          }
        : undefined,
    }));

    res.status(200).json({
      success: true,
      total,
      page,
      limit,
      data: formatted,
    });
  } catch (error) {
    console.error("Get Messages Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ======================
// Update Message
// ======================
export const updateMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user!.id;

    const message = await Message.findById(id);

    if (!message) {
      res.status(404).json({
        success: false,
        message: "Message not found",
      });
      return;
    }

    if (message.sender.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    message.content = content;
    await message.save();

    res.status(200).json({
      success: true,
      message: "Message updated successfully",
      data: message,
    });
  } catch (error) {
    console.error("Update Message Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ======================
// Delete Message
// ======================
export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const message = await Message.findById(id);

    if (!message) {
      res.status(404).json({
        success: false,
        message: "Message not found",
      });
      return;
    }

    if (message.sender.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Delete Message Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
