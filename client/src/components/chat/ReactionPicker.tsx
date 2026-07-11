import { AnimatePresence, motion } from "framer-motion";

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "🎉", "👏"] as const;

interface ReactionPickerProps {
  isOpen: boolean;
  onSelect: (emoji: string) => void;
}

const ReactionPicker = ({ isOpen, onSelect }: ReactionPickerProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: 6, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 6, scale: 0.96 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
        className="absolute z-20 -top-12 left-0 flex items-center gap-0.5 rounded-xl border border-white/10 bg-[#171722]/85 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-xl"
        role="menu"
        aria-label="Add a reaction"
      >
        {REACTION_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onSelect(emoji)}
            className="rounded-lg px-1.5 py-1 text-base transition duration-150 hover:-translate-y-0.5 hover:bg-white/10 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-violet-400/70"
            aria-label={`React with ${emoji}`}
            role="menuitem"
          >
            {emoji}
          </button>
        ))}
      </motion.div>
    )}
  </AnimatePresence>
);

export default ReactionPicker;
