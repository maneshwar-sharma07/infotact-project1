import React from "react";
import { MessageCircle, Users, Sparkles } from "lucide-react";

const EmptyChat = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-[#0F1117]">
      <div className="text-center">

        <div className="mx-auto mb-8 w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-xl">
          <MessageCircle size={42} className="text-white" />
        </div>

        <h1 className="text-3xl font-bold text-white">
          Welcome to General
        </h1>

        <p className="text-slate-400 mt-3 max-w-md">
          This is the beginning of your workspace conversation.
          Collaborate with your teammates in real-time.
        </p>

        <div className="flex justify-center gap-8 mt-10">

          <div className="flex flex-col items-center">
            <Users className="text-violet-400" />
            <span className="text-xs text-slate-400 mt-2">
              Invite Team
            </span>
          </div>

          <div className="flex flex-col items-center">
            <Sparkles className="text-violet-400" />
            <span className="text-xs text-slate-400 mt-2">
              Start Discussion
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default EmptyChat;