import { Request, Response } from "express";
import Notification from "../models/Notification";
import { formatNotification } from "../services/notification.service";

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const notifications = await Notification.find({ recipient: req.user!.id }).sort({ createdAt: -1 }).limit(50);
    const unreadCount = await Notification.countDocuments({ recipient: req.user!.id, read: false });
    res.status(200).json({ success: true, data: notifications.map(formatNotification), unreadCount });
  } catch (error) {
    console.error("Get Notifications Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const markNotificationRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user!.id }, { read: true }, { new: true }
    );
    if (!notification) {
      res.status(404).json({ success: false, message: "Notification not found" });
      return;
    }
    res.status(200).json({ success: true, data: formatNotification(notification) });
  } catch (error) {
    console.error("Mark Notification Read Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const markAllNotificationsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    await Notification.updateMany({ recipient: req.user!.id, read: false }, { read: true });
    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark All Notifications Read Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
