import React, { useState } from "react";
import { Bell } from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "Jay mentioned you",
    time: "2 min ago",
  },
  {
    id: 2,
    title: "Workspace created",
    time: "10 min ago",
  },
  {
    id: 3,
    title: "New channel added",
    time: "30 min ago",
  },
];

const NotificationDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-[#1A1A24] transition"
      >
        <Bell size={20} className="text-white" />

        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-[#111118] border border-[#1E293B] rounded-xl shadow-2xl z-50">

          <div className="px-4 py-3 border-b border-[#1E293B]">
            <h2 className="text-white font-semibold">
              Notifications
            </h2>
          </div>

          {notifications.map((item) => (
            <div
              key={item.id}
              className="px-4 py-3 hover:bg-[#1A1A24] cursor-pointer transition"
            >
              <p className="text-sm text-white">
                {item.title}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {item.time}
              </p>
            </div>
          ))}

          <button
            className="w-full py-3 text-violet-400 text-sm hover:bg-[#1A1A24] border-t border-[#1E293B]"
          >
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;