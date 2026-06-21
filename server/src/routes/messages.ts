import { Router } from 'express';
import Message from '../models/Message';
import { verifyToken } from '../middleware/auth';

const router = Router();

// Fetch messages for a specific channel
// GET /api/messages?channelId=XYZ
router.get('/', verifyToken, async (req, res) => {
  try {
    const channelId = req.query.channelId as string;
    if (!channelId) {
      res.status(400).json({ error: 'channelId is required' });
      return;
    }

    const messages = await Message.find({ channel: channelId })
      .populate('sender', 'name')
      .sort({ createdAt: 1 });

    const formattedMessages = messages.map((msg: any) => ({
      id: msg._id.toString(),
      senderId: msg.sender?._id?.toString() || msg.sender?.toString() || '',
      senderName: msg.sender?.name || 'User',
      channelId: msg.channel.toString(),
      content: msg.content,
      timestamp: msg.createdAt.toISOString(),
    }));

    res.status(200).json(formattedMessages);
  } catch (error) {
    console.error('Error in GET /messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
