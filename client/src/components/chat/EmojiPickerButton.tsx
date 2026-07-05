import React, { useState } from "react";
import { Smile } from "lucide-react";

const emojis = [
  "😀","😂","😍","😎","🔥","🚀","❤️","👍",
  "👏","🎉","😢","🤔","😁","🥳","💯","✨"
];

interface Props {
  onSelect: (emoji: string) => void;
}

const EmojiPickerButton: React.FC<Props> = ({ onSelect }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-[#1A1A24] transition"
      >
        <Smile size={18} className="text-[#94A3B8]" />
      </button>

      {open && (
        <div className="absolute bottom-12 left-0 w-56 bg-[#111118] border border-[#1E293B] rounded-xl p-3 grid grid-cols-4 gap-2 shadow-xl z-50">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className="text-xl hover:scale-125 transition"
              onClick={() => {
                onSelect(emoji);
                setOpen(false);
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmojiPickerButton;