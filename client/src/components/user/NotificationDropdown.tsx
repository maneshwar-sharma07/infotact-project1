import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import api from "../../services/api.ts";
import { socket } from "../../services/socket.ts";

interface Notification { id: string; title: string; body: string; read: boolean; createdAt: string; }

const formatTime = (date: string) => {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 60000));
  return minutes < 1 ? "Just now" : minutes < 60 ? `${minutes} min ago` : new Date(date).toLocaleDateString();
};

const NotificationDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/notifications');
        setNotifications(response.data.data || []);
        setUnreadCount(response.data.unreadCount || 0);
      } catch (error) { console.error('Failed to load notifications:', error); }
    };
    void load();
    const onNewNotification = (notification: Notification) => {
      setNotifications((current) => [notification, ...current.filter((item) => item.id !== notification.id)]);
      setUnreadCount((current) => current + (notification.read ? 0 : 1));
    };
    socket.on('notification:new', onNewNotification);
    return () => { socket.off('notification:new', onNewNotification); };
  }, []);

  const markRead = async (id: string) => {
    const notification = notifications.find((item) => item.id === id);
    if (!notification || notification.read) return;
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((current) => current.map((item) => item.id === id ? { ...item, read: true } : item));
      setUnreadCount((current) => Math.max(0, current - 1));
    } catch (error) { console.error('Failed to mark notification as read:', error); }
  };

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((current) => current.map((item) => ({ ...item, read: true })));
      setUnreadCount(0);
    } catch (error) { console.error('Failed to mark all notifications as read:', error); }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-[#1A1A24] transition"
      >
        <Bell size={20} className="text-white" />

        {unreadCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />}
      </button>

      <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.18 }} className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#111118]/95 shadow-2xl shadow-black/50 backdrop-blur-xl">

          <div className="px-4 py-3 border-b border-[#1E293B]">
            <h2 className="text-white font-semibold">
              Notifications
            </h2>
          </div>

          {notifications.length === 0 && <p className="px-4 py-5 text-sm text-gray-500">No notifications yet.</p>}
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => void markRead(item.id)}
              className={`cursor-pointer border-l-2 px-4 py-3 transition hover:bg-white/[0.05] ${item.read ? 'border-transparent' : 'border-violet-400 bg-violet-500/[0.04]'}`}
            >
              <p className="text-sm text-white">
                {item.title}
              </p>

              {item.body && <p className="mt-1 text-xs text-gray-400">{item.body}</p>}

              <p className="text-xs text-gray-500 mt-1">
                {formatTime(item.createdAt)}
              </p>
            </div>
          ))}

          <button
            onClick={() => void markAllRead()}
            className="w-full py-3 text-violet-400 text-sm hover:bg-[#1A1A24] border-t border-[#1E293B]"
          >
            Mark all as read
          </button>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
