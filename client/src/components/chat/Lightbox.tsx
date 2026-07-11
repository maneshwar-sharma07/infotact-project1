import React, { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  images: { src: string; alt: string }[];
  initialIndex?: number;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({
  images,
  initialIndex = 0,
  onClose,
}) => {
  const [index, setIndex] = React.useState(initialIndex);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + images.length) % images.length);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [images.length, onClose]);

  if (!images.length) return null;

  const current = images[index]!;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/10 p-2 text-white transition hover:bg-white/20"
        aria-label="Close preview"
      >
        <X size={20} />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i - 1 + images.length) % images.length);
            }}
            className="absolute left-4 rounded-full border border-white/10 bg-white/10 p-3 text-white transition hover:bg-white/20"
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i + 1) % images.length);
            }}
            className="absolute right-4 rounded-full border border-white/10 bg-white/10 p-3 text-white transition hover:bg-white/20"
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      <img
        src={current.src}
        alt={current.alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl shadow-black/50"
      />

      {images.length > 1 && (
        <div className="absolute bottom-6 rounded-full bg-black/50 px-4 py-1.5 text-sm text-white/80">
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default Lightbox;
