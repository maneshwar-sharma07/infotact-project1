import { Router } from 'express';
import mongoose from 'mongoose';
import Message from '../models/Message';
import Channels from '../models/Channels';
import Workspace from '../models/Workspace';
import { verifyToken } from '../middleware/auth';

const router = Router();

// Fetch messages for a specific channel
// GET /api/messages?channelId=XYZ
router.get('/', verifyToken, async (req: any, res: any) => {
  try {
    const channelId = req.query.channelId as string;
    if (!channelId) {
      res.status(400).json({ success: false, error: 'channelId is required' });
      return;
    }

    // 1. Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      res.status(400).json({ success: false, error: 'Invalid channelId format' });
      return;
    }

    // 2. Fetch the channel to get its workspace ID
    const channel = await Channels.findById(channelId);
    if (!channel) {
      res.status(404).json({ success: false, error: 'Channel not found' });
      return;
    }

    // 3. Fetch workspace and check member authorization
    const workspace = await Workspace.findById(channel.workspace);
    if (!workspace) {
      res.status(404).json({ success: false, error: 'Workspace not found for this channel' });
      return;
    }

    const userId = req.user?.id;
    const isMember = workspace.members.some((m: any) => m.toString() === userId);
    if (!isMember) {
      res.status(403).json({ success: false, error: 'Access denied: You are not a member of this workspace' });
      return;
    }

    // 4. Retrieve messages
    const messages = await Message.find({ channel: channelId })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 });

    const formattedMessages = messages.map((msg: any) => ({
      id: msg._id.toString(),
      senderId: msg.sender?._id?.toString() || msg.sender?.toString() || '',
      senderName: msg.sender?.name || 'User',
      channelId: msg.channel.toString(),
      content: msg.content,
      timestamp: msg.createdAt.toISOString(),
    }));

    res.status(200).json({
      success: true,
      data: formattedMessages,
    });
  } catch (error) {
    console.error('Error in GET /messages:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Create a message in a specific channel
// POST /api/messages
router.post('/', verifyToken, async (req: any, res: any) => {
  try {
    const { content, channelId } = req.body;
    if (!content || !channelId) {
      res.status(400).json({ success: false, error: 'Content and channelId are required' });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      res.status(400).json({ success: false, error: 'Invalid channelId format' });
      return;
    }

    const channel = await Channels.findById(channelId);
    if (!channel) {
      res.status(404).json({ success: false, error: 'Channel not found' });
      return;
    }

    const workspace = await Workspace.findById(channel.workspace);
    if (!workspace) {
      res.status(404).json({ success: false, error: 'Workspace not found for this channel' });
      return;
    }

    const userId = req.user?.id;
    const isMember = workspace.members.some((m: any) => m.toString() === userId);
    if (!isMember) {
      res.status(403).json({ success: false, error: 'Access denied: You are not a member of this workspace' });
      return;
    }

    const message = await Message.create({
      content,
      sender: userId,
      channel: channelId,
    });

    const populatedMessage = await message.populate('sender', 'name email');

    res.status(201).json({
      success: true,
      message: 'Message created successfully',
      data: {
        id: populatedMessage._id.toString(),
        senderId: userId,
        senderName: (populatedMessage.sender as any)?.name || 'User',
        channelId: channelId,
        content: populatedMessage.content,
        timestamp: populatedMessage.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in POST /messages:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
