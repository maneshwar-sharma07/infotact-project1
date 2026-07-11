import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, Info, XCircle } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const toastStyles: Record<ToastType, string> = {
  success: "border-emerald-500/25 bg-emerald-500/10 text-emerald-100",
  error: "border-red-500/25 bg-red-500/10 text-red-100",
  info: "border-violet-500/25 bg-violet-500/10 text-violet-100",
};

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={18} className="text-emerald-300" />,
  error: <XCircle size={18} className="text-red-300" />,
  info: <Info size={18} className="text-violet-300" />,
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((current) => [...current, { id, message, type }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[80] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300 animate-fade-in ${toastStyles[toast.type]}`}
          >
            {toastIcons[toast.type]}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};
