import { AnimatePresence, motion } from "framer-motion";

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "🎉", "🔥", "✅", "👀"] as const;
interface ReactionPickerProps { isOpen: boolean; onSelect: (emoji: string) => void; }

const ReactionPicker = ({ isOpen, onSelect }: ReactionPickerProps) => (
  <AnimatePresence>
    {isOpen && <motion.div initial={{ opacity: 0, y: 6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.96 }} transition={{ duration: 0.16, ease: "easeOut" }} className="absolute -top-14 left-0 z-20 flex items-center gap-0.5 rounded-2xl border border-white/10 bg-[#171722]/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl" role="menu" aria-label="Add a reaction">
      {REACTION_EMOJIS.map((emoji) => <button key={emoji} type="button" onClick={() => onSelect(emoji)} className="rounded-xl px-2 py-1.5 text-base transition duration-150 hover:-translate-y-1 hover:scale-110 hover:bg-violet-500/15 focus:outline-none focus:ring-2 focus:ring-violet-400/70" aria-label={`React with ${emoji}`} role="menuitem">{emoji}</button>)}
    </motion.div>}
  </AnimatePresence>
);

export default ReactionPicker;
