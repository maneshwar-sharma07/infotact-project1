import React from "react";
import { Copy, Pencil, Trash2, Reply } from "lucide-react";
import { motion } from "framer-motion";

interface Props { content: string; onReply: () => void; onEdit: () => void; onDelete: () => void; }

const MessageActions: React.FC<Props> = ({ content, onReply, onEdit, onDelete }) => {
  const handleCopy = async () => { await navigator.clipboard.writeText(content); };
  const actionClass = "rounded-lg p-2 text-slate-300 transition hover:-translate-y-0.5 hover:bg-white/10 hover:text-white";
  return (
    <motion.div initial={{ opacity: 0, y: 4, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="absolute right-2 -top-5 z-10 hidden items-center gap-0.5 rounded-xl border border-white/10 bg-[#171722]/95 p-1 shadow-2xl shadow-black/40 backdrop-blur-xl group-hover:flex">
      <button title="Copy" onClick={handleCopy} className={actionClass}><Copy size={15} /></button>
      <button title="Reply" onClick={onReply} className={`${actionClass} hover:bg-violet-500/15 hover:text-violet-200`}><Reply size={15} /></button>
      <button title="Edit" onClick={onEdit} className={actionClass}><Pencil size={15} /></button>
      <button title="Delete" onClick={onDelete} className="rounded-lg p-2 text-red-400 transition hover:-translate-y-0.5 hover:bg-red-500/20"><Trash2 size={15} /></button>
    </motion.div>
  );
};

export default MessageActions;
