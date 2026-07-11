import { motion } from "framer-motion";

interface ReactionBubbleProps {
  emoji: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

const ReactionBubble = ({ emoji, count, isActive, onClick }: ReactionBubbleProps) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ y: -2, scale: 1.04 }}
    whileTap={{ scale: 0.96 }}
    className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400/70 ${
      isActive
        ? "border-violet-400/80 bg-gradient-to-r from-violet-500/30 to-fuchsia-500/25 text-violet-100"
        : "border-white/10 bg-gradient-to-r from-white/10 to-white/5 text-slate-200 hover:border-white/20 hover:from-white/15"
    }`}
    aria-label={`${emoji} reaction, ${count} ${count === 1 ? "person" : "people"}`}
  >
    <span>{emoji}</span>
    <span>{count}</span>
  </motion.button>
);

export default ReactionBubble;
